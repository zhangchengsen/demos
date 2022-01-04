const db = require('../../db/mysql')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config')
let insert = "insert into users set  ?"  // 插入数据
let search = "select username from users where username = ?"
let searchpwd = "select * from users where username = ?"
const joi = require('@hapi/joi')
const schema = joi.object({
	username: joi.string().min(2).max(10).required().error(new Error('请输入正确规则的username')),
	password: joi.string().min(6).max(12).pattern(/^[\S]{6,12}$/).error(new Error('请输入正确规则的password'))
});



exports.register =  async (req,res)=>{		// 注册接口

	try {
	    // 实施验证
	    await schema.validateAsync({
		username:req.body.username,
		password:req.body.password
	    })  	
	} catch (e) {
		return res.cc(403,e.message);
	}
	db.query(search,req.body.username,(err,results)=>{	//查询是否有用户名
		if(err || results.length > 0)
		{
			return res.cc(403,err.message)
		}
		else
		{
			req.body.password = bcrypt.hashSync(req.body.password,12)
			db.query(insert,req.body,(error,ret)=>{
				if(error)
				{
					return res.cc(403,error.message)
				}
				res.ss(200,'注册成功')
			})
			
		}
	})
}
exports.login = async(req,res)=>{
	try {
		// 实施验证
		await schema.validateAsync({
		    username:req.body.username,
		    password:req.body.password
		})  	
	    } catch (e) {
		    return res.cc(403,e.message);
	    }
	db.query(searchpwd,req.body.username,(err,results)=>{	//查询用户的密码
		if(err) return res.cc(err)
		if(results.length > 0)
		{
			const compare =  bcrypt.compareSync(req.body.password,results[0].password)
			if(compare) 
			{
				var dataStr = JSON.stringify(results[0])
				let data = JSON.parse(dataStr)
				console.log(data);
				const tokenStr = jwt.sign(data,config.jwtSecretKey,{expiresIn:config.expiresIn})
				return res.ss(200,'登录成功!','Bearer ' + tokenStr)

			}
		} 
		return res.cc(403,"用户名或密码错误")
		
	})
}