const joi = require('@hapi/joi');
const db = require('../../db/mysql');
const path = require('path')
const addSchema = joi.object({
	 title : joi.string().required(),
	 cate_id : joi.number().integer().min(1).required(),
	 content : joi.string().allow('').required(),
	 state : joi.string().valid('已发布','草稿').required()

});
const sqlStr = "insert into articles set ?"
exports.add = async(req,res) =>{
	let addMes = {
		title:req.body.title,
		cate_id:req.body.cate_id,
		content:req.body.content,
		state:req.body.state,
	}
	try {
		// 实施验证
		await addSchema.validateAsync({
		    title:addMes.title,
		    cate_id:addMes.cate_id,
		    content:addMes.content,
		    state:addMes.state,
		})  	
	} catch (e) {
		    return res.cc(403,e.message);
	}
	if(!req.file || req.file.fieldname != "cover_img") return res.cc('文章封面是必选参数')
	addMes.author_id = req.user.id
	addMes.pub_date = new Date()
	addMes.cover_img = path.join('/uploads',req.file.fieldname)
	console.log(addMes)
	db.query(sqlStr,addMes,(err,results)=>{
		if(err) return res.cc(403,err.message)
		if(results.affectedRows != 1) 
		{
			return res.cc(403,'添加失败')
		}
		return res.cc(200,'success')
	})
}