const express = require('express');
const router = express.Router();
const path = require('path');

// 首页路由
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/reminder.html'));
});

// 课程表路由
router.get('/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/schedule.html'));
});

// 作业管理路由
router.get('/homework', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/homework.html'));
});

// 在现有路由基础上添加
router.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/courses.html'));
});

module.exports = router;