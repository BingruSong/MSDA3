// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 加载作业列表
    loadHomeworks();
    
    // 绑定表单提交事件
    document.getElementById('homework-form').addEventListener('submit', addHomework);
    
    // 绑定编辑表单提交事件
    document.getElementById('edit-form').addEventListener('submit', saveEditHomework);
    
    // 绑定模态框关闭事件
    document.querySelector('.close-btn').addEventListener('click', closeModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('edit-modal');
        if (e.target === modal) {
            closeModal();
        }
    });
});

// 加载所有作业
async function loadHomeworks() {
    try {
        const response = await fetch('/api/homeworks');
        if (!response.ok) {
            throw new Error('Failed to fetch homeworks');
        }
        
        const data = await response.json();
        if (data.success) {
            renderHomeworkTable(data.data);
        }
    } catch (error) {
        console.error('Error loading homeworks:', error);
        document.getElementById('homework-table tbody').innerHTML = 
            '<tr><td colspan="6" class="text-center">无法加载作业数据</td></tr>';
    }
}

// 渲染作业表格
function renderHomeworkTable(homeworks) {
    const tableBody = document.querySelector('#homework-table tbody');
    tableBody.innerHTML = '';
    
    if (homeworks.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">没有作业数据</td></tr>';
        return;
    }
    
    // 按截止日期排序
    homeworks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    homeworks.forEach(homework => {
        const statusClass = homework.status === '已完成' ? 'status-done' : 'status-not-done';
        
        const attachmentHtml = homework.attachment 
            ? `<a href="#" class="attachment-link">${homework.attachment}</a>`
            : 'No attachment';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${homework.courseName}</td>
            <td>${formatDate(homework.dueDate)}</td>
            <td>${homework.requirements}</td>
            <td>${attachmentHtml}</td>
            <td><span class="status ${statusClass}">${homework.status}</span></td>
            <td>
                <button class="btn btn-edit" onclick="editHomework(${homework.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-delete" onclick="deleteHomework(${homework.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 添加新作业
async function addHomework(e) {
    e.preventDefault();
    
    const newHomework = {
        courseName: document.getElementById('course-name').value,
        dueDate: document.getElementById('due-date').value,
        requirements: document.getElementById('requirements').value,
        attachment: document.getElementById('attachment').value,
        status: '未完成'
    };
    
    try {
        const response = await fetch('/api/homework', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newHomework)
        });
        
        const data = await response.json();
        if (data.success) {
            // 重置表单
            document.getElementById('homework-form').reset();
            // 重新加载作业列表
            loadHomeworks();
            alert('作业添加成功');
        } else {
            throw new Error(data.message || '添加作业失败');
        }
    } catch (error) {
        console.error('Error adding homework:', error);
        alert('添加作业失败: ' + error.message);
    }
}

// 编辑作业
async function editHomework(id) {
    try {
        const response = await fetch('/api/homeworks');
        if (!response.ok) {
            throw new Error('Failed to fetch homeworks');
        }
        
        const data = await response.json();
        if (data.success) {
            const homework = data.data.find(hw => hw.id === id);
            if (homework) {
                // 填充编辑表单
                document.getElementById('edit-id').value = homework.id;
                document.getElementById('edit-course-name').value = homework.courseName;
                document.getElementById('edit-due-date').value = homework.dueDate;
                document.getElementById('edit-requirements').value = homework.requirements;
                document.getElementById('edit-attachment').value = homework.attachment || '';
                document.getElementById('edit-status').value = homework.status;
                
                // 显示模态框
                document.getElementById('edit-modal').style.display = 'block';
            } else {
                throw new Error('未找到该作业');
            }
        }
    } catch (error) {
        console.error('Error editing homework:', error);
        alert('编辑作业失败: ' + error.message);
    }
}

// 保存编辑后的作业
async function saveEditHomework(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('edit-id').value);
    const updatedHomework = {
        courseName: document.getElementById('edit-course-name').value,
        dueDate: document.getElementById('edit-due-date').value,
        requirements: document.getElementById('edit-requirements').value,
        attachment: document.getElementById('edit-attachment').value,
        status: document.getElementById('edit-status').value
    };
    
    try {
        const response = await fetch(`/api/homework/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedHomework)
        });
        
        const data = await response.json();
        if (data.success) {
            // 关闭模态框
            closeModal();
            // 重新加载作业列表
            loadHomeworks();
            alert('作业更新成功');
        } else {
            throw new Error(data.message || '更新作业失败');
        }
    } catch (error) {
        console.error('Error updating homework:', error);
        alert('更新作业失败: ' + error.message);
    }
}

// 删除作业
async function deleteHomework(id) {
    if (confirm('确定要删除这个作业吗？')) {
        try {
            const response = await fetch(`/api/homework/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            if (data.success) {
                // 重新加载作业列表
                loadHomeworks();
                alert('作业删除成功');
            } else {
                throw new Error(data.message || '删除作业失败');
            }
        } catch (error) {
            console.error('Error deleting homework:', error);
            alert('删除作业失败: ' + error.message);
        }
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// 格式化日期显示
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// 全局暴露函数，供HTML调用
window.editHomework = editHomework;
window.deleteHomework = deleteHomework;
