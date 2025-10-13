const fs = require('fs');
const path = require('path');

// 数据文件路径
const homeworksPath = path.join(__dirname, '../data/homeworks.json');

// 初始化数据文件
function initialize() {
  if (!fs.existsSync(homeworksPath)) {
    fs.writeFileSync(homeworksPath, JSON.stringify([]), 'utf8');
  }
}

// 获取所有作业
function getHomeworks() {
  initialize();
  const data = fs.readFileSync(homeworksPath, 'utf8');
  return JSON.parse(data);
}

// 添加新作业
function addHomework(homework) {
  if (!homework.courseName || !homework.dueDate || !homework.requirements) {
    throw new Error('课程名称、截止日期和作业要求为必填项');
  }
  
  const homeworks = getHomeworks();
  const newHomework = {
    id: homeworks.length > 0 ? Math.max(...homeworks.map(h => h.id)) + 1 : 1,
    ...homework,
    status: homework.status || '未完成'
  };
  
  homeworks.push(newHomework);
  fs.writeFileSync(homeworksPath, JSON.stringify(homeworks, null, 2), 'utf8');
  return newHomework;
}

// 更新作业
function updateHomework(id, updates) {
  const homeworks = getHomeworks();
  const index = homeworks.findIndex(h => h.id === id);
  
  if (index === -1) {
    throw new Error('未找到该作业');
  }
  
  homeworks[index] = { ...homeworks[index], ...updates };
  fs.writeFileSync(homeworksPath, JSON.stringify(homeworks, null, 2), 'utf8');
  return homeworks[index];
}

// 删除作业
function deleteHomework(id) {
  let homeworks = getHomeworks();
  const initialLength = homeworks.length;
  
  homeworks = homeworks.filter(h => h.id !== id);
  
  if (homeworks.length === initialLength) {
    throw new Error('未找到该作业');
  }
  
  fs.writeFileSync(homeworksPath, JSON.stringify(homeworks, null, 2), 'utf8');
}

module.exports = {
  getHomeworks,
  addHomework,
  updateHomework,
  deleteHomework
};
