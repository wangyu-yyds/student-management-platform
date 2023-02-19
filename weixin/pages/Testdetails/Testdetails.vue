<template>
	<view class="home">
		<view class="exam-item-testing">
			<view class="exam-item-inner" v-if='dataList.length > 0'>
				<!-- 当前item的问题内容 -->
				<view class="line_under exam-item-title">
					{{currentIndex+1}}.{{currentItem.fldName?currentItem.fldName:''}}
				</view>

				<!--  单选 -->
				<view v-show="CheckShow('0')">
					<view class="exam-item-option" v-for="(item,rowIndex_1) in currentItem.QuestionOptionList"
						v-bind:key='rowIndex_1'>
						<view :style="{'background-color': item.fldOptionIndex == currentCheck? '#6bbe79': ''}">
							<!-- <radio :checked="item.fldOptionIndex == currentCheck" disabled="true"/> -->
							<text>{{CheckNum(item.fldOptionIndex)}}</text>.<text>{{item.fldOptionText}}</text>
						</view>
					</view>
				</view>

				<!-- 多选 -->
				<checkbox-group @change="CheckboxChange" v-show="CheckShow('1')">
					<view v-for="(item,rowIndex_2) in currentItem.QuestionOptionList" v-bind:key='rowIndex_2'>
						<view class="exam-item-option">
							<view :style="{'background-color': CheckboxCheck(item.fldOptionIndex)? '#6bbe79': ''}">
								<!-- <checkbox :value="SetCheckboxVal(item.fldOptionIndex)"
									:checked="CheckboxCheck(item.fldOptionIndex)" disabled="true"/> -->
								<text>{{CheckNum(item.fldOptionIndex)}}</text>.<text>{{item.fldOptionText}}</text>
							</view>
						</view>
					</view>
				</checkbox-group>

				<!--  填空题 -->
				<view v-show="currentItem.questionType == '2'">
					<view class="exam-item-option">
						<!-- <textarea @blur="bindTextAreaBlur" @input='bindTextinput' placeholder='请输入您的答案'
							:value='currentText' /> -->
					</view>
				</view>

				<view class="exam-button-row">
					<view>
						<!-- 三个按钮 -->
						<!-- 上一题 -->
						<u-button v-show="currentIndex != 0" size='mini' @click="LastQuestion"
							style="margin-right: 20rpx; border-right: 1rpx;">上一题</u-button>
						<!-- 下一题 -->
						<u-button v-show="currentIndex < dataList.length-1 " size='mini' @click="NextQuestion">
							下一题
						</u-button>
						<!-- 返回 -->
						<u-button size='mini' @click="Back" style="margin-right: 20rpx; margin-left: 20rpx;">
							返回
						</u-button>

						<!-- 题号预览 -->
						<text v-show="showIndexText" @tap="SwitchIndexBox" style="float: right;color: gray;">
							<text v-if='numBoxType == 0'>{{showIndexBox?'▽':'△'}}</text>
							{{indexText}}
						</text>

					</view>
				</view>

				<!-- 题目列表预览 -->
				<view v-show="showIndexBox && numBoxType == 0" class="exam-indexbox">
					<view class="exam-indexbox-item"
						v-bind:style="{'background': quesIndex == currentIndex ? '#f0f0f0':''}"
						v-bind:class="{ 'exam-indexbox-item-selected': CheckItem(item)}"
						v-for="(item,quesIndex) in dataList" v-bind:key='item.questionID'
						@click="CurrentSelectFinish(quesIndex)">
						{{quesIndex + 1}}
					</view>
				</view>

				<!-- 正确答案\学生答案预览 -->
				<view clss="answer">
					<view class="standard" v-show="currentItem.questionType == '2' || 
						( !Checkisright() && currentItem.questionType != '0' && currentItem.questionType != '1')">
						<text style="font-size: 30rpx;">正确答案</text>:<text
							style="font-size: 35rpx;">{{Standardanswer()}}</text>
					</view>
					<view class="user"><text
							:style="{'font-size': '30rpx', 'margin-top': (currentItem.questionType == '2') ? '50rpx': ''}">你的答案</text>
						:<text
							:style="{'font-size': '35rpx', 'color': Checkisright()? 'green': 'red'}">{{Useranswer()}}</text>
					</view>
				</view>

				<!-- 解析 -->
				<view class="analysis">
					<view class="head">解析：</view>
					<view class="contentbox" v-show="istext">
						<view class="context">{{textanalys}}</view>
					</view>
					<view class="imagebox" v-show="isimage">
						<image
							src="https://tse1-mm.cn.bing.net/th/id/R-C.15a1ba773a211acdeae39f83c2c13241?rik=h1wkOstFSHzvTg&riu=http%3a%2f%2fwww.desktx.com%2fd%2ffile%2fwallpaper%2fscenery%2f20170120%2ffdf948c82074494a74bf258eed4f855d.jpg&ehk=fYrgVtm0hD0sZn455mcVyf5k%2bQz7RScjHLMyUi6jG0A%3d&risl=&pid=ImgRaw&r=0">
						</image>
					</view>
					<view class="videobox" v-show="isvideo">
						<video class="video" style="width: 750rpx;"
							src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"></video>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				index: null, //题号标记
				dataList: [
					// {
					//     questionID: "1fc84bb8-de3c-451b-95c4-8cba9380dac7",
					//     fldName: "用灭火器进行灭火的最佳位置是（   ）",
					//     fldAnswer: 1,	//标准答案
					// 	userAnswer: 2,	//用户答案
					//     questionType: 0,
					//     QuestionOptionList: [
					//         {
					//             optionID: "3a5e4ac5-ee67-45ed-b982-18061718c4a0",
					//             fldOptionText: "下风位置",
					//             fldOptionIndex: 1
					//         },
					//         {
					//             optionID: "316b8d44-3ea6-456c-8b79-98ef39238db6",
					//             fldOptionText: "上风或侧风位置  ",
					//             fldOptionIndex: 2
					//         },
					//         {
					//             optionID: "933e13dc-233e-4959-af0a-9a0b482c4790",
					//             fldOptionText: "离起火点10米以上的位置",
					//             fldOptionIndex: 3
					//         },
					//         {
					//             optionID: "5a6d3be9-d26f-4e3b-a63d-3723acd42642",
					//             fldOptionText: "下风位置11",
					//             fldOptionIndex: 4
					//         }
					//     ]
					// },
					// {
					//     "questionID": "8c4748db-eac7-410f-8055-da8f3de5404e",
					//     "fldName": "常见灭火器种类有哪些？（任写3种即可）。",
					//     "fldAnswer": '1,4',
					// 	"userAnswer": '1,2,4',
					//     "questionType": 1,
					//     "QuestionOptionList": [
					//         {
					//             "optionID": "c274a47d-6548-411d-a345-9d301e13c1cf",
					//             "fldOptionText": "干粉灭火器",
					//             "fldOptionIndex": 1
					//         },
					//         {
					//             "optionID": "ea7b1a98-8f8c-4b08-97f8-afee614428cb",
					//             "fldOptionText": "泡沫灭火器  ",
					//             "fldOptionIndex": 2
					//         },
					//         {
					//             "optionID": "19e960e1-18d3-4be4-b060-4e9671952db0",
					//             "fldOptionText": "二氧化碳灭火器",
					//             "fldOptionIndex": 3
					//         },
					//         {
					//             "optionID": "37bdff32-e68c-4665-a40b-c1cec6648f19",
					//             "fldOptionText": "二氧化碳灭火器1",
					//             "fldOptionIndex": 4
					//         }
					//     ]
					// },
					// {
					//     "questionID": "2d3bd4ce-c56c-48c7-8519-ebac17e7c98a",
					//     "fldName": "下列人员应当持证上岗（）",
					//     "fldAnswer": 4,
					// 	"userAnswer": 4,
					//     "questionType": 0,
					//     "QuestionOptionList": [
					//         {
					//             "optionID": "7c8f2943-a137-4fcb-bb27-509eabdbb649",
					//             "fldOptionText": "单位的消防安全责任人、消防安全管理人",
					//             "fldOptionIndex": 1
					//         },
					//         {
					//             "optionID": "a61b9743-2008-4d43-99a8-869d7be99c08",
					//             "fldOptionText": "专、兼职消防管理人员 ",
					//             "fldOptionIndex": 2
					//         },
					//         {
					//             "optionID": "c46af8ff-92e7-4fad-a113-25cd0d189a00",
					//             "fldOptionText": "消防控制室的值班、操作人员；",
					//             "fldOptionIndex": 3
					//         },
					//         {
					//             "optionID": "16394858-30ba-4b84-bf5a-5a798a93d948",
					//             "fldOptionText": "其他依照规定应当接受消防安全专门培训的人员。 ",
					//             "fldOptionIndex": 4
					//         }
					//     ]
					// },
					// {
					//     "questionID": "7c5fded1-6f77-4fc9-85cf-99d4ec7ababd",
					//     "fldName": "火警电话是____?急救电话是____？",
					//     "fldAnswer": '119，110',
					// 	"userAnswer": '119，12315',
					//     "questionType": 2,
					//     "QuestionOptionList": null
					// },
					// {
					//     "questionID": "7c5fded1-6f77-4fc9-85cf-99d4ec7ababd",
					//     "fldName": "黑龙江的省会是____?湖南省会是____？",
					//     "fldAnswer": '哈尔滨，长沙',
					// 	"userAnswer": '哈尔滨，长沙',
					//     "questionType": 2,
					//     "QuestionOptionList": null
					// }

				], //答题列表
				indexText: '题目列表',
				showIndexText: true, //题号文字是否显示
				numBoxType: 0, //题号显示方式
				numBoxShow: false, //题号框是否显示
				windowHeight: 500,
				showIndexBox: false,
				currentHasChange: false,
				currentIndex: 0, //当前题号
				currentItem: {}, //当前项
				currentCheck: -1, //单选选定
				currentCheckBoxCheck: [], //多选选定
				currentText: "", //填空题
				showMask: false, //是否显示遮罩和题号
				indexboxAnimationData: [], //题号区域动画
				show: false,
				content: '确认提交吗?',
				istext: true,
				isimage: false,
				isvideo: false,
				textanalys: '',
				params: {
					tel: this.$global.openid,
					taskid: '',
				},

			}
		},

		onLoad: function(option) {
			let data = JSON.parse(option.index);
			console.log('页面传递参数', data);
			this.params.taskid = data.taskNum;
			this.$Request.getRequest(this.$url.GATHER.gettaskdetails, this.params).then(res => {
				console.log('服务器返回错题详情', res);
				if (res.code == -1) {
					uni.showToast({
						title: '请刷新',
						icon: 'none',
						duration: 500
					})
				}
				if (res.code == 0) {
					this.dataList = res.QuestionList;
				}
			}).catch(err => {
				console.log('错误', err);
			})
			this.Init();
		},

		watch: {
			dataList: function(val, oldval) {
				this.Init();
			}
		},

		methods: {
			Standardanswer() { //标准答案
				let item = this.currentItem;
				if (item.questionType == '0' || item.questionType == '1') {
					return null;
				} else if (item.questionType == '2') {
					return item.fldAnswer;
				}

			},

			Useranswer() { //用户答案
				let item = this.currentItem;
				let answer = '';
				if(item.userAnswer == 'null') {
					return '未作答';
				}
				if (item.questionType == '1') {
					if (item.userAnswer != 'null') {
						for (let i = 0; i < item.userAnswer.length; i++) {
							if (item.userAnswer[i] != ',' && item.userAnswer[i] != '"')
								answer = answer.concat(String.fromCharCode(0x60 + Number(item.userAnswer[i]))
								.toUpperCase());
						}
						return answer;
					}
				}
				if (item.questionType == '2' && item.userAnswer != 'null') {
					console.log('填空', item.userAnswer)
					item.userAnswer = item.userAnswer.replace(/^\"|\"$/g,'');
					return item.userAnswer;
				} 
				
				if (item.questionType == '0' && item.userAnswer == 'null') {
					return ' ';
				} else{
					return String.fromCharCode(0x60 + Number(item.userAnswer)).toUpperCase()
				}
				
			},

			Checkisright() { //检查答案用户是否正确
				console.log('打印当前项->', this.currentItem);
				let item = this.currentItem;
				if (item.fldAnswer == item.userAnswer) {
					console.log('这题对了');
					return true;
				} else {
					console.log('这题错了');
					return false;
				}
			},

			Init() { //初始化
				this.currentItem = this.GetCurrentItem();
				this.CheckQuestionSelected();
			},

			GetCurrentItem() { //获取当前问题
				let item = {};
				if (this.dataList.length == 0) {
					item = {};
				}
				if (this.dataList[this.currentIndex]) {
					item = this.dataList[this.currentIndex];
				}
				return item;
			},
			
			Isexist() {				//当前是否存在解析
				let item = this.currentItem;
				if(item.textAnalyse == null) {
					this.textanalys = '暂无解析';
				} else {
					this.textanalys = item.textAnalyse;
				}
				if(item.videoAnalys != null) {
					this.isimage = true;
					this.isvideo = true;
				} else {
					this.isimage = false;
					this.isvideo = false;
				}
			},
			
			CheckQuestionSelected() { //初始化选择
				if (this.currentItem.questionType == 0) { //单选选定
					this.currentCheck = this.currentItem.fldAnswer;
				} else if (this.currentItem.questionType == 1) { //多选选定
					try {
						if (this.currentItem.fldAnswer && typeof this.currentItem.fldAnswer === 'number')
							this.currentCheckBoxCheck = [this.currentItem.fldAnswer];
						else
							this.currentCheckBoxCheck = this.currentItem.fldAnswer ? this.currentItem.fldAnswer.split(
								',') : [];
					} catch (e) {
						this.currentCheckBoxCheck = [];
					}
				} else if (this.currentItem.questionType == 2) { //填空
					this.currentText = this.currentItem.fldAnswer ? this.currentItem.fldAnswer : "";
				}
				this.Checkisright();
				this.Isexist();
				// this.Standardanswer();
				// this.Useranswer();
			},

			CheckShow(type) { //检查题目类型
				if (this.dataList.length == 0) {
					return false;
				}
				if (this.currentItem.questionType == type && this.currentItem.QuestionOptionList != undefined)
					return true;
				else
					return false;
			},

			RadioChange(item) { //改变选项
				this.currentHasChange = true;
				this.currentCheck = item.fldOptionIndex;
				this.dataList[this.currentIndex].fldAnswer = item.fldOptionIndex;
			},

			CheckNum(num) { //把数字转换为字母
				if (typeof(num) == 'number')
					return String.fromCharCode(0x60 + num).toUpperCase();
				else
					return num;
			},

			CheckItem(item) { //
				if (!item.fldAnswer)
					return false;
				let res = (item.questionType != 1 && item.fldAnswer) || (item.questionType == 1 && item.fldAnswer.length !=
					0)
				if (res)
					return true;
				else
					return false;
			},

			CheckboxCheck(num) { //检查多选框是否已选定
				let that = this;
				for (let i = 0; i < that.currentCheckBoxCheck.length; i++)
					if (that.currentCheckBoxCheck[i] == num)
						return true;
				return false;
			},

			SetCheckboxVal(val) { //设置多选框的值，如果是数字，转换为字符串
				if (typeof(val) == 'number')
					return val + "";
				return val;
			},

			CurrentSelectFinish(newIndex) { //切换题目
				let that = this;
				let __oldIndex = that.currentIndex;
				let __newIndex = newIndex;
				if (!that.dataList[__oldIndex])
					return;

				that.currentIndex = newIndex;
				that.currentItem = that.GetCurrentItem();
				that.currentHasChange = false;

				that.CheckQuestionSelected();
			},

			LastQuestion() { //上一题
				let newIndex = this.currentIndex - 1;
				this.CurrentSelectFinish(newIndex);
			},

			NextQuestion() { //下一题
				let newIndex = this.currentIndex + 1;
				this.CurrentSelectFinish(newIndex);
			},

			Back() { //返回
				uni.navigateBack({
					url: '../Classitem/Classitem'
				})
			},

			SwitchIndexBox() { //题号切换
				if (this.numBoxType == 0)
					this.showIndexBox = !this.showIndexBox;
				else if (this.numBoxType == 1) {
					this.ShowMaskFun();
				}
			}

		}
	}
</script>

<style>
	.home {
		width: 750rpx;
	}

	page {
		background-color: #ffffff;
		font-size: 28rpx;
	}

	.exam-item-testing {
		margin: 20rpx 10rpx 20rpx 10rpx;
		border-radius: 10rpx;
		background-color: #fff;
	}

	.exam-item-inner {
		/* padding: 0 20rpx; */
	}

	.exam-item-title {
		font-size: 35rpx;
		padding: 10rpx 0;
	}

	.right {
		background-color: #4bbe4b;
	}

	.exam-item-option {
		font-size: 30rpx;
		padding: 10rpx 0;
	}

	.exam-item-option textarea {
		border: 1px solid gainsboro;
		border-radius: 10rpx;
		height: 200rpx;
		width: 100%;
	}

	.exam-button-row {
		text-align: center;
	}

	.exam-indexbox {
		padding-bottom: 20rpx;
	}

	.exam-indexbox:before,
	.exam-indexbox:after {
		display: table;
		content: ' ';
	}

	.exam-indexbox:after {
		clear: both;
	}

	.exam-indexbox-item {
		text-align: center;
		vertical-align: middle;
		line-height: 56rpx;
		float: left;
		border: 1rpx solid gainsboro;
		height: 56rpx;
		width: 56rpx;
		margin: 5rpx;
		padding: 10rpx;
		border-radius: 10rpx;
		background-color: #fff;
		-moz-box-shadow: 0px 1px 1px #ABABAB;
		-webkit-box-shadow: 0px 1px 1px #ABABAB;
		box-shadow: 0px 1px 1px #ABABAB;
	}

	.exam-indexbox-item-selected {
		color: #007AFF;
	}

	/* 以下为实现0.5px底部边界 */
	.line_under {
		position: relative;
		/* .line_under:before{顶部top: 0;background: #000;} */
	}

	.line_under:before,
	.line_under:after {
		position: absolute;
		content: " ";
		height: 1px;
		width: 100%;
		left: 0;
		transform-origin: 0 0;
		-webkit-transform-origin: 0 0;
	}

	.line_under:after {
		bottom: 0;
		border-bottom: 1px solid gainsboro;
	}

	@media only screen and (-webkit-min-device-pixel-ratio: 1.5) {

		.line_under:after,
		.line_under:before {
			-webkit-transform: scaleY(0.667);
		}
	}

	@media only screen and (-webkit-min-device-pixel-ratio: 2) {

		.line_under:after,
		.line_under:before {
			-webkit-transform: scaleY(0.5);
		}
	}

	.exam-mask {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		background-color: #999999;
		opacity: 0.5;
		left: 0;
		top: 0;
	}

	.exam-mask-content {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 50%;
		background-color: white;
		left: 0;
		bottom: 0;
		padding: 15rpx 5rpx;
	}

	.exam-indexbox-item-mask {
		text-align: center;
		vertical-align: middle;
		line-height: 63rpx;
		float: left;
		border: 1rpx solid gainsboro;
		height: 63rpx;
		width: 63rpx;
		margin: 5rpx;
		padding: 10rpx;
		border-radius: 10rpx;
		background-color: #fff;
		-moz-box-shadow: 0px 1px 1px #ABABAB;
		-webkit-box-shadow: 0px 1px 1px #ABABAB;
		box-shadow: 0px 1px 1px #ABABAB;
	}

	.answer {
		display: flex;
		flex-direction: row;
		margin-top: 20rpx;
	}

	.standard,
	.user {
		margin-left: 10rpx;
		margin-top: 10rpx;
	}

	.standard {}

	.user {}

	.head {
		font-size: 40rpx;
		margin-top: 25rpx;
	}

	.context {
		text-indent: 2em;
		font-size: 35rpx;
	}

	.imagebox,
	.videobox {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
	}
</style>
