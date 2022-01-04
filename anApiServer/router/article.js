const express = require('express')
const multer = require('multer')	//导入解析数据的 multer
const path = require('path')
const upload = multer({dest:path.join(__dirname,'../uploads')})
const router = express.Router()
const api = require('./navFunc/articleApi')
router.post('/add',upload.single('cover_img'),api.add)

module.exports = router