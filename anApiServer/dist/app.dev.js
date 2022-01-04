"use strict";

var express = require('express');

var cors = require('cors'); //导入中间件


var app = express(); //启动服务器

var joi = require('@hapi/joi');

var config = require('./config');

var expressJWT = require('express-jwt');

var apiRouter = require('./router/api');

var myRouter = require('./router/myApi');

var artRouter = require('./router/artApi');

var articleRouter = require('./router/article');

app.use(expressJWT({
  secret: config.jwtSecretKey
}).unless({
  path: [/^\/api\//]
}));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(function (req, res, next) {
  res.cc = function (num, err) {
    // 失败函数
    res.send({
      status: num,
      msg: err instanceof Error ? err.message : err
    });
  };

  res.ss = function (num, msg, data) {
    // 成功函数
    res.send({
      status: num,
      msg: msg,
      data: data
    });
  };

  next();
});
app.use('/api', apiRouter); // 登录导航

app.use('/my', myRouter); // my导航 都得携带请求头 Authorization

app.use('/art', artRouter); // 分类导航

app.use('/article', articleRouter); // 文章导航

app.use(function (err, req, res, next) {
  if (err.name == "UnauthorizedError") return res.cc('身份认证失败');
  res.cc(403, "未知的错误");
});
app.use(cors()); // 使用跨域

app.listen(3007, function () {
  //监听3007端口
  console.log('server is running at http://127.0.0.1:3007');
});