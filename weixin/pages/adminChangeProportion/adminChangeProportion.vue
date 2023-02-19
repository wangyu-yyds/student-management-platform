<template>
	<view class="home">
		<!-- 综合管理界面修改成绩计算比例 -->

		<view class=" padding-xs">
			<u-form ref="uForm">
				<u-form-item label="缺勤一次扣分 :" :label-style="{'font-size':'35rpx'}" :label-width="auto">
					<u-input v-model="absenceScore" placeholder="请填写扣分分数" />
				</u-form-item>
				<u-form-item label="课堂表现单次加分 :" :label-style="{'font-size':'35rpx'}" :label-width="auto">
					<u-input v-model="ClassPerformanceScore" placeholder="请填写加分分数" />
				</u-form-item>
				<text class="text-bold">
					综合评分比例:
				</text>
				<u-form-item label="作业占比 :" :label-style="{'font-size':'35rpx'}" :label-width="auto">
					<u-input @blur="AutoChang(1)" v-model="textScoreProportion" placeholder="请填写作业占比比例" />
				</u-form-item>
				<u-form-item label="阅读占比 :" :label-style="{'font-size':'35rpx'}" :label-width="auto">
					<u-input @blur="AutoChang()" v-model="readScoreProportion" placeholder="请填写阅读占比比例" />
				</u-form-item>
			</u-form>
		</view>
		<view class="text-red margin-left" v-if="tipSeen">所输入的占比不合规范！</view>
		<view class="flex solid-bottom padding justify-around">
			<view>
				<button class="cu-btn line-green text-green" @tap="HideModal">取消</button>
			</view>
			<view>
				<button class="cu-btn bg-green margin-left" @tap="ChangeProportion">确定</button>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 提示语显示
				tipSeen: false,
				//缺勤一次扣分
				absenceScore: 0,
				ClassPerformanceScore: 0,
				textScoreProportion: 0,
				readScoreProportion: 0,
				//成绩比例
				classId: 0,
				//返回的成绩比例列表
				ScoringRulesList: [],
				//成绩比例数据
				rules: [],
			}
		},
		onLoad: function(options) {
			// 该班级的编号
			console.log("这是修改成绩比例详情页", options.classId)
			this.classId = options.classId
			console.log("传入的班级编号" + this.classId)
			// 向服务器请求该班级学生列表数据
			let a = {
				classId: this.classId
			}
			console.log("班级编号参数正在传递", a)
			//获取老师评分规则
			this.$Request.getRequest(this.$url.GATHER.classScoringRules, a).then(res => {
				console.log('服务器返回的学生成绩比例列表', res);
				this.ScoringRulesList = this.ScoringRulesList.concat(res.result)
				// this.ChangNull();
				this.rules = this.ScoringRulesList[0].cla_proportion.split(",")
				this.absenceScore = this.ScoringRulesList[0].cla_absence
				this.ClassPerformanceScore = this.ScoringRulesList[0].cla_bonus
				this.textScoreProportion = this.rules[0]
				this.readScoreProportion = this.rules[1]
			}).catch(err => {
				console.log('222', err);
			})

		},
		methods: {
			AutoChang(num) {
				if (num == 1) {
					this.readScoreProportion = 100 - this.textScoreProportion
				} else {

				}

			},
			ChangeProportion() {
				var num = 0
				num = Number(this.textScoreProportion) + Number(this.readScoreProportion)
				if ((num) != 100) {
					// this.seen=true
					this.tipSeen = true
				} else {
					let b = this.textScoreProportion + "," + this.readScoreProportion
					// 将修改后的数据上传至服务端
					let a = {
						classId: this.classId,
						proportion: b,
						absence: this.absenceScore,
						bonus: this.ClassPerformanceScore
					}
					console.log("班级编号参数正在传递", a)
					this.$Request.getRequest(this.$url.GATHER.reviseClassMessage, a).then(res => {
						console.log('服务器返回的学生成绩列表', res);
						uni.navigateBack({
							delta: 1,
							success: function() {
								beforePage.$vm.init(); // 执行前一个页面的刷新
							}
						});
					}).catch(err => {
						console.log('222', err);
					})
					console.log("比例修改成功！")
				}
			},
			HideModal() {
				this.absenceScore = ""
				this.textScoreProportion = ""
				this.readScoreProportion = ""
				this.classScoreProportion = ""
				this.ClassPerformanceScore = ""
			}
		}
	}
</script>

<style>
	.home {
		width: 750rpx;
	}
</style>
