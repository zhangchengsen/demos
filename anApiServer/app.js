const express = require('express')
const cors = require('cors') //导入中间件

const app = express()	//启动服务器
const joi = require('@hapi/joi')
const config = require('./config')
const expressJWT = require('express-jwt')


const apiRouter = require('./router/api')
const myRouter = require('./router/myApi')
const artRouter = require('./router/artApi') 
const articleRouter = require('./router/article') 
app.use(cors())	// 使用跨域

app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api\//]}))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use( function (req,res,next) {
	res.cc = function(num,err) {	// 失败函数
		res.send({
			status:num,
			msg:err instanceof Error ? err.message : err
		})
	}
	res.ss = function(num,msg,data) {	// 成功函数
		res.send({
			status:num,
			msg,
			data
		})
	}
	next()
})

app.use('/api',apiRouter)	// 登录导航
app.use('/my',myRouter)		// my导航 都得携带请求头 Authorization
app.use('/art',artRouter)		// 分类导航
app.use('/article',articleRouter)		// 文章导航

app.use((err,req,res,next)=>{
	if(err.name == "UnauthorizedError") return res.cc('身份认证失败')
	res.cc(403,"未知的错误")
})


app.listen(3007,()=>{		//监听3007端口
	console.log('server is running at http://39.105.87.106:8801')
})