// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 加载课程数据
    loadCourses();
    
    // 初始化视图状态
    switchToWeekView();
});

// 切换到周视图
function switchToWeekView() {
    document.getElementById('week-view').classList.add('active');
    document.getElementById('day-view').classList.remove('active');
    
    document.querySelectorAll('.btn-view')[0].classList.add('active');
    document.querySelectorAll('.btn-view')[1].classList.remove('active');
}

// 切换到日视图
function switchToDayView() {
    document.getElementById('week-view').classList.remove('active');
    document.getElementById('day-view').classList.add('active');
    
    document.querySelectorAll('.btn-view')[0].classList.remove('active');
    document.querySelectorAll('.btn-view')[1].classList.add('active');
    
    // 默认显示今天的课程
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    filterDayCourses(today);
}

// 加载所有课程
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        
        const data = await response.json();
        if (data.success) {
            renderWeekSchedule(data.data);
            renderDaySchedule(data.data);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('week-schedule-body').innerHTML = 
            '<tr><td colspan="8" class="text-center">无法加载课程数据</td></tr>';
        document.getElementById('day-schedule-body').innerHTML = 
            '<tr><td colspan="4" class="text-center">无法加载课程数据</td></tr>';
    }
}

// 渲染周视图课程表
function renderWeekSchedule(courses) {
    const tableBody = document.getElementById('week-schedule-body');
    tableBody.innerHTML = '';
    
    // 获取所有独特的时间段并排序
    const timeSlots = [...new Set(courses.map(course => course.time))].sort((a, b) => {
        return a.localeCompare(b);
    });
    
    if (timeSlots.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">没有课程数据</td></tr>';
        return;
    }
    
    // 创建一周中的所有天
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // 为每个时间段创建一行
    timeSlots.forEach(time => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${time}</td>`;
        
        // 为每天添加单元格
        days.forEach(day => {
            const course = courses.find(c => c.time === time && c.day === day);
            const cellContent = course ? course.name : '';
            row.innerHTML += `<td>${cellContent}</td>`;
        });
        
        tableBody.appendChild(row);
    });
}

// 渲染日视图课程表
function renderDaySchedule(courses) {
    // 存储所有课程数据供日视图筛选使用
    window.allCourses = courses;
}

// 筛选指定日期的课程
function filterDayCourses(day) {
    const tableBody = document.getElementById('day-schedule-body');
    tableBody.innerHTML = '';
    
    if (!window.allCourses || window.allCourses.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center">没有课程数据</td></tr>';
        return;
    }
    
    // 获取指定日期的课程并按时间排序
    const dayCourses = window.allCourses
        .filter(course => course.day.toLowerCase() === day.toLowerCase())
        .sort((a, b) => a.time.localeCompare(b.time));
    
    if (dayCourses.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center">${day}没有课程</td></tr>`;
        return;
    }
    
    // 渲染课程
    dayCourses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.time}</td>
            <td>${course.name}</td>
            <td>${course.teacher}</td>
            <td>${course.location}</td>
        `;
        tableBody.appendChild(row);
    });
}
