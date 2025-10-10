const express = require('express');
const router = express.Router();
const courseModel = require('../models/courseModel');
const homeworkModel = require('../models/homeworkModel');

// 获取所有课程
router.get('/courses', (req, res) => {
  try {
    const courses = courseModel.getCourses();
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取所有作业
router.get('/homeworks', (req, res) => {
  try {
    const homeworks = homeworkModel.getHomeworks();
    res.json({ success: true, data: homeworks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加新作业
router.post('/homework', (req, res) => {
  try {
    const newHomework = homeworkModel.addHomework(req.body);
    res.status(201).json({ 
      success: true, 
      message: '作业添加成功', 
      data: newHomework 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 更新作业
router.put('/homework/:id', (req, res) => {
  try {
    const updated = homeworkModel.updateHomework(parseInt(req.params.id), req.body);
    res.json({ 
      success: true, 
      message: '作业更新成功', 
      data: updated 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 删除作业
router.delete('/homework/:id', (req, res) => {
  try {
    homeworkModel.deleteHomework(parseInt(req.params.id));
    res.json({ success: true, message: '作业删除成功' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
