<template>
	<view>
		<u-cell-group >
				<u-cell-item title="全部班级" hover-class="none" :arrow="false" :title-style="{'font-size':'35rpx'}">
					<button class="cu-btn bg-green shadow" @tap="AddClass" data-target="DialogModal1">
						<view style="font-size: 45rpx;">+</view>
						<view style="font-size: 35rpx;">添加</view>	
					</button>
				</u-cell-item>
		</u-cell-group>
		
		<u-cell-group >
			<u-cell-item @longpress="Langtap(index)":title="item.cla_name" :title-style="{'font-size':'35rpx'}"
			:value="item.cla_people":value-style="{'font-size':'35rpx'}" class="flex justify-start" @click="TurnPage(item.cla_id,item.cla_sign)" 
			  v-for="(item,index) in classList" :key="index">
				<view class=" margin-left text-bold text1">
					<!-- {{item.cla_name}} -->
				</view>
			</u-cell-item>
			
		</u-cell-group>
		<!-- 长按删除班级-->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green modalfont" @tap="Delete()">确定</view>
					<view class="action text-blue modalfont" @tap="HideModal()">取消</view>
				</view>
				<view class="modalfont bg-white padding text-lg">
					确认删除该班级？
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 传入的课程编号
				courseId:0,
				CustomBar: this.CustomBar,
				modalName: null,
				// 装所有班级的信息的列表
				classList:[],
				// 删除班级的索引
				deleteIndex:0,
			}
		},
		onLoad: function() {
			// 该课程的编号
			this.courseId =this.$global.vxUser.courseId
			// 使用Mqtt进行连接
			
		},
		onShow:function(){
			this.GetData()
			this.MqttBinding()
		},
		methods: {
			// Mqtt页面链接部分
			MqttBinding(){
				// 订阅课程主题
				var topic="course"+this.courseId
				console.log("全局的client值为",this.$global.client)
				try{
					this.$global.client.subscribe(topic, () => {
						console.log(`订阅 ${topic}主题成功`)
					})
				}catch(e){
					console.log('订阅主题时client.on()出错了!')
					return
				}
				// 接受所订阅主题的消息如果所订阅course主题有数据变动则刷新数据
				this.$global.client.on('message', (theme, payload) => {
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
			// 删除班级
			Delete() {	
				let a = {
					classId: this.classList[this.deleteIndex].cla_id,
				}
				console.log("删除班级传入的数据", a)
				this.$Request.getRequest(this.$url.GATHER.deleteClass, a).then(res => {
					console.log('删除班级返回值', res)
					this.HideModal()
					// 向删除的班级主题发送数据
					let topic='class'+this.classList[this.deleteIndex].cla_id
					let message={"code":"1", "content":"1", "topic" :topic, "type":"class"}
					this.GetData()
					try{
						this.$global.client.PublishMessage(topic, JSON.stringify(message))
					}catch(e){
						console.log('向班级主题发送消息出错了!')
						return
					}
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
			},
			//长按删除
			Langtap(index) { //长按item
				this.deleteIndex = index
				this.ShowModal();
			},
			// 显示删除班级弹窗
			ShowModal() {
				// this.modalName = e.currentTarget.dataset.target;
				this.modalName = 'bottomModal';
			},

			GetData(){
				this.classList=[]
				let a={
						courseId: this.courseId,
					}
				this.$Request.getRequest(this.$url.GATHER.getAllClass, a).then(res =>{
					console.log('服务器返回班级列表',res);
					let array = res.result;
					for( let i = 0; i < array.length; i++ ){
						this.classList = array;
					}
				}).catch(err => {
					console.log('222',err);
				})
			},
			// 点击后跳转班级页面
			TurnPage(index,index2){
				uni.navigateTo({
					url:'../adminClass/adminClass?ClassId='+index+'&cla_sign='+index2
				})
			},
			//添加班级
			AddClass(){
				uni.navigateTo({
					url:'../adminAddClass/adminAddClass?courseId='+this.courseId+'&coursename='+this.cour
				})
			},
			HideModal(e) {
				this.modalName = null
			},
		}
	}
</script>

<style>
	.text1{
		font-size: 35rpx;
	}
</style>
