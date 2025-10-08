const express = require('express');
const path = require('path');
const pageRoutes = require('./routes/pageRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const port = 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname, '../frontend')));

// 路由注册
app.use('/', pageRoutes);
app.use('/api', apiRoutes);

// 404处理
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});