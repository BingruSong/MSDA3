document.addEventListener('DOMContentLoaded', () => {
    // 模拟作业数据
    const assignments = [
        {
            course: "Advanced Mathematics",
            dueDate: "2025-10-20",
            daysLeft: "Due Today",
            requirements: "Complete workbook pages 35-38",
            attachment: "homework-math.pdf"
        },
        {
            course: "Computer Fundamentals",
            dueDate: "2025-10-22",
            daysLeft: "2 days",
            requirements: "Submit first lab report",
            attachment: ""
        }
    ];

    // 渲染作业表格
    const tbody = document.querySelector('#upcoming-assignments tbody');
    assignments.forEach(assign => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${assign.course}</td>
            <td>${assign.dueDate}</td>
            <td class="${assign.daysLeft === 'Due Today' ? 'text-danger font-weight-bold' : ''}">${assign.daysLeft}</td>
            <td>${assign.requirements}</td>
            <td>${assign.attachment ? `<a href="#" class="text-info">${assign.attachment}</a>` : 'No attachment'}</td>
        `;
        tbody.appendChild(row);
    });
});