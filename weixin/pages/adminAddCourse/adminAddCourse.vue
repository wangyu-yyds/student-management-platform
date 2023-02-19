<template>
	<view>
		<view class="padding bg-white  text-bold">
			<u-form ref="uForm">
				<u-form-item label="课程名称 :" :label-style="{'font-size':'35rpx'}" :label-width="auto">
					<u-input v-model="nameClass" placeholder="请填写课程名称" />
				</u-form-item>
				<view v-if="noNameTip" class="bg-white text-red text-bold text-center text-lg">请选择填写课程名！
				</view>
				<view class="cu-form-group text1  text-bold solid-bottom">
					<view class="title text1">结课时间选择</view>
					<picker @change="PickerChange" :value="index" :range="picker">
						<view class="picker">
							{{index>-1?picker[index]:'请选择结课时间'}}
						</view>
					</picker>
				</view>
				<view v-if="noTimeTip" class="bg-white text-red text-bold text-center text-lg">请选择结课时间！
				</view>
				<u-form-item label="课程简介 :" :label-style="{'font-size':'35rpx'}" :label-width="auto">
					<u-input v-model="introduceClass" placeholder="请填写课程简介" />
				</u-form-item>
				<u-form-item label="所属院校 :" :label-style="{'font-size':'35rpx'}" :label-width="auto">
					<u-input v-model="school" placeholder="请填写所属院校:" />
				</u-form-item>
				<u-form-item label="选择课程照片" :label-style="{'font-size':'35rpx'}" :label-width="auto">
				</u-form-item>

				<!-- colorui图片上传组件 -->
				<view class="cu-form-group">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						 <image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length<1">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
				</view>
				<!-- colorui图片上传组件结束 -->
			</u-form>
		</view>
		
		<view class="flex padding bg-white justify-around butbox">
			<u-button class="buttons" type="primary" :ripple="true" shape="circle" size="medium" @click="BeforeCreate">
				创建课程</u-button>
			<u-button class="buttons" type="primary" :ripple="true" shape="circle" size="medium" @click="Cancel">
				取消创建</u-button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				index: -1,
				//老师选择结课时间
				picker: [],
				// 课程名
				nameClass: '',
				// 电话号码
				phone: this.$global.openid,
				// 课程简介
				introduceClass: '',
				//课程照片,OSS 返回的网络地址
				picture: "",
				//所属学校
				school: "",
				tempDate: 0,
				noNameTip: false,
				noTimeTip: false,
				// colorUI上传图片的列表
				imgList:[],
				PostObjectParams : {
					serverURL: "110.40.151.129:8999/getPostObjectParams", //server地址
					ossHost: 'http://pangmayi.oss-cn-hangzhou.aliyuncs.com', // oss地址
					signature: '', // **签名信息
					ossAccessKeyId: '', // **AccessKey ID
					policy: '', // **策略
					key: '', // *设置文件上传至OSS后的文件路径。默认studentManager/fileName
					filePath: '' // *文件的临时地址
				}
			}
		},
		onLoad: function() {
			this.CreatePicker()
		},

		methods: {
			// colorui图片上传部分
			// 图片预览
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			// 删除图片
			DelImg(e) {
				uni.showModal({
					title: '',
					content: '确定要删除这张图片吗？',
					cancelText: '再想想',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			// 选择图片
			async ChooseImage() {
				let a={courseid:1}
				let str=await this.uploadImage(a)
				// 将返回的图片临时地址存入图片列表中
				this.imgList.push(str)
			},
			// 上传图片总函数
			async uploadImage(params = {}) {
				console.log("开始调用图片上传方法")
				return new Promise(async (resolve, reject) => {
					// 如果传入的params有意义则执行下面操作
					if (JSON.stringify(params) != '{}') {
						console.log("params:", params) //查看传入的params
						await this.getPostObjectParams(); //获取签名
						let imagePath = await this.getFilePath(params); //获取图片的物理地址
						resolve(imagePath) //返回图片在oss上的url
					} else {
						console.log("uploadImage方法没有传入courseid或者classid!");
						reject();
					}
				})
			},
			// 上传图片获取签名
			getPostObjectParams() {
				uni.request({
					url: `http://${this.PostObjectParams.serverURL}`,
					success: (res) => {
						console.log(res.data)
						this.PostObjectParams.ossAccessKeyId = res.data.OSSAccessKeyId; //OSSAccessKeyId
						this.PostObjectParams.policy = res.data.policy; //策略
						this.PostObjectParams.signature = res.data.signature; //签名
					},
					fail: (err) => {
						console.log("getPostObjectParams方法出错!" + err)
					}
				})
			},
			// 上传图片获取文件路径
			getFilePath(params = {}) {
				return new Promise((resolve, reject) => {
					// 如果传入的对象为空, 则直接返回
					if (JSON.stringify(params) == '{}') {
						return;
					} else {
						uni.chooseImage({
							success: (chooseImagesRes) => {
								let Attribute = Reflect.ownKeys(params)[0];                      //Attribute = params的第一个属性的属性名
								let Category = Attribute == "courseid" ? "course" : "task"       //图片要么是课程类的图片, 要么是task类的图片
								const tempFilePaths = chooseImagesRes.tempFilePaths[0];          //用tempFilePaths保存图片的本地地址
								// console.log("tempFilePaths:", tempFilePaths)                  //查看文件的本地地址
								const ext = tempFilePaths.replace(/([\S\s]+)\.(\S+)$/, '$2')     //获取文件后缀名
								this.PostObjectParams.key =
									`studentManager/teacher/${Category}/${this.nameClass}/${params[Attribute]}.${ext}` // 图片在oss上的路径
									resolve(tempFilePaths)
							}
						})
					}
				})
			},
			// colorui图片上传部分结束
			//取消创建
			Cancel() {
				uni.navigateBack()
			},
			// 新增图片
			async afterRead(event) {
				console.log("添加图片文件路径开始")
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				console.log("图片的路径src",lists[i].url)
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			// 创建结课时间数组
			CreatePicker() {
				this.picker = []
				let t = new Date()
				this.tempDate = t.getFullYear()
				for (let i = 0; i < 4; i++) {
					this.picker = this.picker.concat((this.tempDate + i) + "-上")
					this.picker = this.picker.concat((this.tempDate + i) + "-下")
				}
			},
			// 发布时日期选择切换
			DateChange(e) {
				this.date = e.detail.value
			},
			// 选择结课时间
			PickerChange(e) {
				this.index = e.detail.value
			},
			async BeforeCreate() {
				if (this.nameClass == "") {
					this.noNameTip = true
					return
				} else {
					this.noNameTip = false
				}
				if (this.index == -1) {
					this.noTimeTip = true
					return
				} else {
					this.noTimeTip = false
				}
				if(this.imgList[0]!=null){
					await uni.uploadFile({
						url: this.PostObjectParams.ossHost,                               //oss的bucket域名即可
						filePath: this.imgList[0],                         //文件的物理地址
						name: 'file',
						formData: {
							key: this.PostObjectParams.key, //例如studentManeger/test.jpg
							policy: this.PostObjectParams.policy,
							OSSAccessKeyId: this.PostObjectParams.ossAccessKeyId,
							signature: this.PostObjectParams.signature,
						},
						success: (res) => {
							if (res.statusCode == 204) {
								let imgpath =
									`https://wy.pangmayi.cn/${this.PostObjectParams.key}`
								// let back={
								// 	url:imgpath,
								// }
								this.picture=imgpath
								this.Create()
								console.log("上传成功!")
								console.log("上传s完成的图片网络地址",this.picture)
							}
						},
						fail: err => {
							console.log("上传失败!", err)
						}
					})
				}else{
					this.picture='https://tse3-mm.cn.bing.net/th/id/OIP-C.VfF-rQMtnD-Dsq2ZwkyvNQAAAA?w=158&h=180&c=7&r=0&o=5&dpr=1.12&pid=1.7'
					this.Create()
				}
			},
			// 用接口创建课程
			Create(){
				let a = {
					phone: this.$global.openid,
					coursename: this.nameClass,
					existtime: this.picker[this.index],
					synopsis: this.introduceClass,
					picture: this.picture,
					school: this.school
				}
				console.log("创建课程上传的数据a", a)
				this.$Request.postRequest(this.$url.GATHER.createCourse, a).then(res => {
					console.log('服务器返回列表', res);
					uni.navigateBack()
					if (res.code == 0) {
						setTimeout(function() {
							uni.showToast({
								title: '成功创建课程'
							})
						}, 500)
					} else {
						setTimeout(function() {
							uni.showToast({
								title: '创建课程失败'
							})
						}, 500)
					}
					// console.log('服务器返回列表', res.result);
				
				}).catch(err => {
					console.log('出错了,错误是', err);
				})
			}
		}
	}
</script>

<style>
	.text1 {
		font-size: 40rpx;
	}
	/*微信图片上传部分 */
	
</style>
