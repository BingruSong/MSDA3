const fs = require('fs');
const path = require('path');

// 数据文件路径
const coursesPath = path.join(__dirname, '../data/courses.json');

// 初始化数据文件
function initialize() {
  if (!fs.existsSync(coursesPath)) {
    fs.writeFileSync(coursesPath, JSON.stringify([]), 'utf8');
  }
}

// 获取所有课程
function getCourses() {
  initialize();
  const data = fs.readFileSync(coursesPath, 'utf8');
  return JSON.parse(data);
}

module.exports = {
  getCourses
};
