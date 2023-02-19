// import axios from 'axios';
// axios由ajax封装

// get请求
function getRequest(url, params = {}, method = 'GET') {
	// return new Promise((resolve, reject) => {
	// 	//客户端发给服务端的内容
	// 	axios({
	// 			//http://110.42.228.114:8999/checkUser?_account=A111&_password=111
	// 			url: url, //接口地址
	// 			method: method, //请求类别
	// 			params: params //参数
	// 		})
	// 		.then(res => {
	// 			//成功,服务端返回的内容
	// 			resolve(res.data)
	// 		})
	// 		.catch(res => {
	// 			//失败,服务端返回的内容
	// 			reject(res)
	// 		})
	// })
	return new Promise((resolve, reject) => {
		uni.request({
			url: url,
			method: method,
			data: params,
			success: (res) => {
				resolve(res.data);
			},
			fail: (err) => {
				reject(err.errMsg);
			}
		})
	})
	
}

// post请求
function postRequest(url, params = {}, method = 'POST') {
	// return new Promise((resolve, reject) => {
	// 	axios({
	// 			url: url,
	// 			method: method,
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			data: data
	// 		})
	// 		.then(res => {
	// 			//成功
	// 			resolve(res.data)
	// 		})
	// 		.catch(res => {
	// 			//失败
	// 			reject(res)
	// 		})
	// })
	return new Promise((resolve, reject) => {
		uni.request({
			url: url,
			method: method,
			data: params,
			header: {
				'Content-Type': 'application/json'
			},
			success: (res) => {
				resolve(res.data);
			},
			fail: (err) => {
				reject(err.errMsg);
			}
		})
	})
}

export default {
	postRequest: postRequest,
	getRequest: getRequest
}
