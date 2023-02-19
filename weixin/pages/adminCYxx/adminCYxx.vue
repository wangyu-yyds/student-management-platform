<template>
	<view>
		<u-line color="#c3c3c3"></u-line>
		<view class="jbxx">
			<view style="display: flex;">
				<view class="jbxxleft">
					<view class="xnxh">
						<view>
							姓名：{{itemList[2][0].stu_name}}
						</view>
						<view>
							学号：{{itemList[2][0].stu_no}}
						</view>
					</view>
				</view>
				<u-line color="#ffffff" direction="col" margin="20rpx" length="260rpx" hair-line="false"></u-line>
				<view class="jbxxright">
					<view class="jbxxright1">
						{{Total}}
					</view>
					<view class="jbxxright2">
						本课程综合评分
					</view>
				</view>
			</view>
		</view>

		<u-line color="#c3c3c3"></u-line>
		<view class="xxqk">
			<view class="xxqkb">
				<view class="xxqkbL">
					<view style="margin-left: 15rpx;margin-bottom: 15rpx;margin-top: 10rpx;">
						作业/测试完成情况：
					</view>
					<view style="font-size: 70rpx;text-align: center;">
						{{itemList[1][2].StuClassTasks}} / {{itemList[1][0].classTasks}}
					</view>
					<view style="text-align: center;">
						（提交次数/应提交次数）
					</view>
				</view>
				<u-line color="#c3c3c3" direction="col" margin="20rpx" length="140rpx" hair-line="false"></u-line>
				<view class="xxqkbR">
					<view class="xxqkbR1">
						<view class="xxqkbR1fs">
							{{itemList[2][0].taskGrade}}
						</view>
						<view style="text-align: center;">
							平均分
						</view>
					</view>
					<view class="xxqkbR2">
						<button @click="TurnPage1" class="cu-btn bg-blue lg" style="margin-top: 30%;">详情</button>
					</view>
				</view>
			</view>
			<u-line color="#c3c3c3"></u-line>
			<view class="xxqkb">
				<view class="xxqkbL">
					<view style="margin-left: 15rpx;margin-bottom: 15rpx;margin-top: 10rpx;">
						资料阅读完成情况：
					</view>
					<view style="font-size: 70rpx;text-align: center;">
						{{itemList[1][3].StuClassMeanss}} / {{itemList[1][1].classMeanss}}
					</view>
					<view style="text-align: center;">
						（阅读篇数/应阅读篇数）
					</view>
				</view>
				<u-line color="#c3c3c3" direction="col" margin="20rpx" length="140rpx" hair-line="false"></u-line>
				<view class="xxqkbR">
					<view class="xxqkbR1">
						<view class="xxqkbR1fs">
							{{itemList[2][0].meansGrade}}
						</view>
						<view style="text-align: center;">
							平均分
						</view>
					</view>
					<view class="xxqkbR2">
						<button @click="TurnPage2" class="cu-btn bg-blue lg" style="margin-top: 30%;">详情</button>
					</view>
				</view>
			</view>
			<u-line color="#c3c3c3"></u-line>
			<view class="xxqkb">
				<view class="xxqkbL">
					<view style="margin-left: 15rpx;margin-bottom: 20rpx;margin-top: 10rpx;">
						课堂表现：
					</view>
					<view style="margin-left: 15rpx;margin-bottom: 20rpx;">
						缺勤次数：{{itemList[3][0].cstu_absence}}次
					</view>
					<view style="margin-left: 15rpx;margin-bottom: 15rpx;">
						课堂扣分：{{itemList[3][0].cstu_bonus}}分
					</view>
				</view>
				<u-line color="#c3c3c3" direction="col" margin="20rpx" length="140rpx" hair-line="false"></u-line>
				<view class="xxqkbR">
					<view class="xxqkbR2 button3">
						<button @click="TurnPage3" class="cu-btn bg-blue lg" style="margin-top: 30%;">详情</button>
					</view>
				</view>
			</view>
			<u-line color="#c3c3c3"></u-line>
			<!-- <view class="cycz">
				<view style="margin: 0 auto;display: flex;margin-top: 10rpx;">
					<view style="margin-right: 80rpx;">
						<u-button size="medium">移动</u-button>
					</view>
					<view>
						<u-button type="error" size="medium">删除</u-button>
					</view>
				</view>
			</view> -->
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				// 综合成绩
					Total:0,
				//学生姓名
					name:"",
				//学生学号
					sno:"",
					classId:"",
					studentId:"",
					//班级成员所有信息列表
					itemList:[],
			}
		},
		onLoad:function(options){
			console.log("成员信息页面，传入的数据",options.classId,options.studentId)
			this.classId=options.classId
			this.studentId=options.studentId
		},
		onShow:function(){
			this.GetData()
		},
		methods: {
			TurnPage1() {
				console.log("点击跳转")
				uni.navigateTo({
					url:'../adminPhxq/adminPhxq?classId='+this.classId+"&studentId="+this.studentId
				})

			},
			TurnPage2() {
				console.log("点击跳转2")
				uni.navigateTo({
					url: '../adminZL/adminZL?classId='+this.classId+"&studentId="+this.studentId
				})
			},
			TurnPage3() {
				uni.navigateTo({
					url: '../adminCpxq/adminCpxq?classId='+this.classId+"&studentId="+this.studentId
				})
			},
			//老师查学生作业平均分，和资料阅读平均分
			GetData(){
				this.itemList=[]
				let a = {
					classId: this.classId,
					studentId:this.studentId,
				}
				//获取学生的作业平均分和资料平均分
				this.$Request.getRequest(this.$url.GATHER.stuStudyInformation, a).then(res => {
					console.log('服务器返回的班级成员所有信息列表', res.result);
					this.itemList=this.itemList.concat(res.result)
					if(this.itemList[0][0].ach_achievement!=null){
						this.Total=this.itemList[0][0].ach_achievement
					}
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
			}
		}
	}
</script>

<style>
	.u-line {}

	.jbxx {
		width: auto;
		height: 200rpx;
		background: #FFFFFF;
	}

	.jbxxleft {
		width: 50%;
		height: 200rpx;
	}

	.jbxxright {
		width: 50%;
		height: 200rpx;
	}

	.nichen {
		width: 200rpx;
		height: 100rpx;
		margin-top: 30rpx;
		margin-left: 16rpx;
		font-size: 35rpx;
		line-height: 100rpx;
		/* background-color: #007AFF; */
	}

	.xnxh {
		width: 330rpx;
		height: 120rpx;
		margin-left: 40rpx;
		margin-top: 40rpx;
		font-size: 35rpx;
		line-height: 60rpx;
		/* background-color: #ffaa7f; */
	}

	.jbxxright1 {
		width: 180rpx;
		height: 100rpx;
		line-height: 100rpx;
		margin: 0 auto;
		/* margin-top: 30rpx; */
		font-size: 100rpx;
		text-align: center;
		line-height: 180rpx;
		color: #ff0000;
		border-radius: 90rpx;
		background-color: #ffffff;
	}

	.jbxxright2 {
		width: 200rpx;
		height: 100rpx;
		line-height: 100rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		text-align: center;
		font-size: 30rpx;
		/* background-color: #55ffff; */
	}

	.xxqk {
		width: 750rpx;
		height: 600rpx;
		background: #FFFFFF;
	}

	.xxqkb {
		width: 750rpx;
		height: 33.33%;
		display: flex;
	}

	.xxqkbL {
		width: 45%;
		height: 100%;
	}

	.xxqkbR {
		width: 55%;
		height: 180rpx;
		display: flex;
	}

	.xxqkbR1 {
		width: 230rpx;
		height: 100%;
		margin-top: 20rpx;
	}

	.xxqkbR2 {
		width: 150rpx;
		height: 180rpx;
	}
	.button3{
		margin-left: 230rpx;
	}
	.xxqkbR1fs {
		width: 120rpx;
		height: 120rpx;
		margin: 0 auto;
		margin-top: 10rpx;
		text-align: center;
		line-height: 120rpx;
		font-size: 60rpx;
		color: #ffad7d;
		border-radius: 50%;
		border: 1rpx solid #c3c3c3;
	}

	.cycz {
		width: 750rpx;
		height: 80rpx;
		display: flex;

	}
</style>
