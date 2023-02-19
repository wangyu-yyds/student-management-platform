<template>
	<view class="home">
		<!-- 综合成绩管理界面 -->
		<view class="flex bg-white padding justify-end">
			<button class="cu-btn bg-green lg shadow" @tap="ShowModal" data-target="DialogModal1">修改比例</button>
		</view>
		<view class="bg-white solids text-lg bg11">
			<text>学生答题情况如下:</text>
			<u-table>
				<u-tr class="u-tr ">
					<u-th class="u-th">姓名</u-th>
					<u-th class="u-th">作业及测试</u-th>
					<u-th class="u-th">阅读得分</u-th>
					<u-th class="u-th">综合得分</u-th>
				</u-tr>
				<u-tr font-size="28" class="u-tr" v-for="(item, index) in itemList" :key="index">
					<u-td class="u-td setHeight">{{itemList[index].name}}</u-td>
					<u-td class="u-td setHeight">{{itemList[index].taskGrade}}</u-td>
					<u-td class="u-td setHeight">{{itemList[index].meansGrade}}</u-td>
					<u-td class="u-td setHeight">{{itemList[index].achievement}}</u-td>
				</u-tr>
			</u-table>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				// 提示语是否显示
				seen: false,
				//储存查到的学生成绩数据
				itemList: [],

				classId: 0, //传入的班级编号

			}
		},
		onLoad: function(options) {
			// 该班级的编号
			this.classId = options.classId
			console.log("传入的班级编号" + this.classId)
			// 向服务器请求该班级学生列表数据
			// this.GetData()
		},
		onShow: function() {
			console.log("admincpm页面")
			this.GetData()
		},
		methods: {
			GetData() {
				this.itemList = []
				let a = {
					classId: this.classId
				}
				this.$Request.getRequest(this.$url.GATHER.checkStuAchievement, a).then(res => {
					console.log('服务器返回的学生综合成绩列表', res)
					this.itemList=res.result
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
				
			},
			
			// 跳转至修改分数计算比例页面
			ShowModal() {
				uni.navigateTo({
					url: '../adminChangeProportion/adminChangeProportion?classId=' + this.classId
				})
			},
			HideModal(e) {
				this.modalName = null
			},
		}
	}
</script>

<style>
	.home {
		width: 750rpx;
	}

	.bg11 {
		width: 750rpx;
		height: auto;
	}

	.bg12 {
		height: 20rpx;
	}

	.bg13 {
		height: 700rpx;
	}

	.setHeight {
		height: 100rpx;
	}
</style>
