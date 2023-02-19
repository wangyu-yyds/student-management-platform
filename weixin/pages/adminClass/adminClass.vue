<template>
	<view>
		<u-cell-group>
			<u-cell-item title="课程码:" hover-class="none" :arrow="false" class="flex text-bold align-center "
				:title-style="{'font-size':'35rpx'}">
				<view class="flex justify-between">
					<view>
						<view class="margin-left text-black text-bold text1 margin-right">{{cla_sign}}</view>
					</view>
					<view>
						<button class="cu-btn bg-green shadow" @tap="ShowClassMember">
							<view style="font-size: 35rpx;">班级成员</view>
						</button>
					</view>
				</view>
			</u-cell-item>
		</u-cell-group>
		
		
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 作业完成情况
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow" @tap="showModal" data-target="DrawerModalL1">查看</button>
			</view>
		</view>
		<view class="cu-modal drawer-modal justify-start" :class="modalName=='DrawerModalL1'?'show':''" @tap="HideModal">
			<scroll-view scroll-y="true" class="cu-dialog basis-lg" @tap.stop="" :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
				<view class="cu-list menu text-left">
					<view class="cu-item arrow" v-for="(item,index) in textList" :key="index">
						<view class="content" @click="ShowText(index)" @longpress="Langtap1(index)">
							<view class="margin-top">{{item.tas_name}}</view>
							<view class="margin-bottom">{{item.tas_time}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 资料阅读情况
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow" @tap="showModal" data-target="DrawerModalL2">查看</button>
			</view>
		</view>
		<view class="cu-modal drawer-modal justify-start" :class="modalName=='DrawerModalL2'?'show':''" @tap="HideModal">
			<scroll-view scroll-y="true" class="cu-dialog basis-lg" @tap.stop="" :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
				<view class="cu-list menu text-left">
					<view class="cu-item arrow" v-for="(item,index) in zlList" :key="index">
						<view class="content"@click="ShowZL(index)" @longpress="Langtap2(index)">
							<view class="margin-top">{{item.mea_name}}</view>
							<view class="margin-bottom">{{item.mea_time}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 通知情况
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow" @tap="showModal" data-target="DrawerModalL3">查看</button>
			</view>
		</view>
		<view class="cu-modal drawer-modal justify-start margin-bottom" :class="modalName=='DrawerModalL3'?'show':''" @tap="HideModal">
			<scroll-view class="cu-dialog basis-lg" @tap.stop="" :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
				<view class="cu-list menu text-left">
					<view class="cu-item arrow" v-for="(item,index) in noticeList" :key="index">
						<view class="content" @click="ShowNotice(index)" @longpress="Langtap3(index)">
							<view class="margin-top">{{item.inf_name}}</view>
							<view class="margin-bottom">{{item.inf_time}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<view class="margin-top padding  solid-bottom  bg-white bg11">
			<text @click="ShowTotal()" class="text1 padding margin-left">综合成绩管理</text>
		</view>
		<!-- 长按删除课程-->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green modalfont" @tap="Delete1()">确定</view>
					<view class="action text-blue modalfont" @tap="HideModal()">取消</view>
				</view>
				<view class="modalfont bg-white padding text-lg">
					确认删除该作业？
				</view>
			</view>
		</view>

		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal2'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green modalfont" @tap="Delete2()">确定</view>
					<view class="action text-blue modalfont" @tap="HideModal()">取消</view>
				</view>
				<view class="modalfont bg-white padding text-lg">
					确认删除该资料？
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal3'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green modalfont" @tap="Delete3()">确定</view>
					<view class="action text-blue modalfont" @tap="HideModal()">取消</view>
				</view>
				<view class="modalfont bg-white padding text-lg">
					确认删除该通知？
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemStyle: {
					marginTop: '5rpx',
					background: '#eeffe2',
					paddingLeft: '10rpx',

				},
				// 该班级所在列表的索引，班级ID
				classId: 0,
				// 作业列表
				textList: [],
				// 资料列表
				zlList: [],
				// 通知列表
				noticeList: [],
				//课程号
				cla_sign: 0,
				//作业编号
				taskId: 0,
				// 删除选项
				modalName: "",
				// 选中删除的目标索引
				deleteIndex: 0,
			}
		},
		onLoad: function(options) {
			// 该班级的编号
			this.classId = options.ClassId
			this.cla_sign = options.cla_sign
		},
		onShow: function() {
			// 向服务器请求该课程列表数据
			this.GetData()
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			//长按删除函数
			Langtap1(index) {
				this.deleteIndex = index
				this.modalName = "bottomModal1"
			},
			Langtap2(index) {
				this.deleteIndex = index
				this.modalName = "bottomModal2"
			},
			Langtap3(index) {
				this.deleteIndex = index
				this.modalName = "bottomModal3"
			},
			// 隐藏删除弹窗
			HideModal() {
				this.modalName = null
			},
			MqttDelete(that){
				let topic='class'+that.classId
				let message={"code":"1", "content":"1", "topic" :topic, "type":"text"}
				try{
					that.$global.client.PublishMessage(topic, JSON.stringify(message))
				}catch(e){
					console.log("删除班级时,向mqtt发送消息出错")
					return
				}
			},
			Delete1() {
				let a = {
					taskId: this.textList[this.deleteIndex].tas_id,
					classId: this.classId,
				}
				console.log("输入的a", a)
				this.$Request.postRequest(this.$url.GATHER.deletePublishTask, a).then(
					res => {
						console.log("删除结果:", res)
						if (res.code == 0) {
							this.MqttDelete(this)
							this.GetData()
							this.HideModal()
							uni.showToast({
								// 弹出框的标题
							 title: '删除成功!',
								// 弹出框的图标，不想设置图标时请给none
								icon: 'none',
								duration: 500,
							})
						}
					}).catch(err => {
					console.log('出错了，错误是：', err);
				})

			},
			Delete2() {
				let a = {
					meansId: this.zlList[this.deleteIndex].mea_id,
					classId: this.classId,
				}
				console.log("输入的a", a)
				this.$Request.postRequest(this.$url.GATHER.deletePublishMeans, a).then(
					res => {
						console.log("删除结果:", res)
						if (res.code == 0) {
							this.MqttDelete(this)
							this.GetData()
							this.HideModal()
							uni.showToast({
								// 弹出框的标题
							 title: '删除成功!',
							 // 弹出框的图标，不想设置图标时请给none
								icon: 'none',
								duration: 500,
							})
						}
					}).catch(err => {
					console.log('出错了，错误是：', err);
				})

			},
			Delete3() {
				let a = {
					informId: this.noticeList[this.deleteIndex].inf_id,
					classId: this.classId,
				}
				console.log("输入的a", a)
				this.$Request.postRequest(this.$url.GATHER.deletePublishInform, a).then(
					res => {
						console.log("删除结果:", res)
						if (res.code == 0) {
							this.MqttDelete(this)
							this.GetData()
							this.HideModal()
							uni.showToast({
								// 弹出框的标题
								title: '删除成功!',
							 // 弹出框的图标，不想设置图标时请给none
								icon: 'none',
								duration: 500,
							})
						}
					}).catch(err => {
					console.log('出错了，错误是：', err);
				})

			},
			// 显示班级成员界面,传入班级所在索引
			ShowClassMember() {
				uni.navigateTo({
					url: '../adminClasscy/adminClasscy?classId=' + this.classId
				})
			},
			ShowText(index) {
				var textId = this.textList[index].tas_id
				uni.navigateTo({
					url: '../adminZYxq/adminZYxq?classId=' + this.classId + '&textId=' + textId
				})
				console.log("点击作业界面显示成功")
			},
			ShowZL(index) {
				var zlId = this.zlList[index].mea_id
				uni.navigateTo({
					url: '../adminZLxq/adminZLxq?classId=' + this.classId + '&zlId=' + zlId
				})
			},
			ShowNotice(index) {
				var noticeId = this.noticeList[index].inf_id
				uni.navigateTo({
					url: '../adminShownNotice/adminShownNotice?classId=' + this.classId + '&noticeId=' + noticeId
				})
			},
			// 将所在班级的编号传入综合成绩界面
			ShowTotal() {
				uni.navigateTo({
					url: '../adminCpm/adminCpm?classId=' + this.classId
				})
			},
			GetData() {
				this.textList = []
				this.zlList = []
				this.noticeList = []
				let a = {
					classId: this.classId
				}
				console.log("班级编号参数正在传递" + a.classId)
				this.$Request.getRequest(this.$url.GATHER.classTask, a).then(res => {
					console.log('服务器返回的班级作业列表', res.result);
					this.textList = this.textList.concat(res.result)
					this.textListlength = this.textList.length
					console.log("接收到的作业列表", this.textList)
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
				this.$Request.getRequest(this.$url.GATHER.classMeans, a).then(res => {
					console.log('服务器返回的班级资料列表', res);
					this.zlList = this.zlList.concat(res.result)
					console.log("接收到的资料列表", this.zlList)
				}).catch(err => {
					console.log('出错了', err);
				})
				this.$Request.getRequest(this.$url.GATHER.classInform, a).then(res => {
					console.log('服务器返回的班级通知列表', res);
					this.noticeList = this.noticeList.concat(res.result)

					console.log("接收到的通知列表", this.noticeList)
				}).catch(err => {
					console.log('出错了', err);
				})
			}
		},

	}
</script>

<style>
	.title {
		color: $u-tips-color;
		background-color: $u-bg-color;
		padding: 15px;
		font-size: 15px;
	}

	.bg11 {
		width: 750rpx;
		height: auto;
	}

	.text1 {
		font-size: 35rpx;
	}
	
</style>
