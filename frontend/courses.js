document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    document.getElementById('course-form').addEventListener('submit', addCourse);
});

// 加载课程列表
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        if (data.success) {
            renderCoursesTable(data.data);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// 渲染课程表格
function renderCoursesTable(courses) {
    const tbody = document.querySelector('#courses-table tbody');
    tbody.innerHTML = '';
    
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.instructor}</td>
            <td>${course.location}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editCourse(${course.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCourse(${course.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 添加课程
async function addCourse(e) {
    e.preventDefault();
    const newCourse = {
        name: document.getElementById('course-name').value,
        instructor: document.getElementById('instructor').value,
        location: document.getElementById('location').value
    };

    try {
        const response = await fetch('/api/course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCourse)
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('course-form').reset();
            loadCourses();
        }
    } catch (error) {
        console.error('Error adding course:', error);
    }
}

// 全局暴露函数
window.editCourse = (id) => { /* 编辑逻辑 */ };
window.deleteCourse = async (id) => {
    if (confirm('确定删除该课程？')) {
        try {
            await fetch(`/api/course/${id}`, { method: 'DELETE' });
            loadCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    }
};