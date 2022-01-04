const db = require('../../db/mysql')
const joi = require('@hapi/joi')
const bcrypt = require('bcryptjs')
const schema = joi.object({
	nickname: joi.string().min(2).max(10).required().error(new Error('请输入正确规则的nickname')),
	email: joi.string().email().error(new Error('请输入正确规则的email')),
	user_pic:joi.string().dataUri()
});
const password = joi.string().min(6).max(12).pattern(/^[\S]{6,12}$/).error(new Error('请输入正确规则的password'))
const pwdSchema = joi.object({
	password
});

let sqlStr = "select * from users where username = ?"
exports.getUserInfo = (req,res)=>{
	db.query(sqlStr,req.user.username,(err,results)=>{
		if(err) return res.cc(403,err.message)
		res.ss(200,'success',results[0])
	})
}
let sqlStr1 = "update users set ? where id = ?"
exports.updateUserInfo = async (req,res)=>{
	let userMes = {
		nickname:req.body.nickname,
		email: req.body.email,
		user_pic:req.body.user_pic
	}
	try {
		// 实施验证
		await schema.validateAsync({
		    nickname:userMes.nickname,
		    email:userMes.email,
		    user_pic:userMes.user_pic
		})  	
	} catch (e) {
		    return res.cc(403,e.message);
	}
	//表单验证后 进行数据库查询
	db.query(sqlStr1,[userMes,req.user.id],(err,results)=>{
		if(err) return res.cc(403,err.message)
		if(results.affectedRows != 0)
		{
			res.cc(200,'修改成功')
		}
	})
}
//修改密码
let sqlStr2 = "update users set password = ? where id = ?"
exports.changePwd = async (req,res)=>{
	let newPwd = req.body.newPwd
	let oldPwd = req.body.oldPwd
	try {
		// 实施验证
		await pwdSchema.validateAsync({
		    password:newPwd
		})  	
	} catch (e) {
		return res.cc(403,e.message);
	}
	const compare =  bcrypt.compareSync(oldPwd,req.user.password)
	if(!compare) return res.cc(403,'新旧密码不能一致!')
	newPwd = bcrypt.hashSync(newPwd,12)

	db.query(sqlStr2,[newPwd,req.user.id],(err,results)=>{
		if(err) return res.cc(403,err.message)
		if(results.affectedRows != 0)
		{
			return res.cc(200,'修改成功')
		}
		res.cc(403,err.message)
	})
}