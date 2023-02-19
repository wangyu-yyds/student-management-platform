<template>
	<view class="home">
		<!-- 个人阅读详情 -->
		<view class="flex solids padding justify-between align-center bg-white">
			<view class="flex align-center">
				<view class="cu-avatar margin-xs xl round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg);margin-top: 20rpx;"></view>
				<view class="nichen margin-xs  text-bold">张三</view>
			</view>
			<view >
				<button class="cu-btn bg-blue" @tap="ShowModal" data-target="DialogModal1">管理</button>	
			</view>
		</view>
		<view class="bg-white solids text-lg bg11">
			
			<u-table>
				<u-tr class="u-tr ">
					<u-th class="u-th">资料名称</u-th>
					<u-th class="u-th">观看次数</u-th>
				</u-tr>
				<u-tr font-size="28rpx" class="u-tr"v-for="(item, index) in itemList" :key="index">
					<u-td class="u-td">{{item.name}}</u-td>
					<u-td  class="correct u-td">{{item.lookTimes}}</u-td>
				</u-tr>
			</u-table>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemList:[{
					name:"资料一",
					lookTimes:5,
					
				},
				{
					name:"资料二",
					lookTimes:2,
					
				},
				{
					name:"资料三",
					lookTimes:5,
					
				},
				{
					name:"资料四",
					lookTimes:2,
					
				}],
			}
		},
		methods: {
			Showmodal(){
				console.log("点击成功")
			}
		}
	}
</script>

<style>
	.home{
		width: 750rpx;
	}
	.nichen{
		font-size: 35rpx;
	}
	.correct{
		height: 58.5rpx;
	}
</style>
