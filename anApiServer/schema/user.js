const joi = require('@hapi/joi')
exports.reg_schema ={
	body:{
		username:joi.string().alphanum().min(2).max(10).required(),
		password:joi.string().pattern(/^[\S]{6,12}$/).required()
	}
}