<!-- 创建文件：Stumain.vue 创建时间： 2022.1.12_15:17 创建人：张煜林-->
<template>
	<view class="home">
		<view class="u-page">
			<!-- 我的微信头像 -->
			<view class="my">
				<view class="mytx">

					<view class="mytx1" @click="Tx">
						<u-avatar :src="src" size="large"></u-avatar>
					</view>
					<view class="mywxnc" @click="Tx">{{wxnc}}
						<view class="number">{{id}}：{{number}}</view>
						<!-- <view class="mysjh">手机号：{{tel}}</view> -->
					</view>
					<view class="tag-id bg-white solid-bottom">
						<view class='cu-tag bg-green radius'>{{tagid}}</view>
					</view>
				</view>
				<!-- 身份绑定 -->
				<view class="binding" @tap="Binding">
					<view style="display: flex; flex-direction: row;">
						<u-icon name="man-add-fill" color="#2fc163" size="65" label="身份绑定" label-size="35"
							margin-left="30rpx" style="margin-top: 25rpx; margin-left: 40rpx;">
						</u-icon>
						<u-icon name="arrow-right" size="55" color="#dddddd"
							style="margin-left: auto;margin-top: 25rpx;"></u-icon>
					</view>
				</view>
				<!-- 其它板块 -->
				<view class="otherplates">
					<!-- 常见问题 -->
					<view class="problem" @tap="Problem">
						<view style="display: flex;">
							<u-icon name="question-circle-fill" color="#ff5877" size="65" label="常见问题" label-size="35"
								margin-left="30rpx" style="margin-top: 25rpx; margin-left: 40rpx;">
							</u-icon>
							<u-icon name="arrow-right" size="55" color="#dddddd"
								style="margin-left: auto;margin-top: 25rpx;"></u-icon>
						</view>
					</view>
					<!-- 联系客服 -->
					<view class="service" @tap="Service">
						<view style="display: flex;">
							<u-icon name="server-man" color="#3992c1" size="65" label="联系管理员" label-size="35"
								margin-left="30rpx" style="margin-top: 25rpx; margin-left: 40rpx;">
							</u-icon>
							<u-icon name="arrow-right" size="55" color="#dddddd"
								style="margin-left: auto;margin-top: 25rpx;"></u-icon>
						</view>
					</view>
					<!-- 关于 -->
					<view class="about" @tap="About">
						<view style="display: flex;">
							<u-icon name="tags-fill" color="#74c16e" size="65" label="关于" label-size="35"
								margin-left="30rpx" style="margin-top: 25rpx; margin-left: 40rpx;">
							</u-icon>
							<u-icon name="arrow-right" size="55" color="#dddddd"
								style="margin-left: auto;margin-top: 25rpx;"></u-icon>
						</view>
					</view>

				</view>
				<view class="versions">
					<text>当前版本：{{versions}}</text>
				</view>

			</view>
		</view>
		<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
		<u-tabbar v-model="current" active-color="#1E90FF" :height="tabbarheight" :list="list"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						pagePath: '/pages/Stumain/Stumain',
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '主页',
						isDot: false,
						customIcon: false,
					},
					{
						pagePath: '/pages/Stuhome/Stuhome',
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的',
						isDot: false,
						customIcon: false,
					}

				],
				current: 0,
				wxnc: '',
				tel: '',
				src: '',
				tagid: '',
				id: '',
				versions: 'V1.1.2',
				number: '',
				tabbarheight: '50px', //宽屏动态改变tabbar高度
			}
		},
		onLoad() {
			// 测试
			const pro = this.Getopenid();

			pro.then((openid) => {
				console.log('openid', openid);
				this.$global.vxUser.tel = openid;
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
								let param = {
									phone: openid,
									identity: res._senfen
								};
								this.$Request.getRequest(this.$url.GATHER.getAvatar, param).then(res => {
									console.log('获取的头像', res);
									this.$global.vxUser.vxavatar = res.result[0].avatarUrl;
									this.Init();
								}).catch(err => {
									console.log('获取头像接口错误', err);
								})
								console.log(this.$global.vxUser.vxavatar);
							}
							if (res._senfen == '老师') {
								this.$global.user.usernum = res._Sno;
								this.$global.user.username = res._name;
								this.$global.user.tagid = res._senfen;
								this.wxnc = res._name;
								this.$global.user.code = 0;
								// this.Init();

								uni.reLaunch({
									url: '../adminhome/adminhome'
								})
							}
							if (res._senfen == '游客') {
								this.$global.user.visitor = res._Sno;
								this.$global.user.username = res._name;
								this.$global.user.tagid = res._senfen;
								let param = {
									phone: openid,
									identity: res._senfen
								};
								this.$Request.getRequest(this.$url.GATHER.getAvatar, param).then(res => {
									console.log('获取的头像', res);
									this.$global.vxUser.vxavatar = res.result[0].avatarUrl;
									this.Init();
								}).catch(err => {
									console.log('获取头像接口错误', err);
								})
								console.log(this.$global.vxUser.vxavatar);
							}
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
			})

			this.Iswidthscreen();
			uni.showLoading({
				title: '加载中',
				mask: true

			});
			this.Init();
			console.log("page onLoad")
		},

		onReady() {
			uni.hideLoading();
		},
		methods: {
			Getopenid() {
				return new Promise((resolove, reject) => {
					// 通过uni.login()拿到code, 然后发送请求给服务器,
					uni.login({
						provider: 'weixin',
						// onlyAuthorize: true,
						success: loginAuth => {
							let param = {
								code: loginAuth.code
							};
							this.$global.code = param.code; //将拿到的code赋值给全局变量

							// console.log('全局code:', this.$global.code)
							this.$Request.getRequest(this.$url.GATHER.getopenid, param).then(res => {
								console.log('openid返回成功', res);
								this.$global.openid = res;
								resolove(this.$global.openid);
							}).catch(err => {
								uni.showToast({
									title: '请检查网络',
									icon: 'none',
								})
								console.log('openid返回错误', err);
							})
						}
					})
				})
			},

			Tx() {
				console.log('点击了授权');
				// uni.getUserProfile方法将得到用户的头像(avatarUrl),昵称(nickName)
				// if (this.src ==
				// 	'https://tse1-mm.cn.bing.net/th/id/R-C.0617f601afc4c9a9203563d4c5bae5af?rik=DbU%2bZKlhw15v2A&riu=http%3a%2f%2fpic152.huitu.com%2fres%2f20201119%2f2493699_20201119190800940060_3.jpg&ehk=wHkxtdXfbmaXl1X4ak0xxJiKAViRuVO9FHwVBY4oG9o%3d&risl=&pid=ImgRaw&r=0') {
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
							this.src = this.$global.vxUser.vxavatar;
							this.wxnc = this.$global.vxUser.vxname;
							//将头像存入云端
							let param = {
								phone: this.$global.openid,
								identity: this.$global.user.tagid,
								avatarUrl: this.$global.vxUser.vxavatar
							}
							this.$Request.getRequest(this.$url.GATHER.updateAvatar, param).then(res => {
								console.log('存储成功', res);
							}).catch(err => {
								console.log('存储失败', err);
							});
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
				// } else {
				// 	console.log('已授权');
				// }
			},

			Init() { //身份编号
				console.log('初始化信息先执行了');
				this.src = this.$global.vxUser.vxavatar;
				console.log(this.$global.vxUser.vxavatar);
				this.tel = this.$global.vxUser.tel;
				this.tagid = this.$global.user.tagid;

				if (this.$global.user.tagid != '游客') {
					this.number = this.$global.user.usernum; //用户编号
				} else {
					this.tagid = this.$global.user.tagid;
					this.number = this.$global.user.visitor;
				}
				if (this.$global.user.tagid == '学生') {
					this.number = this.$global.user.usernum; //用户编号
					this.wxnc = this.$global.user.username;
					this.id = '学号';
				} else if (this.$global.user.tagid == '老师') {
					this.number = this.$global.user.usernum; //用户编号
					this.wxnc = this.$global.user.username;
					this.id = '工号'
				} else if (this.$global.user.tagid == '游客') {
					this.id = '游客号';
					this.wxnc = this.$global.vxUser.vxname;
					this.number = this.$global.user.visitor;
				}
				console.log("打印编号", this.number);
			},

			Binding() { //身份绑定
				console.log("点击了绑定");
				uni.navigateTo({
					url: '../Binding/Binding'
				})
			},

			// Feedback() {
			// 	console.log("点击了反馈");
			// },

			Problem() {
				console.log("点击了问题");
				uni.navigateTo({
					url: '../Problem/Problem'
				})
			},

			Service() {
				console.log("点击了客服");
				uni.navigateTo({
					url: '../Service/Service'
				})
			},

			About() {
				console.log("点击了关于");
				uni.navigateTo({
					url: '../About/About'
				})
			},

			Iswidthscreen() { //是否为宽屏
				let screenwidth = 0;
				uni.getSystemInfo({
					success: (res => {
						screenwidth = res.screenWidth;
					})
				});
				let height = screenwidth * 0.12 + 3;
				this.tabbarheight = JSON.stringify(parseInt(height)) + 'px';
				console.log('最终高度', this.tabbarheight);
			}


		},

	}
</script>

<style>
	page {
		background-color: #f6f6f6;
	}

	/* .home {
		width: 750rpx;
	} */
</style>

<style scoped lang="scss">
	/* 我的 */
	.mytx {
		/* 头像模块 */
		width: 750rpx;
		// height: 190rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		display: flex;
		flex-direction: row;
	}

	.mytx1 {
		width: 190rpx;
		height: 190rpx;
		padding-top: 42rpx;
		padding-left: 30rpx;
	}

	.mywxnc {
		margin-top: 50rpx;
		font-size: 40rpx;
		display: flex;
		flex-direction: column;
		// background-color: blue;
	}

	.number {
		margin-top: 20rpx;
		font-size: 35rpx;
	}

	.mysjh {
		margin-bottom: 20rpx;
		font-size: 35rpx;
	}

	.tag-id {
		margin-top: 50rpx;
		margin-left: auto;
	}

	.binding {
		width: 750rpx;
		height: 110rpx;
		background-color: #ffffff;
		margin-top: 15rpx;
	}

	.otherplates {
		margin-top: 15rpx;
	}

	.about,
	.service,
	.problem,
	.feedback {
		width: 750rpx;
		height: 110rpx;
		background-color: #ffffff;
	}

	.versions {
		color: #b5b5b5;
		font-size: 32rpx;
		margin-top: 10rpx;
		text-align: center;
	}
</style>
