<!-- 创建文件：Stumain.vue 创建时间： 2022.1.11_17:17 创建人：张煜林 -->

<template>
	<view>
		<view class="home">
			<!-- 所有内容的容器 -->
			<view class="cu-bar header-style solid-bottom ">
				<view class="header">
					<u-icon class="allicon" name="grid" size="55"></u-icon>
					<text class="allclass">全部课程</text>
				</view>
				<view class="action">
					<button class="cu-btn bg-green shadow" @tap="ShowModal" data-target="DialogModal1">+ 添加课程</button>
				</view>
			</view>

			<view class="scroll">
				<scroll-view class="scrolllist" scroll-y="true" :refresher-enabled='refresherEnabled'
					@refresherpulling="OnPulling" @refresherrefresh="OnRefresh" @refresherrestore="OnRestore"
					@refresherabort="OnAbort" :refresher-triggered="triggered" @scroll='Roll'
					refresher-background="#f0f0f0">
					<view class="courselist" v-if="exist">
						<u-cell-group v-for="(item,index) in classList" :key="index">
							<u-cell-item class="cell-item" :title="item.courseName" :title-style="{'font-size':'40rpx'}"
								:label-style="{'font-size':'35rpx'}" :label="item.startTime" @click="Clickitem(item)">
							</u-cell-item>
						</u-cell-group>
					</view>

					<view class="none" v-if="isexist">
						<view class="nonetext">当前没有内容</view>
					</view>
				</scroll-view>
			</view>
			<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">添加课程</view>
						<view class="action" @click="HideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						<u-field v-model="idclass" label="班级码" placeholder="请填写班级码" clear-size="50rpx" maxlength="6"
							:error-message="errorMessage"></u-field>
					</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action">
							<button class="cu-btn line-green text-green" @click="HideModal">取消</button>
							<button class="cu-btn bg-green margin-left" @click="Addclass">确定</button>
						</view>
					</view>
				</view>
			</view>

			<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
			<u-tabbar v-model="current" active-color="#1E90FF" :height="tabbarheight" :list="list"></u-tabbar>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{ //tabbar配置
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
				idclass: this.idclass,
				modalName: null,
				errorMessage: '',
				classList: [],
				courselist: [], //所有课程码
				class_list: [], //所有班级编码
				current: 0, //当前激活页面index
				status: 'more', //加载更多
				refresherEnabled: false, //开启自定义下拉刷新
				triggered: false, //设置当前下拉刷新的状态
				tabbarheight: '50px', //宽屏动态改变tabbar高度
				exist: true,
				isexist: false,
				start: true, //显示此页面
				refresherEnabled: true, //开启自定义下拉刷新
				triggered: false, //设置当前下拉刷新的状态
			}
		},

		onLoad() {
			this.Iswidthscreen();
			console.log("page onload");

			// this.$mqtt.ReceivedMessage((theme, msgs) => {
			// 	console.log('接收来自', theme, '主题的消息', msgs);
			// let msg = JSON.parse(msgs);
			// let str = JSON.stringify(msgs);
			// console.log('typeof', typeof(msgs));
			// console.log('sss', str, typeof(str));
			// 	console.log('msg11', msg);
			// 	if (msg.code == 1 && msg.content == 1) {
			// 		if (msg.type == 'class' || msg.type == 'course' || msg.type == 'Person') {
			// 			this.Getlist(true);
			// 		}
			// 	}
			// })

			// this.$mqtt.Connect((theme, msg) => {			//链接mqtt,默认订阅主题student
			// 	const msgstr = `接受了来自 '${theme}' 主题的消息：${msg}`
			// 	console.log(typeof(msg));
			// 	console.log(msgstr);
			// })

			// this.$mqtt.Subscribe('ccsu');			//订阅主题

			// this.$mqtt.ReceivedMessage((theme, msg) => {			//接受来自xxx主题的消息
			// 	const msgstr = `接收到了来自 '${theme}' 主题的消息:${msg}`
			// 	console.log(msgstr)
			// })

			// this.$mqtt.PublishMessage('student', JSON.stringify({		//发布消息到xxx主题
			// 	msg: 'hello wy!'
			// }))

			// setTimeout(() => {
			// 	this.$mqtt.Disconnect()					//断开链接
			// }, 3000)
		},

		onShow() {
			console.log('!!!!!!!!!page onshow');
			this.start = true;
			this.Getlist();
			this.$global.client.on('message', (theme, payload) => {
				const msgstr = `接收到了来自 '${theme}' 主题的消息: ${payload.toString()}`
				// console.log(payload.toString());
				console.log(msgstr);
				let msg = JSON.parse(payload.toString());
				// console.log(msg);
				if (msg.code == 1 && msg.content == 1) {
					if (msg.type == 'class' || msg.type == 'course' || msg.type == 'Person') {
						this.Getlist(true);
					}
				}
			})
		},

		onHide() {
			console.log('page hide');
			// this.$mqtt.Disconnect(); //离开页面断开mqtt
		},

		methods: {
			ShowModal(e) {
				this.modalName = e.currentTarget.dataset.target;
			},

			HideModal(e) {
				this.modalName = null
			},

			Isexist() { //课程是否有内容
				if (this.classList.length == 0) {
					this.isexist = true;
					this.exist = false;
				} else {
					this.isexist = false;
					this.exist = true;
				}
			},

			Addclass() {
				let id = this.idclass; //获取输入框里的课程号
				let classlist = this.classList; //获取已存在课程的课程数组
				let params = {
					tel: this.$global.openid,
					sign: this.idclass
				};
				console.log('参数', params);
				if (classlist.length != 0) { //课程表里有课程
					for (let i in classlist) {
						if (id == classlist[i].classCode) {
							this.errorMessage = '课程已存在或未填写,请重新输入'
							console.log("课程已存在");
							break;
						} else if (i == classlist.length - 1) {
							//发送请求，先查询课程库中是否存在该课程
							//若存在，添加课程，并返回添加课程后的该用户所有课程表
							//若不存在：this.errorMessage = '请输入正确课程号'
							this.$Request.postRequest(this.$url.GATHER.stuaddclass, params).then(res => {
								console.log('参数', params);
								if (res.result == '添加成功') {
									this.Getlist();
									console.log('添加成功', res);
									//添加成功直接连接、订阅并发布消息到主题
									if (this.courselist.indexOf(res.data[0].courseNum) == -1) {
										this.courselist.push(res.data[0].courseNum);
										this.MqttSubscribe(this.courselist[this.courselist.length - 1], -1); //订阅课程
									}
									if (this.class_list.indexOf(res.data[0].classNum) == -1) {
										this.class_list.push(res.data[0].classNum);
										this.MqttSubscribe(-1, this.class_list[this.class_list.length - 1]); //订阅班级
										this.MqttPublishMessage(this.class_list[this.class_list.length -
											1]); //向班级发布消息
									}
									this.modalName = null;
								} else {
									this.errorMessage = "请输入正确课程码或联系老师";
									console.log('失败了');
								}
							}).catch(err => {
								console.log('错误', err);
							})
						}
					}
				} else {
					//课程表里为空
					//发送请求，先查询课程库中是否存在该课程
					//若存在，添加课程，并返回添加课程后的该用户所有课程表
					//若不存在：this.errorMessage = '请输入正确课程号'
					this.$Request.postRequest(this.$url.GATHER.stuaddclass, params).then(res => {
						console.log('参数', params);
						console.log('返回添加', res)
						if (res.code == 0) {
							this.Getlist();
							if (this.courselist.indexOf(res.data[0].courseNum) == -1) {
								this.courselist.push(res.data[0].courseNum);
								this.MqttSubscribe(this.courselist[this.courselist.length - 1], -1); //订阅课程
							}
							if (this.class_list.indexOf(res.data[0].classNum) == -1) {
								this.class_list.push(res.data[0].classNum);
								this.MqttSubscribe(-1, this.class_list[this.class_list.length - 1]); //订阅班级
								this.MqttPublishMessage(this.class_list[this.class_list.length - 1]); //向班级发布消息
							}
							this.modalName = null;
						} else {
							this.errorMessage = "请输入正确课程码或联系老师";
							// console.log('0失败了');
						}
					}).catch(err => {
						console.log('错误', err);
					})
				}


			},

			Getlist(flag) { //获取当前用户课程
				let params = {
					tel: this.$global.openid
				}

				this.$Request.getRequest(this.$url.GATHER.getcourselist, params).then(res => {
					console.log('服务器返回列表', res);
					if (res.code == -1) {
						this.triggered = false;
						this.classList = res.courselist;
						uni.showToast({
							icon: 'none',
							title: '当前没有课程',
							duration: 500,
						})
						this.Isexist();
					} else if (res.code == 0) {
						this.triggered = false;
						this.classList = res.courseList;
						if (this.start && this.classList.length != 0) {
							let list = this.classList;
							this.courselist = [];
							this.class_list = [];
							for (let i = 0, j = 0, k = 0; i < list.length; i++) {
								if (this.courselist.indexOf(list[i].courseNum) == -1) {
									this.courselist.push(list[i].courseNum);
									this.MqttSubscribe(this.courselist[j++], -1); //订阅课程
								}
								if (this.class_list.indexOf(list[i].classNum) == -1) {
									this.class_list.push(list[i].classNum);
									this.MqttSubscribe(-1, this.class_list[k++]); //订阅班级
								}
							}
							console.log(this.courselist);
							console.log(this.class_list);
						}
						this.start = false;
						this.Isexist();
						setTimeout(function() {
							uni.showToast({
								title: '成功获取课程',
								duration: 500,
							})
						}, 1000)
					}
				}).catch(err => {
					console.log('222', err);
					this.triggered = false;
					this.classList = [];
					this.Isexist();
					uni.showToast({
						icon: 'error',
						title: '获取课程失败'
					})
				})
			},

			Clickitem(res) { //进入课程
				console.log('进入课程 ->', res);

				let params = JSON.stringify(res);
				uni.navigateTo({
					url: '../Classitem/Classitem?index=' + params
				})
			},

			Iswidthscreen() { //是否为宽屏
				let screenwidth = 0;
				uni.getSystemInfo({
					success: (res => {
						console.log('设备品牌和设备型号', res.brand, ' - ', res.model)
						console.log('屏幕宽度', res.screenWidth);
						console.log('可使用屏幕宽度', res.windowWidth);
						screenwidth = res.screenWidth;
					})
				});
				let height = screenwidth * 0.12 + 3;
				this.tabbarheight = JSON.stringify(parseInt(height)) + 'px';
				console.log('最终高度', this.tabbarheight);
			},

			OnPulling(e) { //自定义下拉刷新控件被下拉
				// console.log("onpulling");
			},

			OnRefresh(e) { //自定义下拉刷新被触发
				//调用获取数据的函数
				console.log('下拉刷新触发');
				this.triggered = true;
				this.Getlist(true);
				console.log('输出triggered->', this.triggered);
			},

			OnRestore() { //自定义下拉刷新被复位
				// console.log("执行复位")
				this.triggered = false;
			},

			OnAbort() { //自定义下拉刷新被中止
				console.log("中断")
				this.triggered = false
			},

			Roll(res) { // 获取滚动距离
				if (res.target.scrollTop >= 20) {
					this.refresherEnabled = false
				} else {
					this.refresherEnabled = true
				};
				// console.log('距离顶部', res.target.scrollTop);

			},

			MqttSubscribe(coursenum, classnum) { //mqtt订阅主题
				let courseNum = 'course' + coursenum;
				let classNum = 'class' + classnum;
				if (classnum == -1) {
					console.log('订阅主题', courseNum);
					this.$global.client.subscribe(courseNum, () => {
						console.log('订阅', courseNum, '成功');
					});
					return;
				} else if (coursenum == -1) {
					console.log('订阅主题', classNum);
					this.$global.client.subscribe(classNum, () => {
						console.log('订阅', classNum, '成功');
					});
					return;
				}
			},

			// MqttReceivedMessage() { //mqtt主题接收消息
			// this.$mqtt.ReceivedMessage((theme, msg) => {
			// 	console.log('接收来自', theme, '主题的消息', msg);
			// 	if (msg.code == 1 && msg.content == 1) {
			// 		if (msg.type == 'class' || msg.type == 'course') {
			// 			this.Getlist(true);
			// 		}
			// 	}
			// })
			// },

			MqttPublishMessage(classnum) { //发布消息到主题
				let theme = 'class' + classnum;
				let topicname = 'class' + classnum;
				let content = {
					code: '1',
					content: '1',
					topic: topicname,
					type: 'Person'
				};
				console.log('发送消息');
				try {
					this.$global.client.publish(theme, JSON.stringify(content), {
						qos: 2,
						retain: false
					}, (error) => {
						if (error) {
							console.error('publish时出错了:', error)
							return;
						}
					});
				} catch(e) {
					console.log('消息发送失败！');
					return;
				}

			},

		},

	}
</script>

<!-- customStyle: {
		width: 20rpx;
		color: 'red'
	} -->
<style>
	page {
		background-color: #f6f6f6;
	}

	.home {
		width: 750rpx;
	}
</style>
<style lang="scss">
	.home {
		display: flex;
		flex-direction: column; //在弹性布局中给纵向排列
		// flex: 1;
		height: calc(100vh - var(--window-top));
		width: 100%;

		.scroll {
			flex: 1;
			overflow: hidden;
			box-sizing: border-box;

			.scrolllist {
				height: 100%;
				display: flex;
				flex-direction: column;
			}
		}
	}


	.header {
		font-size: 35rpx;
	}

	.allicon {
		padding-left: 30rpx;
	}

	.allclass {
		margin-left: 5rpx;
	}

	.header-style {
		background-color: #ffffff;
		height: 120rpx;
		border: 1rpx solid #ffffff;
		border-radius: 5rpx;
	}

	.cell-item {
		background-color: #007AFF;
	}

	.none {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.nonetext {
		font-size: 32rpx;
		color: #ababab;
	}
</style>
