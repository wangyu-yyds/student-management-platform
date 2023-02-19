<template>
	<view class="home">
		<view class="scroll">
			<scroll-view class="scrolllist" scroll-y="true" :refresher-enabled='refresherEnabled'
				@refresherrefresh="OnRefresh" :refresher-triggered="triggered">
				<u-swipe-action class=" bg-white" v-for="(item,index) in personList" :key="index" @click="Move(index)"
					@open="open" :options="options">
					<view @longpress="Langtap(index)" @click="ShowPersonPage(index)"
						class="flex justify-between margin-bottom margin-left solid-bottom solid-top padding text-black text-bold text1">
						<view>{{personList[index].stu_name}}</view>
						<view class="flex justify-around">
							<view class="margin-left">{{personList[index].stu_no}}</view>
							<u-icon :v-if="this.personList.ach_achievement<60?true:false" name="error-circle-fill"
								color="#ff230f" size="40"></u-icon>
						</view>
					</view>
				</u-swipe-action>
			</scroll-view>
		</view>
		<!-- 长按删除班级成员-->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green modalfont" @tap="Delete()">确定</view>
					<view class="action text-blue modalfont" @tap="HideModal()">取消</view>
				</view>
				<view class="modalfont bg-white padding text-lg">
					确认删除该班级成员？
				</view>
			</view>
		</view>

		<!-- 老师移动成员时选择班级-->
		<view class="cu-modal " :class="modalName=='RadioModal'?'show':''" @tap="HideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white justify-end">
					<view class="content">选择移动班级</view>
					<view class="action" @click="HideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<scroll-view class="tightSize" scroll-y="true" :style="{height:auto}">
					<radio-group class="block" @change="RadioChange">
						<view class="content cu-form-group" v-for="(item,index) in canMoveList" :key="index">
							<radio :checked="index==current?true:false" :value="index">
							</radio>
							<view class="margin-left">{{item.cla_name}}</view>
						</view>
					</radio-group>
				</scroll-view>
				<view class="cu-bar bg-white solids-top margin-top margin-bottom justify-between">
					<view>
						<button class="cu-btn line-green text-green margin-left" @click="HideModal">取消</button>
					</view>
					<view>
						<button class="cu-btn bg-green margin-right" @click="ConfirmMove">确定移动</button>
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
				//班级编号
				classId: 0,
				//班级成员列表
				personList: [],
				//需要删除的索引号
				deleteIndex: 0,
				//需要移动的班级成员
				moveStudentIndex: 0,
				// 可以移动的班级
				canMoveList: [],
				//选中的移动的班级索引
				moveClassIndex: 0,
				refresherEnabled: true, //开启自定义下拉刷新
				triggered: false, //下拉刷新状态显示
				modalName: "",
				current: -1,
				options: [{
					text: '移动',
					style: {
						backgroundColor: '#007aff'
					}
				}]
			}
		},
		onLoad: function(options) {
			// 该班级的编号
			this.classId = options.classId
			console.log("传入的班级编号", this.classId)
			this.GetData()
			// Mqtt绑定
			this.MqttBing()
		},

		methods: {
			// 进行Mqtt绑定
			MqttBing(){
				//mqtt订阅相应班级主题
				var topic="class"+this.classId
				this.$global.client.subscribe(topic, err => {
					if (!err) {
						console.log(`订阅主题:${topic}成功`)
					}
				})
				// 接收主题消息,本班级主题传输数据为添加学生时,重新获取页面数据
				this.$global.client.on('message', (theme, payload) => {
					// callback(theme, payload.toString())
					let message=JOSN.parse(payload.toString())
					if(theme==topic){
						if(message.code=='1'&&message.content=='1'&&message.type=='Person'){
							this.GetData()
						}
					}
					const msgstr = `接收到了来自 '${theme}' 主题的消息: ${payload.toString()}`
					console.log(msgstr)             //调试时使用的提示信息
				})
			},
			//下拉刷新状态触发
			OnRefresh() {
				console.log("触发了下拉刷新")
				this.triggered = true
				this.GetData()
			},
			//老师选择一个可以移动的班级
			RadioChange(e) {
				this.current=e.detail.value
				this.moveClassIndex = e.detail.value
			},
			//确定开始移动班级成员
			ConfirmMove() {
				let a = {
					classId: this.classId,
					studentId: this.personList[this.moveStudentIndex].stu_id,
					targetClassId: this.canMoveList[this.moveClassIndex].cla_id
				}
				console.log("移动班级成员参数正在传递", a)
				this.$Request.getRequest(this.$url.GATHER.classMemberMove, a).then(res => {
					console.log('服务器移动班级成员返回值', res);
					this.GetData()
					// 向所在班级主题发送数据
					this.MqttDelete(this)
					this.HideModal()
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
			},
			//移动班级成员函数
			Move(index) {
				this.moveStudentIndex = index
				this.modalName = 'RadioModal'
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},
			Langtap(index) { //长按item
				this.deleteIndex = index
				this.ShowModal();
			},
			// 显示删除课程弹窗
			ShowModal() {
				// this.modalName = e.currentTarget.dataset.target;
				this.modalName = 'bottomModal';
			},
			HideModal() {
				this.current=-1
				this.modalName = null
			},
			//删除所选班级成员
			Delete() {
				let a = {
					classId: this.classId,
					studentId: this.personList[this.deleteIndex].stu_id
				}
				console.log("删除成员参数正在传递", a)
				this.$Request.getRequest(this.$url.GATHER.classMemberDelete, a).then(res => {
					console.log('服务器返回删除成员返回值', res);
					this.GetData()
					// Mqtt删除班级成员时向所处班级主题发送消息
					this.MqttDelete(this)
					this.HideModal()
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
			},
			MqttDelete(that){
				let topic='class'+that.classId
				console.log("开始向主题中发送消息classID",topic)
				let message={"code":"1", "content":"1", "topic" :topic, "type":"Person"}
				console.log("全局的client",JSON.stringify(message))
				
				try{
					that.$global.client.publish(topic,JSON.stringify(message), {
						qos: 2,
						retain: false
					}, (error) => {
						if (error) {
							console.error('publishMessage时出错了:', error)
							return
						}
					})
				}catch(e){
					console.log("删除班级成员向mqtt中发送消息失败")
					return
				}
			},
			//获取数据
			GetData() {
				this.personList = []
				this.canMoveList = []
				// 向服务器请求该课程列表数据
				let a = {
					classId: this.classId
				}
				let b = {
					courseId: this.$global.vxUser.courseId
				}
				console.log("课程编号参数正在传递", b)
				this.$Request.getRequest(this.$url.GATHER.classMember, a).then(res => {
					if (res.code == 0) {
						console.log("返回班级成员数据",res)
						this.personList = this.personList.concat(res.result)
						this.triggered = false
						this.Change()
						uni.showToast({
							icon: 'none',
							title: '获取班级成员成功',
							duration: 500,
						})
						console.log("接收到的班级成员列表", this.personList)
					} else {
						this.triggered = false
						uni.showToast({
							icon: 'none',
							title: '获取班级成员失败',
							duration: 500,
						})
					}
				}).catch(err => {
					console.log('出错了，错误是', err);
					this.triggered = false
					uni.showToast({
						icon: 'none',
						title: '获取班级成员出错了!',
						duration: 500,
					})
				})
				this.$Request.getRequest(this.$url.GATHER.getAllClass, b).then(res => {
					this.canMoveList = this.canMoveList.concat(res.result)
					this.DeleteClass()
					console.log("接收到的可转移的班级列表", this.canMoveList)
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
			},
			//去除班级成员所在的班级
			DeleteClass() {
				for (let i = 0; i < this.canMoveList.length; i++) {
					if (Number(this.classId) == Number(this.canMoveList[i].cla_id)) {
						this.canMoveList.splice(i, 1)
					}
				}
				console.log("删除后的可转移班级", this.canMoveList)
			},
			Change() {
				for (let i = 0; i < this.personList.length; i++) {
					if (this.personList[i].ach_achievement == null) {
						this.personList[i].ach_achievement = 0
					}
				}
			},
			// 显示个人界面,传入成员所在列表索引
			ShowPersonPage(index) {
				// 在跳转之前切断mqtt连接
				uni.navigateTo({
					url: '../adminCYxx/adminCYxx?classId=' + this.classId + '&studentId=' + this.personList[index]
						.stu_id
				})
			},

		}
	}
</script>

<style scoped lang="scss">
	.text1 {
		font-size: 40rpx;
	}

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
</style>
