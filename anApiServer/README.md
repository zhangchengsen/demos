本接口已经部署到阿里云上了

免费提供给所有人使用
接口地址 http://39.105.87.106:8801/  

----------
`
	
	app.post('/api/login') //登录 携带username和password  
	app.post('/api/register') //注册 携带username和password
	//接下来所有接口 都必须设置Authorization的请求头 值为登录返回的token 否则验证失败  
	app.get('/my/userInfo')	// 获取用户个人信息 
	app.post('/my/userInfo')	
`
接口数量比较多 在router文件中可以看到可以调用的接口  
日后会整理出一个接口文档的html的页面供大家使用 
[![RVy6OK.png](https://z3.ax1x.com/2021/06/22/RVy6OK.png)](https://imgtu.com/i/RVy6OK)