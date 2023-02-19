<template>
	<view class="home">
		<view class="title">{{title}}</view>
		<view class="head">帮助中心</view>
		<view class="content">
			<rich-text :nodes="strings"></rich-text>
			<view class="but">
				<button class="cu-btn bg-green shadow position" @tap="Back">返回</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				num: '',					//问题编号		
				title: '',
				strings: '',				//解决的内容
			}
		},
		
		onLoad: function(option) {
			let data = JSON.parse(option.index);
			console.log(data.num);
			console.log(data.title);
			this.num = data.num;
			this.title = data.title;
			this.Content();
		},
		
		methods: {
			Back() {
				console.log("点击了返回");
				uni.navigateBack({
					url: '../Problem/Problem'
				})
			},
			
			Content() {
				switch(this.num) {
					case 1: 
						this.strings = '如果输入的学号/工号，姓名登录条件都是正确的，但是一直显示错误，请检查输入的内容有没有空格，有空格要去掉，英文字母需要注意大小写，同时检查设备联网状态。若以上均正常，请联系管理员。';
						break;
					
					case 2: 
						this.strings = '&nbsp;&nbsp;本程序推荐登录使用，方便进入对应的班级。课程、通知等内容均由老师自主发布，同时请检查设备联网状态和登录状态。添加课程注意课程码是否正确。获取后若没有内容请下拉刷新。若以上均正常，请联系管理员。';
						break;
					
					case 3: 
						this.strings = "&nbsp;&nbsp;测试点击提交后等待计算分数，提交测试后无法对试卷进行再编辑，直至当前课程结束。";
						break;
					
					default: 
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
	.home {
		width: 750rpx;
	}
	
	page {
		background-color: #ffffff;
	}
	
	.title {
		font-size: 40rpx;
		font-weight: 600;
		padding-left: 40rpx;
		padding-top: 25rpx;
	}
	
	.head {
		font-size: 30rpx;
		padding-left: 40rpx;
		padding-top: 25rpx;
		color: #007AFF;
	}
	
	.content {
		display: flex;
		flex-direction: column;
		font-size: 35rpx;
		padding-top: 30rpx;
		.but{
			margin-top:75rpx;
			margin-bottom: 30rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
		}
		
		rich-text {
			text-indent: 2em;
			padding-left: 40rpx;
			padding-right: 40rpx;
		}
	}
	
</style>
