<template>
	<view class="home">
		<view class="icon-style">
			<u-icon name="../../../static/Sutdent.png" size="150" class="icon"></u-icon>
		</view>
		<view class="privacy" @tap="Privacy">
			<view style="display: flex;">
				<text class="text-style">隐私政策</text>
				<u-icon name="arrow-right" size="55" color="#dddddd"
						style="margin-left: auto;margin-top: 25rpx;"></u-icon>
			</view>
		</view>
		<view class="agreement" @tap="Agreement">
			<view style="display: flex;">
				<text class="text-style">用户协议</text>
				<u-icon name="arrow-right" size="55" color="#dddddd"
						style="margin-left: auto;margin-top: 25rpx;"></u-icon>
			</view>
		</view>
		<view class="develop" @tap="Develop">
			<view style="display: flex;">
				<text class="text-style">开发人员</text>
				<u-icon name="arrow-right" size="55" color="#dddddd"
						style="margin-left: auto;margin-top: 25rpx;"></u-icon>
			</view>
		</view>
		<view class="edition" @tap="Edition">
			<view style="display: flex;">
				<text class="text-style">本机版本：V1.1.2</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			Privacy() {
				console.log("点击了隐私政策");
			},
			
			Agreement() {
				console.log("点击了协议");
			},
			
			Develop() {
				console.log("点击了开发");
				uni.navigateTo({
					url: '../Develop/Develop'
				})
			},
			
			Edition() {
				console.log("点击了版本");
			}
		}
	}
</script>

<style>
	page {
		background-color: #f6f6f6;
	}
	
	.home {
		width: 750rpx;
	}
	
	.icon-style {
		display: flex;
		flex-direction: row;
		justify-content: center;
		background-color: #ffffff;
		padding-top: 100rpx;
		padding-bottom: 100rpx;
		border-bottom: 1rpx solid #f6f6f6;
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
	}
	
	.agreement {
		margin-top: 15rpx;
	}
</style>
