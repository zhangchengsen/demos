const express = require('express')
const router = express.Router()
const nav = require('./navFunc/navApi')

router.post('/register',nav.register)

router.post('/login',nav.login)



module.exports = router