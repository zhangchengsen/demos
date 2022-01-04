const express = require('express')
const router = express.Router()
myApi = require('./navFunc/myApi')
router.get('/userInfo',myApi.getUserInfo)
router.post('/userInfo',myApi.updateUserInfo)
router.post('/changePwd',myApi.changePwd)


module.exports = router