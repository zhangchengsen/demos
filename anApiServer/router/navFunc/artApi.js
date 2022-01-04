const db = require('../../db/mysql')
const mysql = require('mysql')
const joi = require('@hapi/joi')

const schema = joi.object({
	id: joi.number().integer().min(1).required().error(new Error('请输入正确规则的id'))
});
let sqlStr1 = 'select * from art'

exports.cates = (req,res)=>{
	db.query(sqlStr1,(err,results)=>{
		if(err) res.cc(200,err.message)
		res.cc(200,results)
	})
}
let sqlStr2 = "update art set is_deleted = 1 where id = ?"
exports.delete = async(req,res)=>{
	let id = req.params.id
	try {
		// 实施验证
		await schema.validateAsync({
		    id
		})  	
	} catch (e) {
		    return res.cc(403,e.message);
	}
	db.query(sqlStr2,id,(err,results)=>{
		if(err) res.cc(200,err.message)
		if(results.affectedRows != 0)
		return res.cc(200,'删除成功')
		return res.cc(403,'删除失败,请稍后再试')
	})
}
let sqlStr3 = "select * from art where id = ?"
exports.getCate = async(req,res) => {
	let id = req.params.id
	try {
		// 实施验证
		await schema.validateAsync({
		    id
		})  	
	} catch (e) {
		    return res.cc(403,e.message);
	}
	db.query(sqlStr3,id,(err,results)=>{
		if(err) res.cc(403,err.message)
		if(results.length < 1) return res.cc(403,'没有找到该数据')
		return res.ss(200,'成功',results[0])
	})
}

	//更新
const updSchema = joi.object({
	id: joi.number().integer().min(1).required().error(new Error('请输入正确规则的id')),
	name: joi.string().min(2).max(10).required().error(new Error('请输入正确规则的name')),
	alias: joi.string().min(2).required().error(new Error('请输入正确规则的alias'))

});
let sqlStr4 = "update art set ? where id = ?"
exports.update = async(req,res) => {
	let id =req.body.id
	console.log(id);
	
	let updMes = {
		name:req.body.name,
		alias:req.body.alias
	}
	try {
		// 实施验证
		console.log(updMes);

		await updSchema.validateAsync({
		    id,
		    name:updMes.name,
		    alias:updMes.alias
		})  	
	} catch (e) {
		    return res.cc(403,e.message);
	}
	db.query(sqlStr4,[updMes,id],(err,results) => {
		if(err) return res.cc(403,err.message)
		if(results.affectedRows != 1) return res.cc(403,'更新失败')
		return res.cc(200,'更新成功')
	})
}
