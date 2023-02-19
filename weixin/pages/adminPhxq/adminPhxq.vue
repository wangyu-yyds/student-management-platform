<template>
	<view class="home">
		<!-- 个人作业/测试详情 -->
		<view class="flex solids padding justify-between align-center bg-white">
			<view class="flex align-center">
				<view class="cu-avatar margin-xs xl round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg);margin-top: 20rpx;"></view>
				<view class="nichen margin-xs  text-bold">李四</view>
			</view>
			
		</view>
		<view>
			<view class="bg-white solids text-lg bg11">
				
				<u-table>
					<u-tr class="u-tr ">
						<u-th class="u-th">作业/测试名称</u-th>
						<u-th class="u-th">成绩</u-th>
						<u-th class="u-th">提交时间</u-th>
					</u-tr>
					<u-tr font-size="28" class="u-tr"v-for="(item, index) in itemList" :key="index">
						<u-td class="u-td setHeight">{{item.tas_name}}</u-td>
						<u-td class="u-td setHeight">{{item.tstu_condition}}</u-td>
						<u-td class="u-td setHeight">{{item.tstu_time}}</u-td>
					</u-tr>
				</u-table>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemList:[],
				//班级编号
				classId:"",
				//学生Id
				studentId:"",
			}
		},
		onLoad:function(options){
			this.classId=options.classId
			this.studentId=options.studentId
		},
		onShow:function(){
			this.GetData()
		},
		methods: {
			//获取数据
			GetData(){
				this.itemList=[]
				let a = {
					classId: this.classId,
					studentId:this.studentId,
				}
				console.log("班级编号参数正在传递" ,a)
				//获取学生的作业平均分和资料平均分
				this.$Request.getRequest(this.$url.GATHER.classStuTaskGrade, a).then(res => {
					console.log('服务器返回的学生作业成绩列表', res.result);
					this.itemList=this.itemList.concat(res.result)
					this.Judge()
					console.log("接收到的学生作业成绩列表", this.itemList)
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
			},
			Judge(){
				for(let i=0;i<this.itemList.length;i++)
				{
					if(Number(this.itemList[i].tstu_condition)<=0){
						this.itemList[i].tstu_condition="未提交"
					}
				}
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
	.setHeight{
		height: 70rpx;
	}
</style>
