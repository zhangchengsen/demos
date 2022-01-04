const mysql = require('mysql')
const db = mysql.createPool({
	host:"localhost",
	port:"3306",
	database:"ev-user",
	user:"root",
	password:"123456",
})

module.exports = db