<template>
	<view class="home">
		<view class="box">
			<view class="gradebox">
				<view class="grade">{{grade}}分</view>
			</view>
			<view class="padding flex flex-direction position">
				<view class="text">当前作业已完成，点击可查看详情</view>
				<button class="cu-btn bg-blue lg posbut" @tap="Details">查看详情</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				grade: '',
				params: {},		//传递参数
			}
		},
		
		onLoad: function(option) {
			let data = JSON.parse(option.index);
			console.log('传递的参数->', data);
			this.params = data;
			uni.setNavigationBarTitle({
				title: data.title
			})
			this.grade = data.grade;
		},
		
		methods: {
			Details() {		//点击进入错题详情
				console.log('点击了错题详情');
				let data = JSON.stringify(this.params);
				uni.navigateTo({
					url: '../Testdetails/Testdetails?index=' + data
				})
			}
		}
	}
</script>

<style>
page {
	background-color: #ffffff;
	
}

.home {
	width: 750rpx;
	height: 100%;
}

.box {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.gradebox {
	/* background-color: green; */
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 100%;
	position: absolute;
	top: 25%;
}

.grade {
	font-size: 150rpx;
	color: #0081FF;
	/* background-color: yellow; */
}

.text {
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding-bottom: 15rpx;
	color: #b3b3b3;
}

.position {
	position: fixed;
	bottom: 0;
	width: 100%;
	/* background-color: red; */
}

.posbut {
	margin-bottom: 85rpx;
}
</style>
