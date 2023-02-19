// 上传函数, 需要传入一个对象
// 示例: {courseid:1} 或{classid:1}

// 上传至oss需要的options
let PostObjectParams = {
	serverURL: "110.40.151.129:8999/getPostObjectParams", //server地址
	ossHost: 'http://pangmayi.oss-cn-hangzhou.aliyuncs.com', // oss地址
	signature: '', // **签名信息
	ossAccessKeyId: '', // **AccessKey ID
	policy: '', // **策略
	key: '', // *设置文件上传至OSS后的文件路径。默认studentManager/fileName
	filePath: '' // *文件的临时地址
}

// uploadImage方法返回oss图片的地址
function uploadImage(params = {}) {
	console.log("开始调用图片上传方法")
	
	return new Promise(async (resolve, reject) => {
		// 如果传入的params有意义则执行下面操作
		if (JSON.stringify(params) != '{}') {
			console.log("params:", params) //查看传入的params
			await getPostObjectParams(); //获取签名
			let imagePath = await getFilePath(params); //获取图片的物理地址
			resolve(imagePath) //返回图片在oss上的url
		} else {
			console.log("uploadImage方法没有传入courseid或者classid!");
			reject();
		}
	})
}

function getPostObjectParams() {
	uni.request({
		url: `http://${PostObjectParams.serverURL}`,
		success: (res) => {
			console.log(res.data)
			PostObjectParams.ossAccessKeyId = res.data.OSSAccessKeyId; //OSSAccessKeyId
			PostObjectParams.policy = res.data.policy; //策略
			PostObjectParams.signature = res.data.signature; //签名
		},
		fail: (err) => {
			console.log("getPostObjectParams方法出错!" + err)
		}
	})
}

function getFilePath(params = {}) {
	return new Promise((resolve, reject) => {
		// 如果传入的对象为空, 则直接返回
		if (JSON.stringify(params) == '{}') {
			return;
		} else {
			console.log("调用王宇封装的获取照片")
			uni.chooseImage({
				success: (chooseImagesRes) => {
					let Attribute = Reflect.ownKeys(params)[0];                      //Attribute = params的第一个属性的属性名
					console.log("显示传入的路径",Attribute)
					let Category = Attribute == "courseid" ? "course" : "task"       //图片要么是课程类的图片, 要么是task类的图片
					const tempFilePaths = chooseImagesRes.tempFilePaths[0];          //用tempFilePaths保存图片的本地地址
					// console.log("tempFilePaths:", tempFilePaths)                  //查看文件的本地地址
					PostObjectParams.filePath = tempFilePaths; //保存文件的本地地址

					const ext = tempFilePaths.replace(/([\S\s]+)\.(\S+)$/, '$2')     //获取文件后缀名
					PostObjectParams.key =
						`studentManager/teacher/${Category}/${Attribute}/${params[Attribute]}.${ext}` // 图片在oss上的路径
					console.log("图片在oss上的路径",PostObjectParams.key)                                //查看oss的目标地址
					console.log("文件物理地址",PostObjectParams.filePath)
					//一切就绪! 开始上传至oss:
					uni.uploadFile({
						url: PostObjectParams.ossHost,                               //oss的bucket域名即可
						filePath: PostObjectParams.filePath,                         //文件的物理地址
						name: 'file',
						formData: {
							key: PostObjectParams.key, //例如studentManeger/test.jpg
							policy: PostObjectParams.policy,
							OSSAccessKeyId: PostObjectParams.ossAccessKeyId,
							signature: PostObjectParams.signature,
						},
						success: (res) => {
							if (res.statusCode == 204) {
								console.log("上传成功!")
								let imgpath =
									`https://wy.pangmayi.cn/${PostObjectParams.key}`
								let back={
									url:imgpath,
									temp:PostObjectParams.filePath
								}
								resolve(back);
							}
						},
						fail: err => {
							console.log("上传失败!", err)
						}
					})
				}
			})
		}
	})
}


export default {
	uploadImage
}
