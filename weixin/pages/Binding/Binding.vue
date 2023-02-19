<!-- 创建文件：Binding.vue 创建时间： 2022.1.26_20:12 创建人：张煜林-->
<template>
	<view>
		<view class="login">
			<text>绑定</text>
		</view>
		<view class="box" v-if="show">
			<view class="content">
				<u-icon name="tags" size="55rpx" color="#818181" class="icon"></u-icon>
				<radio-group @change="SetBorderSize">
					<label class="margin-left-sm">
						<radio class="blue radio" value="学生"></radio>
						<text class="margin-left-sm">学生</text>
					</label>
					<label class="margin-left-sm">
						<radio class="blue radio" value="老师"></radio>
						<text class="margin-left-sm">老师</text>
					</label>
				</radio-group>
				<view style="color: red; font-size: 25rpx; padding-top: 18rpx;">(请选择身份)</view>
			</view>
			<view class="content">
				<u-icon name="account" size="55rpx" color="#818181" height="100rpx" class="icon"></u-icon>
				<u-input type="text" v-model="username" placeholder="请输入姓名" maxlength="8"
					placeholder-style="font-size: 35rpx;" class="content1" />
			</view>
			<view class="content">
				<u-icon name="attach" size="55rpx" color="#818181" height="100rpx" class="icon"></u-icon>
				<u-input type="text" v-model="usernum" maxlength="16" placeholder="请输入学号/工号"
					placeholder-style="font-size: 35rpx;" class="content2" />
			</view>
			<view class="error" v-if="showerror">{{errortext}}</view>
		</view>

		<view class="box" v-if="isshow">
			<view class="contenttext">
				<u-icon name="account" size="55rpx" color="#818181" class="icon"></u-icon>
				<view class="nametext">{{username}}</view>
			</view>
			<view class="contenttext">
				<u-icon name="attach" size="55rpx" color="#818181" height="100rpx" class="icon"></u-icon>
				<text class="numtext">{{usernum}}</text>
			</view>
		</view>
		<!-- 绑定模块 -->
		<view class="logout padding  flex flex-direction" v-show="show">
			<button class="cu-btn bg-blue lg" @tap="Login">
				<text style="font-size: 35rpx; text-align: center;">绑定</text>
			</button>
		</view>
		<!-- 解绑模块 -->
		<view class="logout padding  flex flex-direction" v-show="isshow">
			<button class="cu-btn bg-red lg" @tap="Logout">
				<text style="font-size: 35rpx; text-align: center;">注销</text>
			</button>
		</view>

		<!-- 模态窗口 -->
		<view id="cu_modal" class="cu-modal" :class="modalName=='Login'?'show':''">
			<view id="cu_content" class="cu-dialog1 border-modal">
				<view class=" bg-white justify-end modal_content">
					<view class="message">
						<view class="warn_head">注意!</view>
						<view class="warning">{{warning}}</view>
						<view class="senfen">身份：{{bordersize}}</view>
						<view class="username">姓名：{{username}}</view>
						<view class="usernum">学工号：{{usernum}}</view>
					</view>
					<view class="btn">
						<view id="back" class="back" @click="Back">
							返回
						</view>
						<view id="confirm_login" class="confirm" v-if="gettime" @click="Ensure">
							确认
						</view>
						<view id="timer" class="time" v-if="!gettime" @click="Ensure">
							{{nowtime}}S
						</view>
					</view>
				</view>
			</view>
		</view>

		<view id="cu_modal" class="cu-modal" :class="modalName=='Logout'?'show':''">
			<view id="cu_content" class="cu-dialog border-modal">
				<view class="cu-bar bg-white justify-end modal_content">
					<view class="message">
						<view class="warn_head">注意!</view>
						<view class="warning">{{warning}}</view>
						<!-- <view class="mess_head">请认真思考后确定操作</view> -->
					</view>
					<view class="btn">
						<view id="back" class="back" @click="Back">
							返回
						</view>
						<view id="confirm_logout" class="confirm" v-if="gettime" @click="Ensure">
							确认
						</view>
						<view id="timer" class="time" v-if="!gettime" @click="Ensure">
							{{nowtime}}S
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				usernum: '',
				show: true,
				isshow: false,
				showerror: false,
				params: {}, //用户登录传递的参数,携带参数_phone,_identity,_on,电话，身份，学号/工号
				bordersize: '', //所选身份
				errortext: '', //错误提示
				gettime: false, //是否到时间
				nowtime: 3, //倒计时时间
				modalName: null, //提示弹出
				warning: '绑定之后再解绑将清除所有信息',
				timer: 3, //定时器
			}
		},

		onLoad() {
			console.log(this.$global.tagid);
			this.Identity();
		},

		methods: {
			SetBorderSize(e) { //身份切换
				this.bordersize = e.detail.value
				console.log('选择的身份', this.bordersize);
			},

			Login() { //绑定
				this.params._phone = this.$global.openid;
				this.params._on = this.usernum;
				// this.warning = '绑定之后再解绑将清除所有信息，若绑定，请在3S后确认！';
				this.warning = `绑定之后再解绑将清除所有信息，若绑定，请确认！`;
				if (this.usernum == '' || this.bordersize == '' || this.username == '') {
					this.showerror = true;
					this.errortext = '请选/填相关信息'
				} else {
					this.modalName = 'Login';
					this.Count_down();
				}
			},

			Stulogin() { //学生绑定
				console.log(this.username)
				console.log(this.usernum)
				//发送请求，验证身份和学号
				this.params._identity = this.$global.user.tagid;
				this.params._name = this.username;
				console.log('传递的参数', this.params);
				this.$Request.postRequest(this.$url.GATHER.binding, this.params).then(res => {
					console.log('绑定成功', res);
					if (res.code == -1) {
						console.log('绑定失败');
						this.showerror = true;
						this.errortext = '绑定失败';
					}
					if (res.code == -4) {
						console.log('学号不存在');
						this.showerror = true;
						this.errortext = '学号不存在，请输入正确的学号';
					}
					if (res.code == -5) {
						console.log('姓名错了');
						this.showerror = true;
						this.errortext = '姓名填写错误，请输入正确的姓名';
					}
					if (res.code == -2) {
						console.log('学号已被绑定');
						this.showerror = true;
						this.errortext = '该学号已被绑定';
					}
					if (res.code == 0) {
						this.$global.user.code = 0; //登录状态置为0
						this.$global.user.username = res._name;
						this.$global.user.usernum = res._Sno;
						uni.reLaunch({ //学生跳转
							url: '../Stuhome/Stuhome',
							success: (res) => {
								console.log('跳转了', this.$global.user.tagid);
							}
						})
					}

				}).catch(err => {
					console.log('请求失败', err);
				});
				console.log("添加了");
			},

			Tchlogin() { //教师绑定
				console.log(this.username)
				console.log(this.usernum)
				//发送请求，验证身份和学号
				this.params._identity = this.$global.user.tagid;
				this.params._name = this.username;
				console.log('传递的参数', this.params);
				this.$Request.postRequest(this.$url.GATHER.binding, this.params).then(res => {
					console.log('绑定成功', res);
					if (res.code == -1) {
						console.log('绑定失败');
						this.showerror = true;
						this.errortext = '绑定失败';
					}
					if (res.code == -4) {
						console.log('工号不存在');
						this.showerror = true;
						this.errortext = '工号不存在，请输入正确的工号';
					}
					if (res.code == -5) {
						console.log('姓名错了');
						this.showerror = true;
						this.errortext = '姓名填写错误，请输入正确的姓名';
					}
					if (res.code == -2) {
						console.log('工号已被绑定');
						this.showerror = true;
						this.errortext = '该工号已被绑定';
					}
					if (res.code == 0) {
						this.$global.user.code = 0; //登录状态置为0
						this.$global.user.username = res._name;
						this.$global.user.usernum = res._Sno;
						uni.reLaunch({ //老师跳转
							url: '../adminhome/adminhome',
							success: (res) => {
								console.log('跳转了', this.$global.user.tagid);
							}
						})
					} else {
						this.showerror = true;
						this.errorrtext = '请检查相关信息';
					}

				}).catch(err => {
					console.log('请求失败', err);
				});
				console.log("添加了");
			},

			Logout() { //解除绑定
				this.modalName = 'Logout';
				this.warning = '注销之后将清除当前用户所有内容！请谨慎选择！';
				this.Count_down();
			},

			LogouRequest() { //解绑请求
				let params = {};
				params._phone = this.$global.openid;
				params._identity = this.$global.user.tagid;
				// this.$Request.getRequest(this.$url.GATHER.unBinding, params).then(res => {
				this.$Request.getRequest(this.$url.GATHER.cancellation, params).then(res => {
					console.log('解绑成功', res);
					if (res.code == -1) {
						console.log('解绑失败');
						uni.showToast({
							title: '失败！请重试！',
							icon: 'error',
							duration: 300
						})
					}
					if (res.code == 0) {
						this.$global.user.tagid = '游客';
						this.$global.user.username = '';
						this.$global.user.usernum = '';
						this.$global.user.code = -1; //登录状态置为0
						console.log(this.$global.user.tagid);
						uni.reLaunch({ //解绑跳转回游客
							url: '../Stuhome/Stuhome',
						})
					}
				}).catch(err => {
					console.log('解绑失败', err);
					uni.showToast({
						title: '请检查网络',
						icon: 'error',
						duration: 300
					})
				});

			},

			Identity() { //身份判断
				if (this.$global.user.tagid != '游客' && this.$global.user.tagid != null && this.$global.user.code != -1) {
					this.show = false;
					this.isshow = true;
					this.username = this.$global.user.username;
					this.usernum = this.$global.user.usernum;
				}
			},

			Ensure(e) { //点击了确定
				if (e.currentTarget.id == 'timer') {
					uni.showToast({
						icon: 'none',
						title: '请确认信息',
						duration: 300,
					})
				}
				if (e.currentTarget.id == 'confirm_login') {
					this.modalName = null;
					if (this.bordersize == '学生' && this.usernum != '' && this.username != '') {
						this.$global.user.tagid = this.bordersize;
						this.Stulogin();
					}
					if (this.bordersize == '老师' && this.usernum != '' && this.username != '') {
						this.$global.user.tagid = this.bordersize;
						this.Tchlogin();
					}
					console.log('点击了确定');
				}
				if (e.currentTarget.id == 'confirm_logout') {
					this.modalName = null;
					this.LogouRequest();
					console.log('点击了确定');
				}

			},

			Back() { //				点击了返回
				this.modalName = null;
				this.ClearTime();
				console.log('点击了返回');
			},

			Count_down() {
				this.ClearTime(); //先清空定时器
				this.gettime = false;
				this.timer = setInterval(() => {
					this.nowtime--;
					if (this.nowtime < 0) {
						this.gettime = true;
						return this.ClearTime();
					}
					console.log('倒计时', this.nowtime);
				}, 1000);
			},

			ClearTime() {
				if (this.timer) {
					clearInterval(this.timer);
					this.nowtime = 3;
				}
			}


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
</style>

<style scoped lang="scss">
	.login {
		font-size: 55rpx;
		margin-left: 60rpx;
		margin-top: 40rpx;
		// background-color: blue;
	}

	.content1,
	.content2 {
		margin-left: 20rpx;
		width: 85%;
		font-size: 55rpx;
		// border-bottom: 1rpx solid;
	}

	.nametext,
	.numtext {
		margin-left: 20rpx;
		font-size: 35rpx;
	}

	.myzl,
	.logged {
		/* 姓名学号工号模块 */
		width: 750rpx;
		margin-top: 80rpx;
		// background-color: green;
	}

	.myxm,
	.name {
		padding: 50rpx;
	}

	.mygh,
	.number {
		padding: 0rpx 50rpx 50rpx 50rpx;
	}

	.butbox {
		margin: 50rpx 0;
	}

	.box {
		display: flex;
		flex-direction: column;
		align-content: center;
	}

	.content,
	.contenttext {
		// background-color: red;
		display: flex;
		flex-direction: row;
		margin-top: 35rpx;

	}

	.error {
		color: red;
		margin-left: 110rpx;
	}

	.icon {
		// background-color: red;
		margin-left: 35rpx;
	}

	.logout {
		margin-top: 70rpx;
	}

	.cu-dialog1 {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		margin-left: auto;
		margin-right: auto;
		width: 680upx;
		max-width: 100%;
		background-color: #f8f8f8;
		border-radius: 10upx;
		overflow: hidden;
	}

	.modal_content {
		display: flex;
		flex-direction: column;
		padding-left: 0rpx;
		margin-left: 0rpx;
	}

	.message {
		display: flex;
		flex-direction: column;
		margin-left: 0;
	}

	.mess_head,
	.senfen,
	.username,
	.usernum,
	.warning,
	.warn_head {
		margin-left: 30rpx;
		font-size: 32rpx;
		margin-top: 10rpx;
		text-align: left;
	}

	.senfen,
	.username,
	.usernum {
		color: #0055ff;
	}

	.warn_head {
		margin-left: 50rpx;
		margin-top: 30rpx;
		font-size: 45rpx;
	}

	.warning {
		font-size: 38rpx;
	}

	.btn {
		display: flex;
		flex-direction: row;
		// border-top: 4rpx solid #3f3f3f;
		height: 100rpx;
		margin-left: 270rpx;
		// background-color: blue;
	}

	.back,
	.confirm,
	.time {
		margin-left: 100rpx;
		height: 80rpx;
		padding-top: 30rpx;
		font-size: 32rpx;
		font-weight: 600;
	}

	.confirm,
	.time {
		// border-left: 4rpx solid #3f3f3f;
	}
</style>
