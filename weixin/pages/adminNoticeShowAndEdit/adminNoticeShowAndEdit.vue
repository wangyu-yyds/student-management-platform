<template>
	<view>
		<view>
			<view class="bg-white padding align-center" style="font-size: 35rpx;">
				<view class="text-bold" style="font-size: 40rpx;">作者:</view>
				<view>{{itemList[0].inf_author}}</view>
			</view>
			<view class="bg-white padding align-center" style="font-size: 35rpx;">
				<view class="text-bold" style="font-size: 40rpx;">创建时间:</view>
				<view>{{itemList[0].inf_time}}</view>
			</view>
			<view class="bg-white padding align-center" style="font-size: 35rpx;">
				<view class="text-bold" style="font-size: 35rpx;">通知内容:</view>
				<view>{{itemList[0].inf_content}}</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//获取的通知内容列表存放
				itemList: [],
				phone: 0,
				infromId: 0,
			}
		},
		onLoad: function(options) {
			this.itemList = []
			this.phone = options.phone
			this.informId = options.informId
		},
		onShow:function(){
			this.GetData()
		},
		methods: {
			GetData(){
				this.itemList=[]
				let a = {
					phone: this.phone,
					informId: this.informId
				}
				console.log("传入的数据a", a)
				// let b = JSON.stringify(a);
				// console.log(this.$url.GATHER.createCourse)
				// this.$global.vxUser.phone = "561651251"
				// console.log(this.$global.vxUser)
				this.$Request.getRequest(this.$url.GATHER.checkTeacherCreateInform, a).then(res => {
					console.log('服务器返回列表', res);
					console.log('服务器返回获取的通知内容', res.result);
					this.itemList = this.itemList.concat(res.result)
				}).catch(err => {
					console.log('出错了,错误是:', err);
				})
			},
			
		}
	}
</script>

<style>

</style>
