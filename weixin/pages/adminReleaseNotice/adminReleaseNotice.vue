<template>
	<view class="home">
		<!-- 发布作业/测试界面 -->
		<view class="flex bg-white padding justify-between align-center">
			<view class="flex justify-between">
				<view class="text-bold" style="font-size: 40rpx;">通知</view>
			</view>
			<button class="cu-btn bg-green lg shadow" @tap="AddNotice" data-target="DialogModal1">
				<view style="font-size: 30rpx;">+添加</view>
			</button>
		</view>

		<view class="bg-white padding solids-bottom">
			<view class="flex justify-between align-center" v-for="(item, index) in itemList" :key="index">
				<view @longpress="Langtap(index)" @click="EditAndShow(index)" class="flex align-center">
					<text style="font-size: 60rpx;color: #000000;" class="margin-xs" :class="icon"></text>
					<text class="margin-left text-bold text-black u-font-xl">{{itemList[index].inf_name}}</text>
				</view>
				<view class="flex">
					<view>
						<button @tap="Release(index)" class="cu-btn bg-green shadow margin-right">发布</button>
					</view>
				</view>
				<!-- <button class="cu-btn bg-green  shadow" @tap="" >更多</button> -->
			</view>
		</view>
		<!-- 长按删除通知 -->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green modalfont" @tap="Delete()">确定</view>
					<view class="action text-blue modalfont" @tap="HideModal()">取消</view>
				</view>
				<view class="modalfont bg-white padding text-lg">
					确认删除该通知？
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
							<view class="content cu-form-group">
								<view class=" cu-form-group">
									<view class="margin-right">
										<checkbox ref="kick" :checked="chociedClass.includes(String(index))"
											:value="index"></checkbox>
									</view>
									<view>班级码:{{item.cla_sign}}</view>
								</view>
								<view class="margin-left">{{item.cla_name}}</view>
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
		<!-- 没有可发布班级时 -->
		<view class="cu-modal " v-if="nullClass">
			<view class="cu-bar bg-white justify-end">
				<view class="content text-bold">警告</view>
				<view class="action" @click="HideModal3">
					<text class="cuIcon-close text-red"></text>
				</view>
				<view class="text-red text-center text1">对不起，没有可发布的班级</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				work: 0,
				icon: "cuIcon-message",
				icon2: "cuIcon-moreandroid",
				totalWork: 10,
				modalName: null,
				modalName2: null,
				//获取老师创建的通知列表
				itemList: [],
				//获取老师选中要发布的班级索引
				chociedClass: [],
				//老师获得的所有可发布的班级列表
				classList: [],
				//教师电话
				phone: this.$global.openid,
				// 删除的部分索引
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
				//通知发布开始时间
				taskBeginTime: "",
				//通知发布结束时间
				taskEndTime: "",
				// 发布作业的索引
				ReleaseIndex: 0,
				// 没有可发布班级时，出现提示
				nullClass: false,
			}
		},
		onShow: function() {
			this.GetData()
		},
		onLoad:function(){
			// 订阅主题
		},
		methods: {
			// 选择发布班级
			CheckboxChange(e) {
				console.log("触发了CheckboxChange函数，传入的多选择正确答案", e.detail.value)
				this.chociedClass = e.detail.value
				console.log("传输完成的选择班级数组为", this.chociedClass)
			},
			//长按删除
			Langtap(index) { //长按item
				this.deleteIndex = index
				this.ShowModal();
			},
			ShowModal() {
				// this.modalName = e.currentTarget.dataset.target;
				this.modalName = 'bottomModal';
			},
			// 关闭没有可发布班级时的警告
			HideModal3() {
				this.nullClass = false
			},
			// 删除通知
			Delete() {
				let a = {
					informId: this.itemList[this.deleteIndex].inf_id,
				}
				this.$Request.postRequest(this.$url.GATHER.deleteInform, a).then(res => {
					this.HideModal()
					this.GetData()
				}).catch(err => {
					console.log('出错了，错误是', err);
				})

			},
			BeginRelease() {
				let t = new Date()
				this.informBeginTime = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t
					.getHours() +
					":" + t.getMinutes() + ":" + t.getSeconds()
				this.informId = this.itemList[this.ReleaseIndex].inf_id
				// 对每一个选中的班级进行作业发布
				for (let i = 0; i < this.chociedClass.length; i++) {
					// 获取到每一个班级ID
					this.idclass = this.classList[Number(this.chociedClass[i])].cla_id
					let topic='class'+this.idclass
					let message={"code":"1", "content":"1", "topic":topic,"type":"message"}
					console.log("向",topic,"中发送了",message,"消息")
					try{
						this.$global.client.PublishMessage(topic,JSON.stringify(message))
					}catch(e){
						console.log("发布通知，发布mqtt消息失败")
						return
					}
						let a = {
							informId: this.informId,
							classId: this.idclass,
							informBeginTime: this.informBeginTime,
						}
					this.$Request.postRequest(this.$url.GATHER.teacherPublishInform, a).then(res => {
						console.log('通知发布完成返回数据', res);
					}).catch(err => {
						console.log('出错了，错误是', err);
					})
				}
				this.HideModal()
			},
			GetData() {
				this.itemList = []
				this.classList = []
				let a = {
					phone: this.phone
				}

				this.$Request.getRequest(this.$url.GATHER.checkTeacherCreateInform, a).then(res => {
					if (res.result.length != 0) {
						this.itemList = this.itemList.concat(res.result)
					}
				}).catch(err => {
					console.log('出错了,错误是:', err);
				})
				let b = {
					phone: this.phone
				}
				this.$Request.getRequest(this.$url.GATHER.CheckTeacherCreateclass, b).then(res => {
					if (res.result.length != 0) {
						this.classList = this.classList.concat(res.result)
					}
				}).catch(err => {
					console.log('出错了，错误是:', err);
				})
			},
			//编辑和显示页面
			EditAndShow(index) {
				uni.navigateTo({
					url: '../adminNoticeShowAndEdit/adminNoticeShowAndEdit?phone=' + this.phone + '&informId=' +
						this.itemList[index].inf_id
				})
			},
			Release(index) {
				if (this.classList.length == 0) {
					this.nullClass = true
				} else {
					this.modalName = 'RadioModal';
					this.ReleaseIndex = index
				}
			},
			HideModal() {
				this.chociedClass = []
				this.modalName = null
			},
			AddNotice() {
				uni.navigateTo({
					url: '../adminAddNotice/adminAddNotice'
				})
			},
			textareaBInput(e) {
				this.textareaBValue = e.detail.value
			},
			CreateTZ() {
				this.HideModal()
			}
		}
	}
</script>

<style>
	.home {
		width: 750rpx;
		height: auto;
	}

	.content1 {
		height: auto;
	}

	.text1 {
		font-size: 55rpx;
	}

	.expend {
		width: 500rpx;
		height: 600rpx;
	}

	.tightSize {
		width: auto;
		height: 450rpx
	}
</style>
