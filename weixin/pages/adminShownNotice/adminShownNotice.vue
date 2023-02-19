<template>
	<view>
		<!-- 显示通知内容 -->

		<view class="flex solid-bottom bg-white padding justify-between">
			<view class="margin-left text1">{{noticeList[0].inf_name}}</view>
			<view class="margin-right text3">{{noticeList[0].inf_author}}</view>
		</view>
		<view>
			<view class="text2">{{noticeList[0].inf_content}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 储存题目的列表
				noticeList: [],
				// 通知Id
				noticeId: 0,
			}
		},
		onLoad: function(options) {
			// 该班级的编号
			console.log("这是通知详情页")
			this.classId = options.classId
			this.noticeId = options.noticeId
			console.log(this.classId, this.textId)
			// 向服务器请求该通知
			let a = {
				informId: this.noticeId
			}
			console.log("通知编号参数正在传递zdfhgbxfh", a)
			this.$Request.getRequest(this.$url.GATHER.classInformCondition, a).then(res => {
				console.log('服务器返回的班级通知列表', res);
				this.noticeList = this.noticeList.concat(res.result)
				// let array = res.result;			
				// for( var i = 0; i < array.length; i++ ){
				// 	this.textList = array;
				// }
				console.log("接收到通知内容", this.noticeList)
			}).catch(err => {
				console.log('222', err);
			})

		},
		methods: {

		}
	}
</script>

<style>
	.text1 {
		font-size: 40rpx;
	}

	.text2 {
		font-size: 35rpx;
	}
	.text3{
		font-size: 30rpx;
	}
</style>
