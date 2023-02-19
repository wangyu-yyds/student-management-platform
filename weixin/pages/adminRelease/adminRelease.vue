<template>
	<view>
		<u-notice-bar type="warning"more-icon="true" mode="horizontal" :is-circular="true" :list="textList"></u-notice-bar>
		<view class="home margin-top">
			<!-- 发布页面 -->
			<view border-radius="15" class="margin-left margin-right margin-bottom">
				<view class="solids bg-white flex align-center" @tap="TurnToPageJobRelease">
					<view class="flex-sub text-center">
						<view class="solid-bottom  padding">
							<u-icon name="file-text" size="100rpx" color="#25810b" class="icon"></u-icon>
						</view>
						<view class="padding text-bold">发布作业/测试</view>
					</view>
				</view>
			</view>
			<view class="margin-left margin-right margin-bottom">
				<view class="solids bg-white flex align-center " @tap="TurnToPageNoticeRelease">
					<view class="flex-sub text-center">
						<view class="solid-bottom text-sl padding">
							<u-icon name="chat" size="100rpx" color="#25810b" class="icon"></u-icon>
						</view>
						<view class="padding text-bold">发布通知</view>
					</view>
				</view>
			</view>
			<view class="margin-left margin-right margin-bottom">
				<view class="solids bg-white flex align-center" @tap="TurnToPagezlRelease">
					<view class="flex-sub text-center">
						<view class="solid-bottom text-sl padding">
							<u-icon name="bookmark" size="100rpx" color="#25810b" class="icon"></u-icon>
						</view>
						<view class="padding text-bold">发布资料</view>
					</view>
				</view>
			</view>
			<view class="margin-left margin-right margin-bottom">
				<view class="solids bg-white flex align-center" >
					<view class="flex-sub text-center">
						<view class="solid-bottom text-sl padding">
							<u-icon name="eye-fill" size="100rpx" color="#25810b" class="icon"></u-icon>
						</view>
						<view class="padding text-bold">其余功能正在开发中。。。</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
		<u-tabbar v-model="current"
				  active-color="#1E90FF"
				  :height="tabbarheight"
				  :list="list"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				icon1:"cuIcon-text",
				textList:["下界的苦味","我要一概承担","我要跟暴风雨奋斗","即使在破船中","也不张惶"],
				list: [
				{
					pagePath: '/pages/adminmain/adminmain',
					iconPath: "home",
					selectedIconPath: "home-fill",
					text: '主页',
					isDot: false,
					customIcon: false,
				},
				{
					pagePath: '/pages/adminRelease/adminRelease',
					iconPath: "plus-circle",
					selectedIconPath: "plus-circle-fill",
					text: '发布',
					isDot: false,
					customIcon: false,
				},
				{
					pagePath: '/pages/adminhome/adminhome',
					iconPath: "account",
					selectedIconPath: "account-fill",
					text: '我的',
					isDot: false,
					customIcon: false,
				}],
				current: 0,
				tabbarheight: '50px',	//宽屏动态改变tabbar高度
			}
		},
		onLoad() {
			this.Iswidthscreen();
		},
		
		methods: {
			TurnToPageJobRelease() {
				console.log("跳转至创建作业")
				uni.navigateTo({
					url:'../adminReleaseJob/adminReleaseJob'
				})
			},
			
			TurnToPageNoticeRelease() {
				console.log("跳转至创建通知")
				uni.navigateTo({
					url:'../adminReleaseNotice/adminReleaseNotice'
				})
			},
			
			TurnToPagezlRelease() {
				console.log("跳转至创建资料")
				uni.navigateTo({
					url:'../adminReleasezl/adminReleasezl'
				})
			},
			
			Iswidthscreen() {		//是否为宽屏
				let screenwidth = 0;
				uni.getSystemInfo({
					success: (res => {
						console.log('设备品牌和设备型号', res.brand, ' - ', res.model)
						console.log('屏幕宽度', res.screenWidth);
						console.log('可使用屏幕宽度', res.windowWidth);
						screenwidth = res.screenWidth;
					})
				});
				let height = screenwidth * 0.12 + 3;
				this.tabbarheight = JSON.stringify(parseInt(height)) + 'px';
				console.log('最终高度', this.tabbarheight);
			}
			
			
		}
	}
</script>

<style>
	.text{
		font-size: 50rpx;
	}
</style>
