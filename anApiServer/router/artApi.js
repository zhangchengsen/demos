const express = require('express')
const router  = express.Router()
const artApi = require('./navFunc/artApi')

router.get('/cates',artApi.cates)
router.get('/delete/:id',artApi.delete)
router.get('/cates/:id',artApi.getCate)
router.post('/update',artApi.update)

module.exports = router