<template>
	<view>
		<view class="u-page">
			<!-- 我的 -->
			<view class="my">
				<view class="mytx">
					<view style="display: flex;">
						<view class="mytx1">
							<u-avatar :src="src" size="large"></u-avatar>
						</view>
						<view class="mywxnc">微信昵称</view>
					</view>
					<view class="mysjh">手机号：213113123121</view>
				</view>
				<view class="myzl">
					<from>
						<u-field  v-model="username"
							 label="姓名:" 
							 placeholder="姓名" 
							 border="ture" 
							 label-align="center" 
							 clear-size="40rpx"
							 border-bottom="false">
						</u-field>
						<u-field v-model="usernum"
							clearable="true"
							label="学号/工号:" 
							placeholder="学号/工号" 
							border="false"
							label-align="center"
							clear-size="40rpx"
							border-bottom="false">
						</u-field>
						<view class="butbox">
							<u-button class="buttons" type="primary" ripple="true" shape="circle" size="medium" @click="clicked">
								学生登录</u-button>
							<u-button class="buttont" type="primary" ripple="true" shape="circle" size="medium" @click="clicked">
								老师登录</u-button>
						</view>
					</from>			
				</view>	
			</view>
		</view>
		<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
		<!-- <u-tabbar v-model="current" :list="list"></u-tabbar> -->
		<u-tabbar 
					:list="tabBerList"
					:mid-button="midBtn"
					:active-color="activeColor"
					:inactive-color="inactiveColor"
					:border-top="borderTop"
				></u-tabbar>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	export default {
		data() {
			return {
				list: [{
						// iconPath: "static/home.png",
						// selectedIconPath: "static/homelight.png",
						text: '主页',
						count: 2,
						isDot: false,
						customIcon: false,
					},
					{
						// iconPath: "static/mine.png",
						// selectedIconPath: "static/minelight.png",
						text: '我的',
						count: 23,
						isDot: false,
						customIcon: false,
						inactiveColor: '#909399',
						activeColor: '#5098FF'
					},
				],
				current: '',
				username: '',
				usernum: '',
				borderTop: false,
				
			}
		},
		
		methods: {
			clicked(res) {
				var buts = uni.createSelectorQuery().selectAll(".buttons");
				var butt = uni.createSelectorQuery().selectAll(".buttont");
				
			},
			switchTab(e){
				console.log("点击了");
			}
			
		},
		
		computed: {
			...mapGetters([
				'tabBerList',
				'midBtn'
			])
		}
		
	}
</script>

<style>
	/* 我的 */
	.mytx {
		width: 750rpx;
		height: 250rpx;
		background-color: #ffffff;
	}
	
	.mytx1 {
		width: 180rpx;
		height: 160rpx;
		padding-top: 20rpx;
		padding-left: 20rpx;
	
	}
	
	.mywxnc {
		margin-top: 50rpx;
		font-size: 50rpx;
	}
	
	.myzl {
		width: 750rpx;
		background-color: #ffffff;
		border: 2rpx solid #000000;
		border-style: solid none;
		padding-top: 60rpx;
	}
	
	.mysjh {
		margin-top: 15rpx;
		margin-left: 30rpx;
	}
	
	.myxm {
		padding: 50rpx;
	}
	
	.mygh {
		padding: 0rpx 50rpx 50rpx 50rpx;
	}
	
	.butbox {
		margin: 50rpx 0;
	}
	
	.buttont,.buttons {
		margin: 30rpx 50rpx 30rpx 60rpx;
	}
</style>