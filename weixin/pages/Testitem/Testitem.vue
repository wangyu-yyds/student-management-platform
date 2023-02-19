<!-- 创建文件：Testitem.vue 创建时间： 2022.1.17_20:46 创建人：张煜林 -->

<template>
	<view class="home">
		<exam-widght :dataList='test' :index="index" :numBoxType='0' :showIndexText='showIndexText'
			:numBoxShow='numBoxShow' @select="SelectItem" @selectFinish='SelectFinish' @finish='Finish'
			@confirm="Submitted">
		</exam-widght>

	</view>
</template>

<script>
	import examWidght from '@/components/Li-ExamWidght/Li-ExamWidght.vue';

	export default {
		components: {
			examWidght
		},
		data() {
			return {
				test: [], //试卷
				index: 0,
				showIndexText: true,
				numBoxShow: true,
				fldTestPaperID: undefined,
				fldTestRecordID: undefined,
				taskid: '', //试卷的id
				time: '', //当前时间
				classid: -1,		//当前的班级id
			}
		},

		onLoad: function(option) {
			let data = JSON.parse(option.index);
			console.log('打印页面传递', data);
			let params = {
				taskid: data.taskNum
			};
			this.taskid = data.taskNum;
			this.classid = data.classid;
			uni.setNavigationBarTitle({
				title: data.title
			})
			this.$Request.getRequest(this.$url.GATHER.gettask, params).then(res => {
				console.log('返回试卷内容', res);
				// let testtmp = [];
				// for(let i = 0; i < res.data.length; i++) {
				// 	let tmp = Number(res.data[i].questionType);
				// 	res.data[i].questionType = tmp;
				// 	console.log('转换后的题目类型->', res.data[i].questionType);
				// 	testtmp.push(res.data[i]);
				// }
				// this.test = testtmp;
				// console.log('转换后的test', this.test);
				this.test = res.data;
			}).catch(err => {
				console.log('试卷加载错误', err);
			});
		},

		methods: {
			SelectItem() { //选择选项触发

			},
			SelectFinish() { //切换题目触发

			},
			Finish(item) { //提交触发

			},

			Submitted(item) { //提取提交的数据
				let date = new Date(),
					year = date.getFullYear(), //年
					month = date.getMonth() + 1, //月
					day = date.getDate(), //日
					hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(), //时
					minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(), //分
					second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //秒
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				let now = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
				this.time = now;
				console.log('打印试卷内容', item)
				console.log("获取提交的数据↓↓↓")
				let data = {
					tel: this.$global.vxUser.tel, //电话
					fldGuid: this.taskid, //测试试卷id（编号）
					submitTime: this.time, //提交时间
					QuestionList: [], //具体的题目内容
					classid: this.classid,	//班级id
				};
				data.QuestionList = item.questions;
				console.log('打印时间', this.time);
				console.log("这是结果", data);
				let tmp = JSON.stringify(data);
				console.log("转换后->", tmp);
				this.$Request.postRequest(this.$url.GATHER.submittest, data).then(res => {
					console.log('提交成功', res);
				}).catch(err => {
					console.log('提交错误', err);
				});

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
	}
</style>
