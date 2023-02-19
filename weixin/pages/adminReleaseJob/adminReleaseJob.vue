<template>
	<view class="home">
		<!-- 发布作业/测试界面 -->
		<view class="flex bg-white padding justify-between align-center">
			<view class="flex justify-between">
				<view class="text-bold" style="font-size: 40rpx;">作业/测试</view>
			</view>
			<button class="cu-btn bg-green lg shadow" @tap="TurnToPage" data-target="../adminAddJob/adminAddjob">
				<view style="font-size: 30rpx;">+添加</view>
			</button>
		</view>
		<view class="bg-white padding solids-bottom">
			<view class="margin-bottom flex justify-between align-center" v-for="(item, index) in itemList"
				:key="index">
				<view @longpress="Langtap(index)" @click="EditAndShow(index)" class="flex align-center">
					<text style="font-size: 60rpx;color: #000000;" class="margin-right" :class="icon"></text>
					<text class="text-bold margin-left text-black u-font-xl">{{item.tas_name}}</text>
				</view>
				<view class="flex ">
					<view>
						<button @tap="Release(index)" class="cu-btn bg-green shadow margin-right">发布</button>
					</view>
				</view>
				<!-- <button class="cu-btn bg-green  shadow" @tap="" >更多</button> -->
			</view>
		</view>
		<!-- 长按删除作业 -->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green modalfont" @tap="Delete()">确定</view>
					<view class="action text-blue modalfont" @tap="HideModal()">取消</view>
				</view>
				<view class="modalfont bg-white padding text-lg">
					确认删除该作业？
				</view>
			</view>
		</view>
		<!-- 发布的时间 -->
		<view class="cu-modal" :class="modalName2=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">发布作业</view>
					<view class="action" @click="HideModal2">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>

				<view class="cu-form-group">
					<view class="text text-green title">截止日期选择</view>
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="DateChange">
						<view class="text-sl picker">
							{{date}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="text text-green title">截止时间选择</view>
					<picker mode="time" :value="time" :start="startTime" :end="endTime" @change="TimeChange">
						<view class="text-sl picker">
							{{time}}
						</view>
					</picker>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @click="HideModal2">取消</button>
						<button class="cu-btn bg-green margin-left" data-target="RadioModal"
							@click="ShowModal2">确定</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 老师发布时选择发布班级 -->
		<view class="cu-modal " :class="modalName=='RadioModal'?'show':''" @tap="HideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white justify-end">
					<view class="content">选择班级</view>
					<view class="action" @click="HideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<scroll-view class="tightSize" scroll-y="true" :style="{height:auto}">
					<checkbox-group class="block" @change="CheckboxChange">
						<view class="cu-item " v-for="(item,index) in classList" :key="index">

							<view class="content cu-form-group flex justify-between">
								<view class="cu-form-group">
									<view class="margin-right">
										<!-- checkbox :checked="current==index?'checked':''"
											:value="index"></checkbox> -->
										<checkbox :value="index" :checked="chociedClass.includes(String(index))"></checkbox>
									</view>
									<view>班级码:{{item.cla_sign}}</view>
								</view>
								<view class=" margin-left">{{item.cla_name}}</view>
							</view>
						</view>
					</checkbox-group>
				</scroll-view>
				<view class="cu-bar bg-white solids-top margin-top margin-bottom justify-between">
					<view>
						<button class="cu-btn line-green text-green margin-left" @click="HideModal">取消</button>
					</view>
					<view>
						<button class="cu-btn bg-green margin-right" @click="BeginRelease()">发布</button>
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
				work: 0,
				icon: "cuIcon-edit",
				icon2: "cuIcon-moreandroid",
				//存储已存在作业列表
				itemList: [],
				// 该老师能发布作业的班级
				classList: [],
				// 老师选择了发布作业的班级
				chociedClass: [],
				current: -1,
				// 老师编号
				phone: "",
				modalName: null,
				modalName2: null,
				idclass: "",
				taskBeginTime: "",
				taskId: "",
				// 发布作业的索引号
				ReleaseIndex: 0,
				// 删除作业的索引号
				deleteIndex: 0,
				//老师发布时的时间
				startDate: "",
				endDate: "",
				// 今天的日期
				date: "",
				// 发布时的时间选择
				startTime: "",
				endTime: "",
				//现在的时间
				time: "",
			}
		},
		//查询该老师已经创建的作业
		onShow: function() {
			this.itemList = []
			this.phone = this.$global.openid
			this.GetData()
		},
		onLoad:function(){
		},
		methods: {
			// 选择发布班级
			CheckboxChange(e) {
				console.log("触发了CheckboxChange函数，传入的多选择正确答案", e.detail.value)
				this.chociedClass = e.detail.value
			},
			// 发布时时间选择切换
			TimeChange(e) {
				this.time = e.detail.value
			},
			// 发布时日期选择切换
			DateChange(e) {
				this.date = e.detail.value
			},
			// 删除作业
			Delete() {

				let a = {
					taskId: this.itemList[this.deleteIndex].tas_id,
				}
				console.log("删除作业传入的数据", a)
				this.$Request.postRequest(this.$url.GATHER.deleteTask, a).then(res => {
					console.log('删除作业返回值', res)
					this.HideModal()
					this.GetData()
				}).catch(err => {
					console.log('出错了，错误是', err);
				})

			},
			GetData() {
				this.itemList = []
				this.classList = []
				let a = {
					phone: this.$global.openid
				}
				console.log("传入的GetData数据a", a)
				console.log("传入的锁定班级索引", this.idclass)
				// let b = JSON.stringify(a);
				// console.log(this.$url.GATHER.createCourse)
				this.$Request.getRequest(this.$url.GATHER.checkTeacherCreateTask, a).then(res => {
					console.log('服务器获取作业列表', res.result);
					this.itemList = this.itemList.concat(res.result)
				}).catch(err => {
					console.log('出错了，错误是:', err);
				})
				let b = {
					phone: this.$global.openid
				}
				this.$Request.getRequest(this.$url.GATHER.CheckTeacherCreateclass, b).then(res => {
					console.log('服务器获取可发布的班级列表', res.result);
					if (res.result.length != 0) {
						this.classList = this.classList.concat(res.result)
					}
				}).catch(err => {
					console.log('出错了，错误是:', err);
				})
			},
			//开始正式发布
			BeginRelease() {
				let t = new Date()
				this.taskBeginTime = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() +
					":" + t.getMinutes() + ":" + t.getSeconds()
				this.taskEndTime = this.date + " " + this.time + ":00"
				this.taskId = this.itemList[this.ReleaseIndex].tas_id
				// 对每一个选中的班级进行作业发布
				for (let i = 0; i < this.chociedClass.length; i++) {
					// 获取到每一个班级ID
					this.idclass = this.classList[Number(this.chociedClass[i])].cla_id
					let a = {
						taskId: this.taskId,
						classId: this.idclass,
						taskBeginTime: this.taskBeginTime,
						taskEndTime: this.taskEndTime,
					}
					console.log("发布作业的传输数据", a)
					this.$Request.postRequest(this.$url.GATHER.teacherPublishTask, a).then(res => {
						console.log('作业发布完成返回数据', res);
						if(res.code==-11){
							var classname=this.classList[Number(this.chociedClass[i])].cla_name
							uni.showToast({
								icon: 'none',
								title: '该课程在'+classname+'已存在',
								duration: 1000,
							})
						}else{
							// 向订阅的主题中传输数据
							let topic="class"+this.idclass
							let message={"code":"1", "content":"1", "topic" :topic, "type":"text"}
							try{
								this.$global.client.PublishMessage(topic,JSON.stringify(message))
							}catch(e){
								console.log("发布作业时发送mqtt消息失败")
								return
							}
						}
						this.HideModal()
					}).catch(err => {
						console.log('出错了，错误是', err);
					})
				}
			},
			// 隐藏弹窗
			HideModal2() {
				this.modalName2 = null
			},
			Langtap(index) { //长按item
				this.deleteIndex = index
				this.ShowModal();
			},
			ShowModal() {
				// this.modalName = e.currentTarget.dataset.target;
				this.modalName = 'bottomModal';
			},
			ShowModal2(e) {
				this.modalName2 = null
				this.modalName = e.currentTarget.dataset.target;
			},
			Release(index) {
				let t = new Date()
				this.startDate = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate()
				this.date = this.startDate
				this.endDate = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + (t.getDate() + 30)
				this.startTime = t.getHours() + ":" + t.getMinutes()
				this.time = this.startTime
				this.endTime = (t.getHours() + 23) + ":59"
				// this.modalName = e.currentTarget.dataset.target;
				this.modalName2 = 'DialogModal1';
				this.ReleaseIndex = index
			},
			HideModal(e) {
				this.chociedClass = []
				// this.current=-1
				this.modalName = null;
			},
			//对选中的作业进行显示与编辑
			EditAndShow(index) {
				uni.navigateTo({
					url: '../adminJobShowAndEdit/adminJobShowAndEdit?taskId=' + this.itemList[index].tas_id +
						'&taskname=' + this.itemList[index].tas_name

				})
			},
			TurnToPage(e) {
				uni.navigateTo({
					url: "../adminAddJob/adminAddJob"
				});
			}
		}
	}
</script>

<style>
	.home {
		width: 750rpx;
		height: auto;
	}

	.tightSize {
		width: auto;
		height: 450rpx
	}
</style>
