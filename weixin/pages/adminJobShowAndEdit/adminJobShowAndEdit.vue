<template>
	<view>
		<!-- 这是作业显示部分 -->
		<view v-if="showProblemView">
			<view class="bg-white margin-bottom text-center">
				<button @tap="ShowModal" data-target="RadioModal"
					class="cu-btn bg-green margin-bottom shadow lg">保存作业修改</button>
			</view>
			<!-- 单选题显示 -->
			<view v-for="(item,index1) in choice" :key="index1">
				<view class="cu-form-group text-lg text-bold">单选题:{{index1+1}}</view>
				<view class="cu-form-group text-bold">
					<text class="settext">题目：</text>
					{{item[0].problem}}
				</view>
				<!-- 选项部分 -->
				<view :style="{'background-color': (index2+1) ==item[0].rightChoice[0] ? '#1cbe29': ''}"
					class="flex cu-form-group" v-for="(a,index2) in choice[index1].length-1" :key="index2">
					<text class="margin-left  text-bold title">选项{{index2+1}}.</text>
					<text>{{item[a+1].choice}}</text>
				</view>
				<!-- 正确选项 -->
				<!-- <view class="cu-form-group bg-white text-bold">
				正确选项:{{item[0].rightChoice[0]}}
			</view> -->
				<text class="cu-form-group bg-white text-bold text-sm">题目解析：</text>
				<view class="cu-form-group bg-white text-bold">
					<!-- 题目解析 -->
					{{item[0].problemAnalysis}}
				</view>
				<!-- 编辑与删除 -->
				<view class="flex padding cu-form-group justify-around bg-grey">
					<button @click="EditProblem(item[0].questionType,index1)">
						<text class="text " :class="icon1"></text>
					</button>
					<button @click="DeleteProblem(item[0].questionType,index1)">
						<text class="text" :class="icon2"></text>
					</button>
				</view>
			</view>
			<!-- 多选题显示 -->
			<view class="margin-top" v-for="(item,index1) in choices" :key="index1">
				<view class="cu-form-group text-lg text-bold">多选题:{{index1+1}}</view>
				<view class="cu-form-group text-bold">
					<text>题目：</text>
					{{item[0].problem}}
				</view>
				<!-- 选项部分 -->
				<view :style="{'background-color': CheckboxCheck(index1,index2) ? '#1cbe29': ''}"
					class="flex cu-form-group" v-for="(a,index2) in choices[index1].length-1" :key="index2">
					<text class="margin-left text-bold title">选项{{index2+1}}.</text>
					<text>{{item[a+1].choice}}</text>
				</view>
				<!-- 正确选项 -->
				<!-- <view class="cu-form-group bg-white text-bold">
					正确选项:{{item[0].rightChoice}}
				</view> -->
				<text class="cu-form-group bg-white text-bold text-sm">题目解析：</text>
				<view class="cu-form-group bg-white text-bold">
					<!-- 题目解析 -->
					{{item[0].problemAnalysis}}
				</view>
				<!-- 编辑与删除 -->
				<view class="flex padding cu-form-group justify-around bg-grey">
					<button @click="EditProblem(item[0].questionType,index1)">
						<text class="text " :class="icon1"></text>
					</button>
					<button @click="DeleteProblem(item[0].questionType,index1)">
						<text class="text" :class="icon2"></text>
					</button>
				</view>
			</view>
			<!-- 判断题显示 -->
			<view class="margin-top" v-for="(item,index1) in Judgment">
				<view class="cu-form-group text-lg text-bold">判断题:{{index1+1}}</view>
				<view class="cu-form-group text-bold">
					<text>题目：</text>
					{{item[0].problem}}
				</view>
				<!-- 选项部分 -->
				<view class="flex cu-form-group">
					<view :style="{'background-color': 1 == Number(item[0].rightChoice[0]) ? '#1cbe29': ''}">
						<text class=" margin-left text-bold title">正确</text>
					</view>
					<view :style="{'background-color': 2 == Number(item[0].rightChoice[0]) ? '#1cbe29': ''}">
						<text class="margin-left text-bold title">错误</text>
					</view>
				</view>
				<!-- 正确选项 -->
				<!-- <view class="cu-form-group bg-white text-bold">
					正确选项:{{item[0].rightChoice}}
				</view> -->
				<text class="cu-form-group bg-white text-bold text-sm">题目解析：</text>
				<view class="cu-form-group bg-white text-bold">
					<!-- 题目解析 -->
					{{item[0].problemAnalysis}}
				</view>
				<!-- 编辑与删除 -->
				<view class="flex padding cu-form-group justify-around bg-grey">
					<button @click="EditProblem(item[0].questionType,index1)">
						<text class="text " :class="icon1"></text>
					</button>
					<button @click="DeleteProblem(item[0].questionType,index1)">
						<text class="text" :class="icon2"></text>
					</button>
				</view>
			</view>
			<!-- 填空题显示 -->
			<view class="margin-top" v-for="(item,index1) in qAndA">
				<view class="cu-form-group text-lg text-bold">填空题:{{index1+1}}</view>
				<view class="cu-form-group text-bold">
					<text>题目：</text>
					{{item[0].problem}}
				</view>
				<!-- 正确选项 -->
				<view class="cu-form-group bg-white text-bold">
					正确回答:{{item[0].rightChoice}}
				</view>
				<text class="cu-form-group bg-white text-bold text-sm">题目解析：</text>
				<view class="cu-form-group bg-white text-bold">
					<!-- 题目解析 -->
					{{item[0].problemAnalysis}}
				</view>
				<!-- 编辑与删除 -->
				<view class="flex padding cu-form-group justify-around bg-grey">
					<button @click="EditProblem(item[0].questionType,index1)">
						<text class="text " :class="icon1"></text>
					</button>
					<button @click="DeleteProblem(item[0].questionType,index1)">
						<text class="text" :class="icon2"></text>
					</button>
				</view>
			</view>
		</view>
		<!-- 对题目进行编辑部分 -->
		<view v-if="editProblemView">

			<!-- 单选题界面 -->
			<view v-if="editChoice">
				<view class="cu-form-group margin-top margin-bottom">
					<textarea maxlength="-1" :disabled="modalName!=null" v-model="problemChoiceTempList[0].problem"
						:auto-height="autoHeight" placeholder="在此处编写问题"></textarea>
					<!-- <u-input v-model="value" :type="type" :border="border"  /> -->
				</view>
				<view>
					<form>
						<radio-group class="block" @change="RadioChange">
							<view class="flex cu-form-group justify-between"
								v-for="(item,index2) in problemChoiceTempList.length" v-if="index2>=1" :key="index2">
								<radio :class="(radio==index2)?'checked':''"
									:checked="(radio==index2||(index2)==problemChoiceTempList[0].rightChoice[0])?true:false"
									:value="index2"></radio>
								<view class="margin-left textChoice text-bold title">选项{{index2}}.</view>
								<textarea maxlength="-1" :disabled="modalName!=null" :auto-height="autoHeight"
									v-model="problemChoiceTempList[index2].choice" name="input"></textarea>
								<!-- 点击后删除选项 -->
								<view>
									<text @click="DeleteChoice(index2)" class="text" :class="icon"></text>
								</view>
							</view>
						</radio-group>
					</form>
					<view class="bg-green padding" @click="AddChoice">
						<text class="text-white">点击后添加选项</text>
					</view>
					<view class="cu-form-group margin-top margin-bottom">
						<!-- 在此处存放题目解析 -->
						<textarea maxlength="-1" :disabled="modalName!=null" :auto-height="autoHeight"
							v-model="problemChoiceTempList[0].problemAnalysis" name="input"
							placeholder="在此处编写问题解析"></textarea>
					</view>
					<view class="margin-top text-center">
						<button @tap="ConfirmChange1" class="cu-btn bg-green shadow lg">确认修改</button>
					</view>
					<view class="padding text-center">
						<button @tap="BackView" class="cu-btn line-green shadow lg">取消修改</button>
					</view>
				</view>
			</view>
			<!-- 多选题 -->
			<view v-if="editChoices">
				<view class="cu-form-group margin-top margin-bottom">
					<textarea maxlength="-1" :disabled="modalName!=null" v-model="problemChoiceTempList[0].problem"
						:auto-height="autoHeight" placeholder="在此处编写问题"></textarea>
					<!-- <u-input v-model="value" :type="type" :border="border"  /> -->
				</view>
				<form>
					<checkbox-group class="block" @change="CheckboxChange">
						<view class="flex cu-form-group justify-between"
							v-for="(item,index3) in problemChoiceTempList.length" v-if="index3>=1" :key="index3">
							<checkbox :class="radio2==index3?'checked':''"
								:checked="(radio2==index3||CheckedYesorNo(index3))?true:false" :value="index3">
							</checkbox>
							<view class="margin-left textChoice text-bold title">选项{{index3}}.</view>
							<input v-model="problemChoiceTempList[index3].choice" name="input"></input>
							<view>
								<text @click="DeleteChoice(index3)" class="text" :class="icon"></text>
							</view>
						</view>
					</checkbox-group>
				</form>
				<view class="bg-green padding" @click="AddChoice">
					<text class="text-white">点击后添加选项</text>
				</view>
				<view class="cu-form-group margin-top margin-bottom">
					<!-- 在此处存放题目解析 -->
					<textarea maxlength="-1" :disabled="modalName!=null" :auto-height="autoHeight"
						v-model="problemChoiceTempList[0].problemAnalysis" name="input"
						placeholder="在此处编写问题解析"></textarea>
				</view>
				<view class="margin-top text-center">
					<button @tap="ConfirmChange2" class="cu-btn bg-green shadow lg">确认修改</button>
				</view>
				<view class="padding text-center">
					<button @tap="BackView" class="cu-btn line-green shadow lg">取消修改</button>
				</view>
			</view>
			<!-- 判断题 -->
			<view v-if="editJudgment">
				<view class="cu-form-group margin-top margin-bottom">
					<textarea maxlength="-1" :disabled="modalName!=null" v-model="problemChoiceTempList[0].problem"
						:auto-height="autoHeight" placeholder="在此处编写问题"></textarea>
					<!-- <u-input v-model="value" :type="type" :border="border"  /> -->
				</view>
				<radio-group class="block" @change="RadioChangeJudgment">
					<view class="flex justify-around cu-form-group margin-top">
						<view>
							<radio class='radio' :class="radio1=='A'?'checked':''"
								:checked="(radio1=='A'||1==problemChoiceTempList[0].rightChoice[0])?true:false"
								value='A'></radio>
							<text class="margin-left text title">正确</text>
						</view>
						<view>
							<radio class='radio' :class="radio1=='B'?'checked':''"
								:checked="(radio1=='B'||2==problemChoiceTempList[0].rightChoice[0])?true:false"
								value='B'></radio>
							<text class="margin-left text title">错误</text>
						</view>
					</view>
				</radio-group>
				<view class="cu-form-group margin-top margin-bottom">
					<!-- 在此处存放题目解析 -->
					<textarea maxlength="-1" :disabled="modalName!=null" :auto-height="autoHeight"
						v-model="problemChoiceTempList[0].problemAnalysis" name="input"
						placeholder="在此处编写问题解析"></textarea>
				</view>
				<view class="margin-top text-center">
					<button @tap="ConfirmChange3" class="cu-btn bg-green shadow lg">确认修改</button>
				</view>
				<view class="padding text-center">
					<button @tap="BackView" class="cu-btn line-green shadow lg">取消修改</button>
				</view>
			</view>
			<!-- 填空题 -->
			<view v-if="editQAndA">
				<view class="cu-form-group margin-top margin-bottom">
					<textarea maxlength="-1" :disabled="modalName!=null" v-model="problemChoiceTempList[0].problem"
						:auto-height="autoHeight" placeholder="在此处编写问题"></textarea>
					<!-- <u-input v-model="value" :type="type" :border="border"  /> -->
				</view>
				<text class="text padding">在下方输入答案:</text>
				<view class="cu-form-group margin-top">
					<textarea maxlength="-1" :disabled="modalName!=null" v-model="problemChoiceTempList[0].rightChoice"
						placeholder="请输入填空题答案"></textarea>
				</view>
				<view class="cu-form-group margin-top margin-bottom">
					<!-- 在此处存放题目解析 -->
					<textarea maxlength="-1" :disabled="modalName!=null" :auto-height="autoHeight"
						v-model="problemChoiceTempList[0].problemAnalysis" name="input"
						placeholder="在此处编写问题解析"></textarea>
				</view>
				<view class="margin-top text-center">
					<button @tap="ConfirmChange4" class="cu-btn bg-green shadow lg">确认修改</button>
				</view>
				<view class="padding text-center">
					<button @tap="BackView" class="cu-btn line-green shadow lg">取消修改</button>
				</view>
			</view>
		</view>

		<!-- 确认保存修改 -->
		<view class="cu-modal" :class="modalName=='RadioModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">保存修改</view>
					<view class="action" @click="HideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>

				<view class="cu-bar bg-white justify-around">
					<view>
						<button class="cu-btn line-green text-green" @click="HideModal">取消</button>
					</view>
					<view>
						<button class="cu-btn bg-green " @click="KeepChange()">确定</button>
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
				taskId: 0,
				taskname: "",
				// 单选题
				choice: [],
				// 多选题
				choices: [],
				// 判断题
				Judgment: [],
				// 填空题
				qAndA: [],
				// 编辑时题目临时存放的数组
				problemChoiceTempList: [],
				// 作业创建时间
				createTime: "",
				// 图标
				icon1: "cuIcon-edit", //编辑
				icon2: "cuIcon-delete", //删除
				icon: "cuIcon-delete",
				editProblemindex: 0,
				// 预览界面显示
				showProblemView: true,
				// 修改题目编辑界面显示
				editProblemView: false,
				editChoice: false,
				editChoices: false,
				editQAndA: false,
				editJudgment: false,
				radio2: -1,
				radio1: -1,
				radio: -1,
				// 自由高度
				autoHeight: true,
				modalName: null,
			}
		},
		onLoad: function(options) {
			this.taskId = options.taskId
			this.taskname = options.taskname
		},
		onShow: function() {
			this.GetData()
		},
		methods: {
			// 控制弹窗确认保存修改并上传修改版本
			ShowModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			HideModal() {
				this.modalName = null
			},
			KeepChange() {
				// 保存修改内容==重新创建一次
				let t = new Date()
				this.createTime = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() +
					":" + t.getMinutes() + ":" + t.getSeconds()
				let a = {
					phone: '13812305644',
					textName: this.taskname,
					createTime: this.createTime,
					choice: this.choice,
					choices: this.choices,
					judgment: this.Judgment,
					qAndA: this.qAndA
				}
				console.log("传入的数据a", a)
				// let b = JSON.stringify(a);
				// console.log("转化后的a",b)
				this.$Request.postRequest(this.$url.GATHER.teacherCreateTask, a).then(res => {
					console.log('作业创建成功没？', res);
					if (res == 0) {
						this.HideModal()
						uni.navigateBack()
					}
					// uni.navigateBack()
				}).catch(err => {
					console.log('出错了,错误是:', err);
				})
			},
			// 多选题选项存储
			CheckboxChange(e) {
				console.log("触发了CheckboxChange函数，传入的多选择正确答案" + typeof(e.detail.value))
				this.problemChoiceTempList[0].rightChoice = e.detail.value
				// for (let i = 0; i < this.problemChoiceTempList[0].rightChoice.length; i++) {
				// 	// this.problemChoiceTempList[0].rightChoice[i]=Number(this.problemChoiceTempList[0].rightChoice[i])
				// 	console.log("每一个选项值", this.problemChoiceTempList[0].rightChoice[0])
				// }
				// console.log("多选选项值", this.problemChoiceTempList[0].rightChoice)
				// console.log("多选选项长度", this.problemChoiceTempList[0].rightChoice.length)
			},
			// 多选题正确选项在编辑页面显示
			CheckedYesorNo(index) {
				let a = 0
				for (let i = 0; i < this.problemChoiceTempList[0].rightChoice.length; i++) {
					if (index == this.problemChoiceTempList[0].rightChoice[i]) {
						a = 1
						return true
					}
				}
				if (a == 0) {
					return false
				}
			},
			// 多选题选项是否被正确选项选中
			CheckboxCheck(index1, index2) {
				let a = 0
				for (let i = 0; i < this.choices[index1][0].rightChoice.length; i++) {
					if ((index2 + 1) == this.choices[index1][0].rightChoice[i]) {
						a = 1
						return true
					}
				}
				if (a == 0) {
					return false
				}
			},
			// 对题目进行编辑
			EditProblem(type, index) {
				console.log("开始运行编辑问题函数,传入的参数为", type, index)
				this.showProblemView = false
				this.editProblemView = true
				//存索引值
				this.editProblemindex = index
				//判断题目类型
				console.log("传入的编辑题目类型为" + Number(type))
				if (Number(type) == 0) {
					// 单选
					// this.editChoiceProblem=this.problemChoiceList[index][0].problem
					// this.choiceNumber=this.problemChoiceList[index].length-1
					this.problemChoiceTempList = JSON.parse(JSON.stringify(this.choice[index]))
					this.editChoices = false
					this.editQAndA = false
					this.editJudgment = false
					this.editChoice = true

				} else if (Number(type) == 1) {
					// 多选
					console.log("进入多选编辑")
					this.problemChoiceTempList = JSON.parse(JSON.stringify(this.choices[index]))
					this.editChoice = false
					this.editQAndA = false
					this.editJudgment = false
					this.editChoices = true
				} else if (Number(type) == 2) {
					// 填空
					this.problemChoiceTempList = JSON.parse(JSON.stringify(this.qAndA[index]))
					this.editChoice = false
					this.editChoices = false
					this.editJudgment = false
					this.editQAndA = true
				} else if (Number(type) == 3) {
					// 判断
					this.problemChoiceTempList = JSON.parse(JSON.stringify(this.Judgment[index]))
					this.editChoice = false
					this.editChoices = false
					this.editQAndA = false
					this.editJudgment = true
				}
			},
			// 删除已创建的题目,type是题目类型，index是题目索引
			DeleteProblem(type, index) {
				if (Number(type) == 0) {
					this.choice.splice(index, 1)
				} else if (Number(type) == 1) {
					this.choices.splice(index, 1)
				} else if (Number(type) == 2) {
					this.qAndA.splice(index, 1)
				} else if (Number(type) == 3) {
					this.Judgment.splice(index, 1)
				}
				console.log(this.choice)
			},
			// 添加选项
			AddChoice() {
				let c = {
					choice: ""
				}
				this.problemChoiceTempList.push(c)
				console.log(this.problemChoiceTempList)
				console.log("选项添加成功！")
			},
			// 删除选项
			DeleteChoice(index) {
				console.log("删除点击成功")
				console.log("传入的删除选项序号" + Number(index))
				console.log("删除之前的正确选项", this.problemChoiceTempList[0].rightChoice)
				console.log("删除之前的正确选项，在删除函数中", this.problemChoiceTempList[0].rightChoice)
				this.problemChoiceTempList.splice(Number(index), 1)
				for (let i = 0; i < this.problemChoiceTempList[0].rightChoice.length; i++) {
					if (Number(index) == this.problemChoiceTempList[0].rightChoice[i]) {
						this.problemChoiceTempList[0].rightChoice.splice(i, 1)
					}
				}
				for (let i = 0; i < this.problemChoiceTempList[0].rightChoice.length; i++) {
					if (index < this.problemChoiceTempList[0].rightChoice[i]) {
						this.problemChoiceTempList[0].rightChoice[i] = this.problemChoiceTempList[0].rightChoice[i] - 1
					}
				}

				console.log("删除之后的正确选项", this.problemChoiceTempList[0].rightChoice)
				console.log("选项删除成功！")
				// this.Seen = false
				// setTimeout(() => {
				// 	this.Seen = true
				// }, 0.01)
				// console.log("界面刷新！")

			},
			//修改界面确认修改
			ConfirmChange1() {
				this.choice[this.editProblemindex] = this.problemChoiceTempList
				this.BackView()
			},
			ConfirmChange2() {
				this.choices[this.editProblemindex] = this.problemChoiceTempList
				this.BackView()
			},
			ConfirmChange3() {
				this.Judgment[this.editProblemindex] = this.problemChoiceTempList
				this.BackView()
			},
			ConfirmChange4() {
				this.qAndA[this.editProblemindex] = this.problemChoiceTempList
				this.BackView()
			},
			// 取消修改
			BackView() {
				this.editProblemView = false
				this.showProblemView = true
			},
			// 单选的选择切换
			RadioChange(e) {
				let a = e.detail.value
				console.log("开始运行选择切换")
				console.log("index2的值" + Number(a))
				console.log("传入的值得数据类型你", typeof(a))
				console.log("正确答案的值", this.problemChoiceTempList[0].rightChoice[0])
				console.log("正确答案的数据类型：", typeof(this.problemChoiceTempList[0].rightChoice[0]))
				this.problemChoiceTempList[0].rightChoice[0] = String(a)
				console.log("已修改" + this.problemChoiceTempList[0].rightChoice[0])
			},
			// 判断题的选择切换
			RadioChangeJudgment(e) {
				console.log("判断题传入的正确选项" + e.detail.value)
				if (e.detail.value == "A") {
					this.problemChoiceTempList[0].rightChoice[0] = 1
				} else if (e.detail.value == "B") {
					this.problemChoiceTempList[0].rightChoice[0] = 2
				}

			},

			// 获取题目数据
			GetData() {
				let a = {
					taskId: this.taskId
				}
				console.log("传入的数据a是", a)
				this.$Request.getRequest(this.$url.GATHER.teacherCheckTaskContent, a).then(res => {
					console.log('老师查询具体作业内容返回结果', res);
					this.choice = res.result[0]
					this.choices = res.result[1]
					this.qAndA = res.result[2]
					this.Judgment = res.result[3]
					console.log("判断题", this.choice, this.choices, this.Judgment, this.qAndA)
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
			}
		}
	}
</script>

<style>

</style>
