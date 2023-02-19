<template>
	<view class="home">
		<!-- 发布作业/测试界面 -->
		<view class="flex bg-white padding justify-between align-center">
			<view class="flex justify-between">
				<view class="text-bold"style="font-size: 40rpx;">资料</view>
				<view class="text-bold"style="font-size: 40rpx;">({{work}}/{{totalWork}})</view>
			</view>
			<button class="cu-btn bg-green lg shadow" @tap="TurnToPage"  data-target="../adminAddJob/adminAddjob">
				<view style="font-size: 30rpx;">+添加</view>
			</button>
		</view>
		<view class="bg-white padding">
			<u-collapse accordion="false">
					<u-collapse-item title="资料">
						
						<view class="flex justify-between align-center" v-for="item in itemList">
							<view class="flex align-center">
								<text style="font-size: 60rpx;color: #000000;" class="margin-xs" :class="icon"></text>
								<text class="text-bold text-black u-font-xl">{{item.name}}</text>				
							</view>
							<view>
								
								<text style="font-size: 60rpx;color: #000000;" class="margin-xs" :class="icon2" @tap="More"></text>
							</view>
							<!-- <button class="cu-btn bg-green  shadow" @tap="" >更多</button> -->
						</view>
					</u-collapse-item>
				</u-collapse>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				work:0,
				icon:"cuIcon-edit",
				icon2:"cuIcon-moreandroid",
				totalWork:10,
				itemList: [],
				teacherId:"",
			}
		},
		onLoad:function(options){
			// this.
				let a = {
					teacherId:this.teacherId
				}
				console.log("传入的数据a",a)
				// let b = JSON.stringify(a);
				// console.log(this.$url.GATHER.createCourse)
				this.$Request.getRequest(this.$url.GATHER.checkTeacherCreateMeans, a).then(res => {
					console.log('服务器返回列表', res);
					console.log('服务器返回列表', res.result);
					this.itemList=this.itemList.concat(res.result)
				}).catch(err => {
					console.log('222', err);
				})
		},
		methods: {
			TurnToPage(e){
				console.log( e.currentTarget.dataset.target)
				uni.navigateTo({
				    url:"../adminAddzl/adminAddzl"
				});
			},
			More(){
				console.log("点击成功！！")
			}
		}
	}
</script>

<style>
	.home{
		width: 750rpx;
		height: auto;
	}
</style>
