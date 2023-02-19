<template>
	<view class="home">
		<view class="icon-style">
			<u-icon name="../../../static/Problem.png" size="750" class="icon"></u-icon>
		</view>
		<view class="head">
			<text class="head-text">问题列表</text>
		</view>
		<view class="agreement" @tap="Agreement">
			<view style="display: flex;">
				<text class="text-style">{{pro1.title}}</text>
				<u-icon name="arrow-right" size="55" color="#dddddd"
						style="margin-left: auto;margin-top: 25rpx;"></u-icon>
			</view>
		</view>
		<view class="develop" @tap="Develop">
			<view style="display: flex;">
				<text class="text-style">{{pro2.title}}</text>
				<u-icon name="arrow-right" size="55" color="#dddddd"
						style="margin-left: auto;margin-top: 25rpx;"></u-icon>
			</view>
		</view>
		<view class="edition" @tap="Edition">
			<view style="display: flex;">
				<text class="text-style">{{pro3.title}}</text>
				<u-icon name="arrow-right" size="55" color="#dddddd"
						style="margin-left: auto;margin-top: 25rpx;"></u-icon>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pro1: {
						num: 1,
						title: '输入姓名和学号/工号后提示错误怎么办？'
					},
				pro2: {
						num: 2,
						title: '没有获取到我的课程、通知等内容怎么办？'
					},
				pro3: {
						num: 3,
						title: '怎么查询成绩和错题？'
				},
			}
		},
		
		methods: {
			Agreement() {
				let title = JSON.stringify(this.pro1)
				uni.navigateTo({
					url:'../Problemitem/Problemitem?index=' + title
				})
			},
			
			Develop() {
				let title = JSON.stringify(this.pro2);
				uni.navigateTo({
					url:'../Problemitem/Problemitem?index=' + title
				})
			},
			
			Edition() {
				let title = JSON.stringify(this.pro3);
				uni.navigateTo({
					url:'../Problemitem/Problemitem?index=' + title
				})
			}
		}
	}
</script>

<style>
	.home {
		width: 750rpx;
	}
	
	page {
		background-color: #ffffff;
	}
	
	.head {
		/* background-color: blue; */
		border-bottom: 1rpx solid #c6c6c6;
	}
	
	.head-text {
		font-size: 30rpx;
		color: #afafaf;
		padding-left: 40rpx;
	}
	
	.text-style {
		font-size: 35rpx;
		margin-top: 25rpx; 
		margin-left: 40rpx;
	}
	
	.privacy,.agreement,.develop,.edition {
		width: 750rpx;
		height: 110rpx;
		background-color: #ffffff;
		border-bottom: 1rpx solid #c6c6c6;
	}
	
	.agreement {
		margin-top: 15rpx;
	}
</style>
