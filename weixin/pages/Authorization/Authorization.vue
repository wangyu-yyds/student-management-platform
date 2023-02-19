<!-- 第三方vx登录授权页面 -->
<template>
	<view class="home">
		<!-- <view class="form">请进行以下授权</view> -->
		<view class="action">
			<text class="cuIcon-title text-green form"></text> 请进行以下授权
		</view>
		<view class="cu-form-group">
			<view class="title">电话</view>
			<input placeholder="请填写电话号码" name="input" v-model="tel" maxlength="11"></input>
			<button class='cu-btn bg-green shadow' @click="tap">验证码</button>
		</view>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-green lg" @tap="WxLogin">微信授权</button>
		</view>
		<view class="padding flex flex-direction">
			<button class="cu-btn bg-blue lg" @tap="Login">手机号登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tel: '', //电话号码
				nickName: '', //用户昵称
				avatarUrl: '', //用户头像
				openid: '', //服务端返回的openid
				isaccredit: false, //是否已经授权
			}
		},
		
		 onLoad() {
			
			uni.login({
				provider: 'weixin',
				// onlyAuthorize: true,
				success: async (loginAuth) => {
					let param = {code: loginAuth.code};
					this.$global.code = param.code; //将拿到的code赋值给全局变量
					console.log('code类型', typeof(param.code));
					console.log('code:', param.code);
					console.log('全局code:', this.$global.code);
					await this.$Request.getRequest(this.$url.GATHER.getopenid, param).then(res => {
						
						console.log('openid返回成功', res);
						// console.log(typeof(res));
						this.$global.openid = res;
						console.log('全局openid替换', this.$global.openid);
						// console.log('openid返回成功:', res.data)
					}).catch(err => {
						console.log('openid返回错误', err);
					})
				}
			})
			
			
			this.openid = this.$global.openid;
			console.log('登录打印openid', this.$global.openid);
		},
		
		methods: {
			tap() {
				console.log('op全局', this.$global.openid);
			},
			
			Openid() {
				// uni.getUserProfile方法将得到用户的头像(avatarUrl),昵称(nickName)
				uni.login({
					provider: 'weixin',
					// onlyAuthorize: true,
					success: (loginAuth) => {
						let param = {code: loginAuth.code};
						this.$global.code = param.code; //将拿到的code赋值给全局变量
						console.log('code类型', typeof(param.code));
						console.log('code:', param.code);
						console.log('全局code:', this.$global.code);
						this.$Request.getRequest(this.$url.GATHER.getopenid, param).then(res => {
							console.log('openid返回成功', res);
							// console.log(typeof(res));
							this.$global.openid = res;
							console.log('全局openid替换', this.$global.openid);
							// console.log('openid返回成功:', res.data)
						}).catch(err => {
							console.log('openid返回错误', err);
						})
					}
				})
			},
			
			Login() { //手机号登录
				if (this.isaccredit) {
					this.$global.vxUser.tel = this.tel;
					// this.$global.vxUser.tel = this.openid;
					console.log('打印tel', this.openid);
					console.log('打印tel', this.$global.vxUser.tel);
					// if (this.$global.vxUser.tel != '' && this.$global.vxUser.tel.length == 11) {
					if (this.$global.vxUser.tel != '') {
						let params = {
							_vxname: this.$global.vxUser.vxname,
							_phone: this.$global.vxUser.tel
						}
						this.$Request.getRequest(this.$url.GATHER.landing, params).then(res => {
							console.log('登录服务器返回', res);
							if (res.code == -1) {
								console.log('登录失败');
							}
							if (res.code == 0) {
								if (res._senfen == '学生') {
									this.$global.user.usernum = res._Sno;
									this.$global.user.username = res._name;
									this.$global.user.tagid = res._senfen;
									this.$global.user.code = 0;
									uni.reLaunch({
										url: '../Stuhome/Stuhome'
									})
								}
								if (res._senfen == '老师') {
									this.$global.user.usernum = res._Sno;
									this.$global.user.username = res._name;
									this.$global.user.tagid = res._senfen;
									this.$global.user.code = 0;
									uni.reLaunch({
										url: '../adminhome/adminhome'
									})
								}
								if (res._senfen == '游客') {
									this.$global.user.visitor = res._Sno;
									this.$global.user.username = res._name;
									this.$global.user.tagid = res._senfen;
									uni.reLaunch({
										url: '../Stuhome/Stuhome'
									})
								}

								console.log('执行了嘛？')
							}
						}).catch(err => {
							console.log('错误', err);
						})
						console.log('输入的电话', this.tel);
					} else {
						uni.showToast({
							title: '请输入正确的电话',
							icon: 'none',
							duration: 500
						})
					}
				} else {
					uni.showToast({
						title: '请先授权',
						icon: 'none',
						duration: 500
					})
				}

			},

			WxLogin() { //微信授权
				// uni.getUserProfile方法将得到用户的头像(avatarUrl),昵称(nickName)
				uni.getUserProfile({
					desc: '获取你的昵称,头像',
					// 如果uni.getUserProfile执行成功
					success: (userRes) => {
						if (userRes.errMsg == 'getUserProfile:ok' && userRes.userInfo != undefined) {
							let userInfo = {
								avatarUrl: userRes.userInfo.avatarUrl,
								nickName: userRes.userInfo.nickName
							}
							// this.getCode(userInfo);
							this.$global.vxUser.vxname = userInfo.nickName;
							this.$global.vxUser.vxavatar = userInfo.avatarUrl;
							this.isaccredit = true;
							uni.showToast({
								icon: "none",
								title: "授权成功"
							})
						} else {
							uni.showToast({
								icon: "none",
								title: "获取失败,请重试!"
							})
						}
					},
					// 如果uni.getUserProfile执行失败
					fail: error => {}
				});
			},

			
		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
	}

	.home {
		width: 750rpx;
	}

	.form {
		font-size: 32rpx;
		margin-left: 15rpx;
	}
</style>
