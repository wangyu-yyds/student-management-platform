<template>
	<view>
		<u-collapse :accordion="false">
			<u-collapse-item align="center" title="班级成员作业完成情况" :title-style="{'font-size':'40rpx','font-weight':'blod'}">
				<u-table class="bg11">
					<u-tr class="u-tr">
						<u-th class="u-th setHeight2">姓名</u-th>
						<u-th class="u-th setHeight2">学号</u-th>
						<u-th class="u-th setHeight2">作业分数</u-th>
					</u-tr>
					<u-tr class="u-tr" v-for="(item,index) in textList" :key="index">
						<u-td class="u-td setHeight">{{textList[index].stu_name}}</u-td>
						<u-td class="u-td setHeight">{{textList[index].stu_no}}</u-td>
						<u-td class="u-td setHeight">{{textList[index].tstu_condition}}</u-td>
					</u-tr>
				</u-table>
			</u-collapse-item>
			<u-collapse-item align="center" title="作业错题情况" :title-style="{'font-size':'40rpx','margin-left':'30rpx'}">
				<u-table class="bg11">
					<u-tr class="u-tr">
						<u-th class="u-th setHeight2">题目编号</u-th>
						<u-th class="u-th setHeight2">未完成人数</u-th>
						<u-th class="u-th setHeight2">做错人数</u-th>
						<u-th class="u-th setHeight2">正确率</u-th>
					</u-tr>
					<u-tr class="u-tr" v-for="(item,index) in textTotalCondition" :key="index">
						<u-td class="u-td setHeight">{{textTotalCondition[index].nameType}}</u-td>
						<u-td class="u-td setHeight">{{textTotalCondition[index].uncomplete}}</u-td>
						<u-td class="u-td setHeight">{{textTotalCondition[index].workerr}}</u-td>
						<u-td class="u-td setHeight">{{textTotalCondition[index].accuracy}}</u-td>
					</u-tr>
				</u-table>
			</u-collapse-item>
		</u-collapse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemStyle: {
					marginTop: '5rpx',
					background: '#ffffff',
					paddingLeft: '10rpx'
				},
				modalName: null,
				// 班级Id
				classId: 0,
				// 作业Id
				textId: 0,
				// 作业列表
				textList: [],
				// 作业总体情况
				textTotalCondition: [],
			}
		},
		onLoad: function(options) {
			// 该班级的编号
			console.log("这是作业详情页")
			this.classId = options.classId
			this.textId = options.textId
			console.log(this.classId, this.textId)
			// 向服务器请求该课程列表数据
			this.GetData()
		},
		methods: {
			// 获取数据
			GetData() {
				this.textList = []
				this.textTotalCondition = []
				let a = {
					taskId: this.textId,
					classId: this.classId
				}
				this.$Request.getRequest(this.$url.GATHER.classTaskCondition, a).then(res => {
					this.textList = this.textList.concat(res.result)
					console.log("接收到作业列表", this.textList)
					this.ChangNull();
				}).catch(err => {
					console.log('出错了，错误是', err);
					uni.showToast({
						// 弹出框的标题
						title: '获取班级成员作业数据失败!',
						// 弹出框的图标，不想设置图标时请给none
						icon: 'none',
						duration: 1000,
					})
				})
				this.$Request.getRequest(this.$url.GATHER.CheckCorrectRate, a).then(res => {
					console.log('服务器返回的班级错误率列表', res);
					this.textTotalCondition = this.textTotalCondition.concat(res.result)
					this.ChangData()
					console.log("接收到的班级作业错误率", this.textTotalCondition)
				}).catch(err => {
					console.log('出错了，错误是', err);
					uni.showToast({
						// 弹出框的标题
						title: '获取数据失败!',
						// 弹出框的图标，不想设置图标时请给none
						icon: 'none',
						duration: 1000,
					})
				})
			},
			// 判断题目类型，添加元素nameType
			ChangData() {
				for (let i = 0; i < this.textTotalCondition.length; i++) {
					if (this.textTotalCondition[i].questionType == 0) {
						this.textTotalCondition[i].nameType == "单选题" + this.textTotalCondition[i].questionIndex
					} else if (this.textTotalCondition[i].questionType == 1) {
						this.textTotalCondition[i].nameType == "多选题" + this.textTotalCondition[i].questionIndex
					} else if (this.textTotalCondition[i].questionType == 2) {
						this.textTotalCondition[i].nameType == "填空题" + this.textTotalCondition[i].questionIndex
					} else if (this.textTotalCondition[i].questionType == 3) {
						this.textTotalCondition[i].nameType == "判断题" + this.textTotalCondition[i].questionIndex
					}
				}
			},
			// 将数组中为null的部分变为未提交
			ChangNull() {
				for (let i = 0; i < this.textList.length; i++) {
					if (this.textList[i].tstu_condition == null) {
						this.textList[i].tstu_condition = "未提交"
					}
				}
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			
		}
	}
</script>

<style>
	.setHeight {
		height: 150rpx;
	}

	.bg11 {
		width: 750rpx;
		height: auto;
	}
	.setHeight2{
		height: 55rpx;
	}
</style>
