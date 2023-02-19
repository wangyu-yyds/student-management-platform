<!-- 创建文件：adminAddJob.vue 创建时间： 2022.1.21_20:36 创建人：彭湖聪-->
<template>
	<view class="home">
		<!-- 教师添加作业与测试的页面 -->
		<!-- 添加作业编辑页面 -->
		<view v-if="editView">
			<!-- 最上方导航栏 -->
			<view class="flex bg-white padding justify-between align-center">
				<view class="flex justify-start align-center">
					<view class="margin-right">
						<text class="text-bold text">第{{totalQuestionNumber}}题</text>
					</view>
					<view class="cu-form-group ">
						<picker @change="PickerChange" :value="index" :range="picker">
							<view class="text picker">
								{{index>-1?picker[index]:'选择题型'}}
							</view>
						</picker>
					</view>
				</view>
				<button @click="ShowView" class="cu-btn bg-green  shadow">
					<view style="font-size: 25rpx;">预览</view>
				</button>
			</view>
			<view v-if="Seen">

				<!-- 单选题界面 -->
				<view v-if="choiceSeen">
					<view class="cu-form-group margin-top margin-bottom">
						<textarea maxlength="-1" :auto-height="autoHeight" :disabled="modalName!=null"
							v-model="problemChoiceTempList[0].problem"
							@input="Saveproblem(problemChoiceTempList[0].problem)" placeholder="在此处编写问题"></textarea>
						<!-- <u-input v-model="value" :type="type" :border="border"  /> -->
						<view v-if="textProblem" class=" text-red text-bold text-center text-lg">请填写题目问题！</view>
					</view>
					<form>
						<radio-group class="block" @change="RadioChange">
							<view class="flex cu-form-group justify-between"
								v-for="(item,index2) in problemChoiceTempList.length" v-if="index2>=1" :key="index2">
								<radio :class="radio==index2?'checked':''" :checked="radio==index2?true:false"
									:value="index2"></radio>
								<view class="margin-left textChoice text-bold title">选项{{index2}}.</view>
								<textarea maxlength="-1" :disabled="modalName!=null" :auto-height="autoHeight"
									v-model="problemChoiceTempList[index2].choice" name="input"></textarea>
								<!-- 点击后删除选项 -->
								<view>
									<text @click="DeleteChoice(index2)" class="text" :class="icon"></text>
								</view>
							</view>
							<view v-if="textAnswer" class="bg-white text-red text-bold text-center text-lg">请填写题目选项内容！</view>
							<view v-if="choiceTip" class="bg-white text-red text-bold text-center text-lg">请选择正确选项！
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
					<!-- 也可上传解析图片 -->
					<view class="padding bg-white  text-bold">
						<u-form ref="uForm">
							<u-form-item label="选择解析照片" :label-style="{'font-size':'35rpx'}" :label-width="auto">
							</u-form-item>
							<view class="cu-form-group">
								<view class="grid col-4 grid-square flex-sub">
									<view class="bg-img" v-for="(item,index) in problemChoiceTempList[0].MediaStorage[0]" :key="index" @tap="ViewImage" :data-url="problemChoiceTempList[0].MediaStorage[0][index]">
									 <image :src="problemChoiceTempList[0].MediaStorage[0][index]" mode="aspectFill"></image>
										<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
											<text class='cuIcon-close'></text>
										</view>
									</view>
									<view class="solids" @tap="ChooseImage" v-if="problemChoiceTempList[0].MediaStorage[0].length<choseImageNumber">
										<text class='cuIcon-cameraadd'></text>
									</view>
								</view>
							</view>
						</u-form>
					</view>
					
					<view class="margin-top text-center">
						<button @tap="NextProblem" class="cu-btn bg-green shadow lg">继续创建下一题</button>
					</view>
					<view class="padding text-center">
						<button @tap="FinishCreate" data-target="DialogModal1"
							class="cu-btn line-green shadow lg">完成试题创建</button>
					</view>
				</view>
				<!-- 多选题界面 -->
				<view v-if="choicesSeen">
					<view class="cu-form-group margin-top margin-bottom">
						<textarea maxlength="-1" :disabled="modalName!=null" v-model="problemChoiceTempList[0].problem"
							@input="Saveproblem(problemChoiceTempList[0].problem)" :auto-height="autoHeight"
							placeholder="在此处编写问题"></textarea>
							<view v-if="textProblem" class=" text-red text-bold text-center text-lg">请填写题目问题！</view>
						<!-- <u-input v-model="value" :type="type" :border="border"  /> -->
					</view>
					<form>
						<checkbox-group class="block" @change="CheckboxChange">
							<view class="flex cu-form-group justify-between"
								v-for="(item,index3) in problemChoiceTempList.length" v-if="index3>=1" :key="index3">
								<checkbox :class="radio2==index3?'checked':''" :checked="radio2==index3?true:false"
									:value="index3"></checkbox>
								<view class="margin-left textChoice text-bold title">选项{{index3}}.</view>
								<textarea maxlength="-1" :disabled="modalName!=null" :auto-height="autoHeight"
									v-model="problemChoiceTempList[index3].choice" name="input"></textarea>
								<view>
									<text @click="DeleteChoice(index3)" class="text" :class="icon"></text>
								</view>
							</view>
							<view v-if="textAnswer" class="bg-white text-red text-bold text-center text-lg">请填写题目选项内容！</view>
							<view v-if="choiceTip" class="bg-white text-red text-bold text-center text-lg">请选择正确选项！
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
					<!-- 也可上传解析图片 -->
					<view class="padding bg-white  text-bold">
						<u-form ref="uForm">
							<u-form-item label="选择解析照片" :label-style="{'font-size':'35rpx'}" :label-width="auto">
							</u-form-item>
							<view class="cu-form-group">
								<view class="grid col-4 grid-square flex-sub">
									<view class="bg-img" v-for="(item,index) in problemChoiceTempList[0].MediaStorage[0]" :key="index" @tap="ViewImage" :data-url="problemChoiceTempList[0].MediaStorage[0][index]">
									 <image :src="problemChoiceTempList[0].MediaStorage[0][index]" mode="aspectFill"></image>
										<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
											<text class='cuIcon-close'></text>
										</view>
									</view>
									<view class="solids" @tap="ChooseImage" v-if="problemChoiceTempList[0].MediaStorage[0].length<choseImageNumber">
										<text class='cuIcon-cameraadd'></text>
									</view>
								</view>
							</view>
						</u-form>
					</view>
					
					<view class="margin-top text-center">
						<button @tap="NextProblem2" class="cu-btn bg-green shadow lg">继续创建下一题</button>
					</view>
					<view class="padding text-center">
						<button @tap="FinishCreate2" data-target="DialogModal1"
							class="cu-btn line-green shadow lg">完成试题创建</button>
					</view>
				</view>
				<!-- 判断题界面 -->
				<view v-if="judgmentSeen">
					<view class="cu-form-group margin-top margin-bottom">
						<textarea maxlength="-1" :disabled="modalName!=null" v-model="problemChoiceTempList[0].problem"
							@input="Saveproblem(problemChoiceTempList[0].problem)" :auto-height="autoHeight"
							placeholder="在此处编写问题"></textarea>
							<view v-if="textProblem" class=" text-red text-bold text-center text-lg">请填写题目问题！</view>
						<!-- <u-input v-model="value" :type="type" :border="border"  /> -->
					</view>
					<radio-group class="block" @change="RadioChangeJudgment">
						<view class="flex justify-around cu-form-group margin-top">
							<view>
								<radio class='radio' :class="radio1=='A'?'checked':''" :checked="radio1=='A'?true:false"
									value='A'></radio>
								<text class="margin-left text title">正确</text>
							</view>
							<view>
								<radio class='radio' :class="radio1=='B'?'checked':''" :checked="radio1=='B'?true:false"
									value='B'></radio>
								<text class="margin-left text title">错误</text>
							</view>
						</view>
						<view v-if="choiceTip" class="bg-white text-red text-bold text-center text-lg">请选择正确选项！
						</view>
					</radio-group>
					<view class="cu-form-group margin-top margin-bottom">
						<!-- 在此处存放题目解析 -->
						<textarea maxlength="-1" :disabled="modalName!=null" :auto-height="autoHeight"
							v-model="problemChoiceTempList[0].problemAnalysis" name="input"
							placeholder="在此处编写问题解析"></textarea>
					</view>
					<!-- 也可上传解析图片 -->
					<view class="padding bg-white  text-bold">
						<u-form ref="uForm">
							<u-form-item label="选择解析照片" :label-style="{'font-size':'35rpx'}" :label-width="auto">
							</u-form-item>
							<view class="cu-form-group">
								<view class="grid col-4 grid-square flex-sub">
									<view class="bg-img" v-for="(item,index) in problemChoiceTempList[0].MediaStorage[0]" :key="index" @tap="ViewImage" :data-url="problemChoiceTempList[0].MediaStorage[0][index]">
									 <image :src="problemChoiceTempList[0].MediaStorage[0][index]" mode="aspectFill"></image>
										<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
											<text class='cuIcon-close'></text>
										</view>
									</view>
									<view class="solids" @tap="ChooseImage" v-if="problemChoiceTempList[0].MediaStorage[0].length<choseImageNumber">
										<text class='cuIcon-cameraadd'></text>
									</view>
								</view>
							</view>
						</u-form>
					</view>
					<view class="margin-top text-center">
						<button @tap="NextProblem3" class="cu-btn bg-green shadow lg">继续创建下一题</button>
					</view>
					<view class="padding text-center">
						<button @tap="FinishCreate3" data-target="DialogModal1"
							class="cu-btn line-green shadow lg">完成试题创建</button>
					</view>
				</view>
				<!-- 填空题界面，答案使用;隔开-->
				<view v-if="qAndASeen">
					<view class="cu-form-group margin-top margin-bottom">
						<textarea maxlength="-1" :disabled="modalName!=null" v-model="problemChoiceTempList[0].problem"
							@input="Saveproblem(problemChoiceTempList[0].problem)" :auto-height="autoHeight"
							placeholder="在此处编写问题"></textarea>
							<view v-if="textProblem" class=" text-red text-bold text-center text-lg">请填写题目问题！</view>
					</view>
					<text class="text padding">在下方输入答案：</text>
					<view class="cu-form-group margin-top">
						<textarea maxlength="-1" :disabled="modalName!=null" v-model="problem2"
							@input="SaveAnswer(problem2)" value="problemChoiceTempList[0].rightChoice"
							placeholder="多行文本输入框"></textarea>
					</view>
					<view v-if="textAnswer2" class="bg-white text-red text-bold text-center text-lg">请填写答案内容！</view>
					<view class="cu-form-group margin-top margin-bottom">
						<!-- 在此处存放题目解析 -->
						<textarea maxlength="-1" :disabled="modalName!=null" :auto-height="autoHeight"
							v-model="problemChoiceTempList[0].problemAnalysis" name="input"
							placeholder="在此处编写问题解析"></textarea>
					</view>
					<!-- 也可上传解析图片 -->
					<view class="padding bg-white  text-bold">
						<u-form ref="uForm">
							<u-form-item label="选择解析照片" :label-style="{'font-size':'35rpx'}" :label-width="auto">
							</u-form-item>
							<view class="cu-form-group">
								<view class="grid col-4 grid-square flex-sub">
									<view class="bg-img" v-for="(item,index) in problemChoiceTempList[0].MediaStorage[0]" :key="index" @tap="ViewImage" :data-url="problemChoiceTempList[0].MediaStorage[0][index]">
									 <image :src="problemChoiceTempList[0].MediaStorage[0][index]" mode="aspectFill"></image>
										<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
											<text class='cuIcon-close'></text>
										</view>
									</view>
									<view class="solids" @tap="ChooseImage" v-if="problemChoiceTempList[0].MediaStorage[0].length<choseImageNumber">
										<text class='cuIcon-cameraadd'></text>
									</view>
								</view>
							</view>
						</u-form>
					</view>
					<view class="margin-top text-center">
						<button @tap="NextProblem4" class="cu-btn bg-green shadow lg">继续创建下一题</button>
					</view>
					<view class="padding text-center">
						<button @tap="FinishCreate4" data-target="DialogModal1"
							class="cu-btn line-green shadow lg">完成试题创建</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 预览界面 -->
		<view v-if="showProblemView">
			<!-- 选择题题目显示 -->
			<view class="bg-white text-center">
				<button @tap="BackEdit" class="cu-btn bg-green shadow lg">返回作业编辑</button>
			</view>
			<view v-for="(item,index1) in problemChoiceList">
				<view class="cu-form-group text-lg text-bold">单选题:{{index1+1}}</view>
				<view class="cu-form-group text-bold">
					<text class="settext">题目：</text>
					{{item[0].problem}}
				</view>
				<!-- 选项部分 -->
				<view :style="{'background-color': (index2+1) ==item[0].rightChoice[0] ? '#1cbe29': ''}"
					class="flex cu-form-group" v-for="(a,index2) in problemChoiceList[index1].length-1" :key="index2">
					<text class="margin-left  text-bold title">选项{{index2+1}}.</text>
					<text>{{item[a+1].choice}}</text>
				</view>
				<text class="cu-form-group bg-white text-bold text-sm">题目解析：</text>
				<view class="cu-form-group bg-white text-bold">
					<!-- 题目解析 -->
					{{item[0].problemAnalysis}}
				</view>
				<!-- 图片解析预览部分 -->
				<view class="padding bg-white  text-bold">
					<u-form ref="uForm">
						<u-form-item label="图片解析" :label-style="{'font-size':'35rpx'}" :label-width="auto">
						</u-form-item>
						<view class="cu-form-group">
							<view class="grid col-4 grid-square flex-sub">
								<view class="bg-img" v-for="(item2,indexImg) in item[0].MediaStorage[0]" :key="indexImg" @tap="ViewImage" :data-url="item2">
								 <image :src="item2" mode="aspectFill"></image>
								<!-- <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								 	<text class='cuIcon-close'></text>
								 </view> -->
								</view>
							</view>
						</view>
					</u-form>
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
			<view class="margin-top" v-for="(item,index1) in problemChoicesList">
				<view class="cu-form-group text-lg text-bold">多选题:{{index1+1}}</view>
				<view class="cu-form-group text-bold">
					<text>题目：</text>
					{{item[0].problem}}
				</view>
				<!-- 选项部分 -->
				<view :style="{'background-color': CheckboxCheck(index1,index2) ? '#1cbe29': ''}"
					class="flex cu-form-group" v-for="(a,index2) in problemChoicesList[index1].length-1" :key="index2">
					<text class="margin-left text-bold title">选项{{index2+1}}.</text>
					<text>{{item[a+1].choice}}</text>
				</view>
				<text class="cu-form-group bg-white text-bold text-sm">题目解析：</text>
				<view class="cu-form-group bg-white text-bold">
					<!-- 题目解析 -->
					{{item[0].problemAnalysis}}
				</view>
				<!-- 题目图片类型解析 -->
				<view class="padding bg-white  text-bold">
					<u-form ref="uForm">
						<u-form-item label="图片解析" :label-style="{'font-size':'35rpx'}" :label-width="auto">
						</u-form-item>
						<view class="cu-form-group">
							<view class="grid col-4 grid-square flex-sub">
								<view class="bg-img" v-for="(item2,indexImg) in item[0].MediaStorage[0]" :key="indexImg" @tap="ViewImage" :data-url="item2">
								 <image :src="item2" mode="aspectFill"></image>
								<!-- <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								 	<text class='cuIcon-close'></text>
								 </view> -->
								</view>
							</view>
						</view>
					</u-form>
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
			<view class="margin-top" v-for="(item,index1) in problemJudgmentList">
				<view class="cu-form-group text-lg text-bold">判断题:{{index1+1}}</view>
				<view class="cu-form-group text-bold">
					<text>题目：</text>
					{{item[0].problem}}
				</view>
				<!-- 选项部分 -->
				<view class="flex cu-form-group">
					<view :style="{'background-color': 1 ==item[0].rightChoice[0] ? '#1cbe29': ''}">
						<text class=" margin-left text-bold title">正确</text>
					</view>
					<view :style="{'background-color': 2 ==item[0].rightChoice[0] ? '#1cbe29': ''}">
						<text class="margin-left text-bold title">错误</text>
					</view>
				</view>
				<text class="cu-form-group bg-white text-bold text-sm">题目解析：</text>
				<view class="cu-form-group bg-white text-bold">
					<!-- 题目解析 -->
					{{item[0].problemAnalysis}}
				</view>
				<!-- 题目图片解析 -->
				<view class="padding bg-white  text-bold">
					<u-form ref="uForm">
						<u-form-item label="图片解析" :label-style="{'font-size':'35rpx'}" :label-width="auto">
						</u-form-item>
						<view class="cu-form-group">
							<view class="grid col-4 grid-square flex-sub">
								<view class="bg-img" v-for="(item2,indexImg) in item[0].MediaStorage[0]" :key="indexImg" @tap="ViewImage" :data-url="item2">
								 <image :src="item2" mode="aspectFill"></image>
								<!-- <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								 	<text class='cuIcon-close'></text>
								 </view> -->
								</view>
							</view>
						</view>
					</u-form>
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
			<view class="margin-top" v-for="(item,index1) in problemQAndAList">
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
				<!-- 题目图片解析 --><view class="padding bg-white  text-bold">
					<u-form ref="uForm">
						<u-form-item label="图片解析" :label-style="{'font-size':'35rpx'}" :label-width="auto">
						</u-form-item>
						<view class="cu-form-group">
							<view class="grid col-4 grid-square flex-sub">
								<view class="bg-img" v-for="(item2,indexImg) in item[0].MediaStorage[0]" :key="indexImg" @tap="ViewImage" :data-url="item2">
								 <image :src="item2" mode="aspectFill"></image>
								<!-- <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								 	<text class='cuIcon-close'></text>
								 </view> -->
								</view>
							</view>
						</view>
					</u-form>
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
		<!-- 编辑界面显示 -->
		<view v-if="editProblemView">
			<!-- 单选题界面 -->
			<view v-if="editChoice">
				<view class="cu-form-group margin-top margin-bottom">
					<textarea maxlength="-1" :disabled="modalName!=null" v-model="problemChoiceTempList[0].problem"
						@input="AAA()" :auto-height="autoHeight" placeholder="在此处编写问题"></textarea>
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
					<!-- 编辑部分解析图片 -->
					<view class="padding bg-white  text-bold">
						<u-form ref="uForm">
							<u-form-item label="选择解析照片" :label-style="{'font-size':'35rpx'}" :label-width="auto">
							</u-form-item>
							<view class="cu-form-group">
								<view class="grid col-4 grid-square flex-sub">
									<view class="bg-img" v-for="(item,index) in problemChoiceTempList[0].MediaStorage[0]" :key="index" @tap="ViewImage" :data-url="problemChoiceTempList[0].MediaStorage[0][index]">
									 <image :src="problemChoiceTempList[0].MediaStorage[0][index]" mode="aspectFill"></image>
										<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
											<text class='cuIcon-close'></text>
										</view>
									</view>
									<view class="solids" @tap="ChooseImage" v-if="problemChoiceTempList[0].MediaStorage[0].length<choseImageNumber">
										<text class='cuIcon-cameraadd'></text>
									</view>
								</view>
							</view>
						</u-form>
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
				<!-- 编辑部分解析图片 -->
				<view class="padding bg-white  text-bold">
					<u-form ref="uForm">
						<u-form-item label="选择解析照片" :label-style="{'font-size':'35rpx'}" :label-width="auto">
						</u-form-item>
						<view class="cu-form-group">
							<view class="grid col-4 grid-square flex-sub">
								<view class="bg-img" v-for="(item,index) in problemChoiceTempList[0].MediaStorage[0]" :key="index" @tap="ViewImage" :data-url="problemChoiceTempList[0].MediaStorage[0][index]">
								 <image :src="problemChoiceTempList[0].MediaStorage[0][index]" mode="aspectFill"></image>
									<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
										<text class='cuIcon-close'></text>
									</view>
								</view>
								<view class="solids" @tap="ChooseImage" v-if="problemChoiceTempList[0].MediaStorage[0].length<choseImageNumber">
									<text class='cuIcon-cameraadd'></text>
								</view>
							</view>
						</view>
					</u-form>
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
				<!-- 编辑部分解析图片 -->
				<view class="padding bg-white  text-bold">
					<u-form ref="uForm">
						<u-form-item label="选择解析照片" :label-style="{'font-size':'35rpx'}" :label-width="auto">
						</u-form-item>
						<view class="cu-form-group">
							<view class="grid col-4 grid-square flex-sub">
								<view class="bg-img" v-for="(item,index) in problemChoiceTempList[0].MediaStorage[0]" :key="index" @tap="ViewImage" :data-url="problemChoiceTempList[0].MediaStorage[0][index]">
								 <image :src="problemChoiceTempList[0].MediaStorage[0][index]" mode="aspectFill"></image>
									<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
										<text class='cuIcon-close'></text>
									</view>
								</view>
								<view class="solids" @tap="ChooseImage" v-if="problemChoiceTempList[0].MediaStorage[0].length<choseImageNumber">
									<text class='cuIcon-cameraadd'></text>
								</view>
							</view>
						</view>
					</u-form>
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
				<text class="text padding">在下方输入答案：</text>
				<view class="cu-form-group margin-top">
					<textarea maxlength="-1" :disabled="modalName!=null" v-model="problemChoiceTempList[0].rightChoice"
						placeholder="多行文本输入框"></textarea>
				</view>
				<view class="cu-form-group margin-top margin-bottom">
					<!-- 在此处存放题目解析 -->
					<textarea maxlength="-1" :disabled="modalName!=null" :auto-height="autoHeight"
						v-model="problemChoiceTempList[0].problemAnalysis" name="input"
						placeholder="在此处编写问题解析"></textarea>
				</view>
				<!-- 编辑部分解析图片 -->
				<view class="padding bg-white  text-bold">
					<u-form ref="uForm">
						<u-form-item label="选择解析照片" :label-style="{'font-size':'35rpx'}" :label-width="auto">
						</u-form-item>
						<view class="cu-form-group">
							<view class="grid col-4 grid-square flex-sub">
								<view class="bg-img" v-for="(item,index) in problemChoiceTempList[0].MediaStorage[0]" :key="index" @tap="ViewImage" :data-url="problemChoiceTempList[0].MediaStorage[0][index]">
								 <image :src="problemChoiceTempList[0].MediaStorage[0][index]" mode="aspectFill"></image>
									<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
										<text class='cuIcon-close'></text>
									</view>
								</view>
								<view class="solids" @tap="ChooseImage" v-if="problemChoiceTempList[0].MediaStorage[0].length<choseImageNumber">
									<text class='cuIcon-cameraadd'></text>
								</view>
							</view>
						</view>
					</u-form>
				</view>
				<view class="margin-top text-center">
					<button @tap="ConfirmChange4" class="cu-btn bg-green shadow lg">确认修改</button>
				</view>
				<view class="padding text-center">
					<button @tap="BackView" class="cu-btn line-green shadow lg">取消修改</button>
				</view>
			</view>
		</view>
		<!-- 确认题目创建部分 -->
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">创建作业</view>
					<view class="action" @click="HideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<u-field v-model="testName" label="作业名" placeholder="请填写作业名" clear-size="50rpx" maxlength="10">
					</u-field>
					<view v-if="textName" class=" text-red text-bold text-center text-lg">请填写作业名称！
					</view>
				</view>
				<view class="cu-bar bg-white justify-around">
					<view class="action">
						<button class="cu-btn line-green text-green" @click="HideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @click="TransformTempFath">确定</button>
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
				// 编辑界面选择题题目
				// editChoiceProblem: this.problemChoiceTempList[0].problem,
				//未填写作业问题时弹出提示
				textProblem: false,
				textAnswer: false,
				textAnswer2:false,
				// 编辑界面选项数量
				choiceNumber: 0,
				modalName: null,
				textareaAValue: '',
				//作业名称
				testName: "",
				//没填写作业名称时显示提示语
				textName: false,
				// 图标
				icon1: "cuIcon-edit", //编辑
				icon2: "cuIcon-delete", //删除
				icon: "cuIcon-delete",
				// 总体数
				totalQuestionNumber: 1,
				// 下拉菜单选课题型
				index: -1,
				// 
				problem1: "",
				problem2: "",
				value: '',
				// 检测两次选择是否相同
				valueMax: -2,
				picker: ['单选题', '多选题', '判断题', '填空题'],
				// 复选框列表
				checkbox: [{
					value: 'A',
					checked: false
				}, {
					value: 'B',
					checked: false
				}, {
					value: 'C',
					checked: false
				}],
				// 随内容添加行距
				autoHeight: true,
				// 添加题目全体显示显示
				editView: true,
				Seen: true,
				choiceSeen: false,
				choicesSeen: false,
				judgmentSeen: false,
				qAndASeen: false,
				//选项未选提示部分
				choiceTip: false,
				// 预览界面显示
				showProblemView: false,
				// 修改题目编辑界面显示
				editProblemView: false,
				editChoice: false,
				editChoices: false,
				editQAndA: false,
				editJudgment: false,
				//判断题目创建部分是否显示
				modalName: null,
				// 修改题目编辑界面问题
				editProblemindex: 0,
				// 单选题列表
				problemChoiceList: [],

				// 暂存选项
				problemChoiceTempList: [],
				problemSecond: [],
				// 判断题正确选项的变量
				radio: -1,
				radio1: '',
				radio2: -1,
				// 多选题列表
				problemChoicesList: [],
				// 判断题列表
				problemJudgmentList: [],
				// 填空题列表
				problemQAndAList: [],
				//题目解析
				problemAnalysis: "",
				//作业创建时间
				createTime: "",
				phone: this.$global.openid,
				// 上传解析图片所需要的数据
				PostObjectParams : {
					serverURL: "110.40.151.129:8999/getPostObjectParams", //server地址
					ossHost: 'http://pangmayi.oss-cn-hangzhou.aliyuncs.com', // oss地址
					signature: '', // **签名信息
					ossAccessKeyId: '', // **AccessKey ID
					policy: '', // **策略
					key: '', // *设置文件上传至OSS后的文件路径。默认studentManager/fileName
					filePath: '' // *文件的临时地址
				},
				// 允许选择的最大照片数量
				choseImageNumber:4
			}
		},
		methods: {
			isNull() {
				if (this.problemChoiceTempList[0].problem == "") {
					this.textProblem = true
					return false
				} else {
					this.textProblem = false
				}
				for (let i = 1; i < this.problemChoiceTempList.length; i++) {
					if (this.problemChoiceTempList[i].choice == "") {
						this.textAnswer = true
						return false
					} else {
						this.textAnswer = false
					}
				}
				return true
			},
			//从预览界面返回作业创建编辑部分
			BackEdit() {
				this.showProblemView = false
				this.editView = true
				this.problemChoiceTempList = [{
					problem: "",
					rightChoice: [],
					questionType: 0,
					problemAnalysis: "",
					MediaStorage: [[],[]],
				}, {
					choice: ""
				}, {
					choice: ""
				}]
			},
			// 多选题正确选项在编辑页面显示
			CheckedYesorNo(index) {
				let a = 0
				for (let i = 0; i < this.problemChoiceTempList[0].rightChoice.length; i++) {
					if (index == this.problemChoiceTempList[0].rightChoice[i]) {
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
				for (let i = 0; i < this.problemChoicesList[index1][0].rightChoice.length; i++) {
					if ((index2 + 1) == this.problemChoicesList[index1][0].rightChoice[i]) {
						return true
					} else {
						a = 1
					}
				}
				if (a == 1) {
					return false
				}
			},
			
			//隐藏确认创建弹窗
			HideModal() {
				this.modalName = null
				this.textName=null
				this.testName=""
			},
			//修改界面确认修改
			ConfirmChange1() {
				this.problemChoiceList[this.editProblemindex] = this.problemChoiceTempList
				this.BackView()
			},
			ConfirmChange2() {
				this.problemChoicesList[this.editProblemindex] = this.problemChoiceTempList
				this.BackView()
			},
			ConfirmChange3() {
				this.problemJudgmentList[this.editProblemindex] = this.problemChoiceTempList
				this.BackView()
			},
			ConfirmChange4() {
				this.problemQAndAList[this.editProblemindex] = this.problemChoiceTempList
				this.BackView()
			},
			//返回预览视图
			BackView() {
				this.editProblemView = false
				this.showProblemView = true
			},
			//返回数组的选项
			GetChoice(index) {
				let a = this.problemChoiceTempList[index++].choice
				return a
			},
			// 触发编辑问题,type是题目类型，index是题目索引
			EditProblem(type, index) {
				this.showProblemView = false
				this.editProblemView = true
				//存索引值
				this.editProblemindex = index
				//判断题目类型
				console.log("传入的编辑题目类型为" + Number(type))
				if (Number(type) == 0) {
					// 单选
					this.problemChoiceTempList = JSON.parse(JSON.stringify(this.problemChoiceList[index]))
					this.editChoices = false
					this.editQAndA = false
					this.editJudgment = false
					this.editChoice = true

				} else if (Number(type) == 1) {
					// 多选
					console.log("进入多选编辑")
					this.problemChoiceTempList = JSON.parse(JSON.stringify(this.problemChoicesList[index]))
					this.editChoice = false
					this.editQAndA = false
					this.editJudgment = false
					this.editChoices = true
				} else if (Number(type) == 2) {
					// 填空
					this.problemChoiceTempList = JSON.parse(JSON.stringify(this.problemQAndAList[index]))
					this.editChoice = false
					this.editChoices = false
					this.editJudgment = false
					this.editQAndA = true
				} else if (Number(type) == 3) {
					// 判断
					this.problemChoiceTempList = JSON.parse(JSON.stringify(this.problemJudgmentList[index]))
					this.editChoice = false
					this.editChoices = false
					this.editQAndA = false
					this.editJudgment = true
				}
			},
			// 删除已创建的题目,type是题目类型，index是题目索引
			DeleteProblem(type, index) {
				if (Number(type) == 0) {
					this.problemChoiceList.splice(index, 1)
				} else if (Number(type) == 1) {
					this.problemChoicesList.splice(index, 1)
				} else if (Number(type) == 2) {
					this.problemQAndAList.splice(index, 1)
				} else if (Number(type) == 3) {
					this.problemJudgmentList.splice(index, 1)
				}
				this.totalQuestionNumber--
			},
			// 点击预览触发函数
			ShowView() {
				// 点击后显示预览界面
				this.editView = false
				this.showProblemView = true
			},
			// 单选的选择切换
			RadioChange(e) {
				let a = e.detail.value
				this.problemChoiceTempList[0].rightChoice[0] = Number(a)
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
			PickerChange(e) {
				// 防止两次选择同一种题目类型导致题目内容清空
				if (this.index == e.detail.value) {
					return
				} else {
					this.index = e.detail.value

					if (this.index == 0) {
						this.choicesSeen = false
						this.judgmentSeen = false
						this.qAndASeen = false
						this.CreateChoice()
					} else if (this.index == 1) {
						this.choiceSeen = false
						this.judgmentSeen = false
						this.qAndASeen = false
						this.CreateChoices()
					} else if (this.index == 2) {
						this.choicesSeen = false
						this.choiceSeen = false
						this.qAndASeen = false
						this.CreateJudgment()
					} else if (this.index == 3) {
						this.choicesSeen = false
						this.choiceSeen = false
						this.judgmentSeen = false
						this.CreateQAndA()
					}
				}
			},
			// 多选题选项存储
			CheckboxChange(e) {
				this.problemChoiceTempList[0].rightChoice = e.detail.value
			},
			// 创建选择题
			CreateChoice() {
				// 令显示题页面显示
				this.choiceSeen = true
				this.problemChoiceTempList = []
				let a = {
					problem: "",
					rightChoice: [],
					questionType: 0,
					problemAnalysis: "",
					MediaStorage: [[],[]],
				}
				this.problemChoiceTempList.push(a)
				let b = {
					choice: ""
				}
				this.problemChoiceTempList.push(b)
				let c = {
					choice: ""
				}
				this.problemChoiceTempList.push(c)
				this.Seen = false
				setTimeout(() => {
					this.Seen = true
				}, 0.01)

			},
			// 创建多选题
			CreateChoices() {
				this.choicesSeen = true
				this.problemChoiceTempList = []
				let a = {
					problem: "",
					rightChoice: [],
					questionType: 1,
					problemAnalysis: "",
					MediaStorage: [[],[]],
				}
				this.problemChoiceTempList.push(a)
				let b = {
					choice: ""
				}
				this.problemChoiceTempList.push(b)
				let c = {
					choice: ""
				}
				this.problemChoiceTempList.push(c)
				let d = {
					choice: ""
				}
				this.problemChoiceTempList.push(d)

			},
			// 创建判断题
			CreateJudgment() {
				this.judgmentSeen = true
				this.problemChoiceTempList = []
				let a = {
					problem: "",
					rightChoice: [],
					questionType: 3,
					problemAnalysis: "",
					MediaStorage: [[],[]],
				}
				this.problemChoiceTempList.push(a)

			},
			// 创建填空题：答案由老师自己使用;隔开
			CreateQAndA() {
				this.qAndASeen = true
				this.problemChoiceTempList = []
				let a = {
					problem: "",
					rightChoice: "",
					questionType: 2,
					problemAnalysis: "",
					MediaStorage: [[],[]],
				}
				this.problemChoiceTempList.push(a)
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
			},

			// 储存单个问题的数据
			Saveproblem(value) {
				this.problemChoiceTempList[0].problem = value
				this.problem1 = ""
			},
			// 储存文本问题答案
			SaveAnswer(value) {
				this.problemChoiceTempList[0].rightChoice = value
				this.problem2 = ""
			},

			// 开始创建下一道题
			NextProblem() {
				//替换所有的换行符
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\r\n/g, "<br>")
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\n/g, "<br>");
				//替换所有的空格（中文空格、英文空格都会被替换）
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\s/g, "&nbsp;");
				if (this.isNull() == true) {
					if (this.problemChoiceTempList[0].rightChoice.length == 0) {
						this.choiceTip = true
						return
					} else {
						this.choiceTip = false
						this.problemChoiceList.push(this.problemChoiceTempList)
					}
				}else{
					return
				}
				this.totalQuestionNumber++
				this.problemChoiceTempList = [{
					problem: "",
					rightChoice: [],
					questionType: 0,
					problemAnalysis: "",
					MediaStorage: [[],[]],
				}, {
					choice: ""
				}, {
					choice: ""
				}]
				this.Seen = false
				setTimeout(() => {
					this.Seen = true
				}, 0.01)
			},
			// 多选题最后保存正确选项
			NextProblem2() {
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\r\n/g, "<br>")
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\n/g, "<br>");
				//替换所有的空格（中文空格、英文空格都会被替换）
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\s/g, "&nbsp;");
				if(this.isNull()==true){
				if (this.problemChoiceTempList[0].rightChoice.length == 0) {
					this.choiceTip = true
					return
				} else {
					this.choiceTip = false
					for (let i = 0; i < this.problemChoiceTempList[0].rightChoice.length; i++) {
						this.problemChoiceTempList[0].rightChoice[i] = Number(this.problemChoiceTempList[0].rightChoice[i])
					}
				}
				}else{
					return 
				}
				this.problemChoicesList.push(this.problemChoiceTempList)
				this.totalQuestionNumber++
				this.problemChoiceTempList = [{
					problem: "",
					rightChoice: [],
					questionType: 1,
					problemAnalysis: "",
					MediaStorage:[[],[]],
				}, {
					choice: ""
				}, {
					choice: ""
				}]
				console.log(this.problemChoicesList)
				this.Seen = false
				setTimeout(() => {
					this.Seen = true
				}, 0.01)
			},
			// 判断题
			NextProblem3() {
				if(this.problemChoiceTempList[0].problem==""){
					this.textProblem=true
					return 
				}else{
					this.textProblem=false
				}
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\r\n/g, "<br>")
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\n/g, "<br>");
				//替换所有的空格（中文空格、英文空格都会被替换）
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\s/g, "&nbsp;");
				if (this.problemChoiceTempList[0].rightChoice.length == 0) {
					this.choiceTip = true
					return
				} else {
					this.choiceTip = false
					this.problemJudgmentList.push(this.problemChoiceTempList)
				}
				this.totalQuestionNumber++
				this.problemChoiceTempList = [{
					problem: "",
					rightChoice: [],
					questionType: 3,
					problemAnalysis: "",
					MediaStorage: [[],[]],
				}]
				console.log(this.problemJudgmentList)
				this.Seen = false
				setTimeout(() => {
					this.Seen = true
				}, 0.01)
			},
			// 填空题
			NextProblem4() {
				if(this.problemChoiceTempList[0].problem==""){
					this.textProblem=true
					return 
				}else{
					this.textProblem=false
				}
				if(this.problemChoiceTempList[0].rightChoice==""){
					this.textAnswer2=true
					return 
				}else{
					this.textAnswer2=false
				}
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\r\n/g, "<br>")
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\n/g, "<br>");
				//替换所有的空格（中文空格、英文空格都会被替换）
				this.problemChoiceTempList[0].problem = this.problemChoiceTempList[0].problem.replace(/\s/g, "&nbsp;");
				// 答案的转化
				this.problemChoiceTempList[0].rightChoice = this.problemChoiceTempList[0].rightChoice.replace(/\r\n/g,
					"<br>")
				this.problemChoiceTempList[0].rightChoice = this.problemChoiceTempList[0].rightChoice.replace(/\n/g,
					"<br>");
				//替换所有的空格（中文空格、英文空格都会被替换）
				this.problemChoiceTempList[0].rightChoice = this.problemChoiceTempList[0].rightChoice.replace(/\s/g,
					"&nbsp;");
				if (this.problemChoiceTempList[0].rightChoice == "") {
					this.choiceTip = true
					return
				} else {
					this.choiceTip = false
					this.problemQAndAList.push(this.problemChoiceTempList)
				}
				this.totalQuestionNumber++
				this.problemChoiceTempList = [{
					problem: "",
					rightChoice: "",
					questionType: 2,
					problemAnalysis: "",
					MediaStorage: [[],[]],
				}]
				console.log(this.problemQAndAList)
				this.Seen = false
				setTimeout(() => {
					this.Seen = true
				}, 0.01)
			},
			// 完成创建
			FinishCreate(e) {
				if (this.isNull() == true) {
					if (this.problemChoiceTempList[0].rightChoice.length == 0) {
						this.choiceTip = true
						return
					} else if(this.problemChoiceList.length + this.problemChoicesList.length + this.problemJudgmentList.length +
						this.problemQAndAList.length == this.totalQuestionNumber-1){
						this.choiceTip = false
						this.problemChoiceList.push(this.problemChoiceTempList)
					}
				}else{
					return
				}
				
				this.modalName = e.currentTarget.dataset.target;
				console.log("完成试题创建！选择题内容", this.problemChoiceList)
			},
			FinishCreate2(e) {
				if (this.isNull() == true) {
					if (this.problemChoiceTempList[0].rightChoice.length == 0) {
						this.choiceTip = true
						return
					} else if(this.problemChoiceList.length + this.problemChoicesList.length + this.problemJudgmentList.length + this
					.problemQAndAList.length == this.totalQuestionNumber-1){
						this.choiceTip = false
						this.problemChoicesList.push(this.problemChoiceTempList)
					}
				}else{
					return
				}
				this.modalName = e.currentTarget.dataset.target;
				console.log("完成多选题试题创建！多选题内容", this.problemChoicesList)
			},
			FinishCreate3(e) {
				if(this.problemChoiceTempList[0].problem==""){
					this.textProblem=true
					return 
				}else{
					this.textProblem=false
				}
				if(this.problemChoiceTempList[0].rightChoice.length==0){
					this.choiceTip=true
					return 
				}else{
					this.choiceTip=false
				}
				if (this.problemChoiceList.length + this.problemChoicesList.length + this.problemJudgmentList.length + 
				this.problemQAndAList.length == this.totalQuestionNumber) {
					// 不用进行操作
				} else {
					this.problemJudgmentList.push(this.problemChoiceTempList)
				}
				this.modalName = e.currentTarget.dataset.target;
				console.log("完成试题创建！判断题内容", this.problemJudgmentList)
			},
			FinishCreate4(e) {
				if(this.problemChoiceTempList[0].problem==""){
					this.textProblem=true
					return 
				}else{
					this.textProblem=false
				}
				if(this.problemChoiceTempList[0].rightChoice==""){
					this.textAnswer2=true
					return 
				}else{
					this.textAnswer2=false
				}
				if (this.problemChoiceList.length + this.problemChoicesList.length + this.problemJudgmentList.length + this
					.problemQAndAList.length == this.totalQuestionNumber) {
					// 不用进行操作
				} else {
					this.problemQAndAList.push(this.problemChoiceTempList)
				}
				this.modalName = e.currentTarget.dataset.target;
				console.log("完成试题创建！,填空题内容", this.problemQAndAList)
			},
			// 图片预览
			ViewImage(e) {
				uni.previewImage({
					urls: this.problemChoiceTempList[0].MediaStorage[0],
					current: e.currentTarget.dataset.url
				});
			},
			// 删除图片
			DelImg(e) {
				uni.showModal({
					title: '',
					content: '确定要删除这张图片吗？',
					cancelText: '再想想',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							this.problemChoiceTempList[0].MediaStorage[0].splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			// 选择图片
			async ChooseImage() {
				// let a={courseid:1}
				// 将返回的图片临时地址存入图片列表中
				let str=await this.uploadImage()
				str.splice(this.choseImageNumber-this.problemChoiceTempList[0].MediaStorage[0].length)
				str.forEach((item)=>{
					this.problemChoiceTempList[0].MediaStorage[0].push(item)
				})
				console.log("拿到了照片地址",this.problemChoiceTempList[0].MediaStorage[0])
			},
			// 获取解析图片
			async uploadImage() {
				console.log("开始调用图片上传方法")
				return new Promise(async (resolve, reject) => {
					// 如果传入的params有意义则执行下面操作
						await this.getPostObjectParams(); //获取签名
						let imagePath = await this.getFilePath(); //获取图片的物理地址
						resolve(imagePath) //返回图片在oss上的url
				})
			},
			// 上传图片获取签名
			getPostObjectParams() {
				uni.request({
					url: `http://${this.PostObjectParams.serverURL}`,
					success: (res) => {
						console.log(res.data)
						this.PostObjectParams.ossAccessKeyId = res.data.OSSAccessKeyId; //OSSAccessKeyId
						this.PostObjectParams.policy = res.data.policy; //策略
						this.PostObjectParams.signature = res.data.signature; //签名
					},
					fail: (err) => {
						console.log("getPostObjectParams方法出错!" + err)
					}
				})
			},
			// 上传图片获取文件路径
			getFilePath() {
				return new Promise((resolve, reject) => {
					uni.chooseImage({
						success: (chooseImagesRes) => {
							const tempFilePaths = chooseImagesRes.tempFilePaths;          //用tempFilePaths保存图片的本地地址
								resolve(tempFilePaths)
						},
						fail: () => {
							reject()
						}
					})
				})
			},
			GetOSSPath(params,tempFilePaths){
				if (JSON.stringify(params) != '{}') {
					let taskname=params[Reflect.ownKeys(params)[0]]							 //taskname是存储在OSS上的作业名地址
					let tasktype=params[Reflect.ownKeys(params)[1]]							 //tastype是存储在OSS上的作业类型地址，共有四种类型
					let questionindex=params[Reflect.ownKeys(params)[2]]					 //questionindex是存储在OSS上的第几道题地址
					let picture=params[Reflect.ownKeys(params)[3]]					 		//picture是存储在OSS上的题目中的第几张解析图片地址
					const ext = tempFilePaths.replace(/([\S\s]+)\.(\S+)$/, '$2')     //获取文件后缀名
					let OSSPath=`studentManager/teacher/task/taskid/${taskname}/${tasktype}/${questionindex}/${picture}.${ext}`// 图片在oss上的路径
					return OSSPath
				} else {
					console.log("uploadImage方法没有传入courseid或者classid!");
				}
			},
			
			// 将所有题目的图片解析的临时图片地址转化成为OSS返回的网络地址
			async TransformTempFath(){
				// 判断文件名称是否填写完毕
				if (this.testName == "") {
					this.textName = true
					return
				} else {
					this.textName = false
				}
				// 对四个列表进行循环
				var times=0
				var allNumber=0
					for(let i=0 ;i<this.problemChoiceList.length;i++){
						allNumber+=this.problemChoiceList[i][0].MediaStorage[0].length
					for(let j=0;j<this.problemChoiceList[i][0].MediaStorage[0].length;j++){
						let params={taskname:this.testName,tasktype:'choice',questionindex:(i+1),picture:(j+1)}
						let osspath=await this.GetOSSPath(params,this.problemChoiceList[i][0].MediaStorage[0][j])
						// 获取图片存在OSS上的网络地址	
							
						 uni.uploadFile({
							url: this.PostObjectParams.ossHost,                               //oss的bucket域名即可
							filePath: this.problemChoiceList[i][0].MediaStorage[0][j],                         //文件的物理地址
							name: 'file',
							formData: {
								key: osspath, //例如studentManeger/test.jpg文件存储在OSS上的位置
								policy: this.PostObjectParams.policy,
								OSSAccessKeyId: this.PostObjectParams.ossAccessKeyId,
								signature: this.PostObjectParams.signature,
							},
							success: (res) => {
								if (res.statusCode == 204) {
									let imgpath =`https://wy.pangmayi.cn/${osspath}`
									this.problemChoiceList[i][0].MediaStorage[0][j]=imgpath 
									times++
									console.log("times的值",times)
									console.log("应该执行",allNumber,"次")
										if((times)==allNumber){
											console.log("所有图片应该已经转化完成",this.problemChoiceList)
											this.AddText()
										}
								}
							},
							fail: err => {
								console.log("上传失败!", err)
								reject("uploadERR:",err)
							}
						 })
					}
				}
				for(let i=0 ;i<this.problemChoicesList.length;i++){
					allNumber+=this.problemChoicesList[i][0].MediaStorage[0].length
					for(let j=0;j<this.problemChoicesList[i][0].MediaStorage[0].length;j++){
						let params={taskname:this.testName,tasktype:'choices',questionindex:(i+1),picture:(j+1)}
						let osspath=await this.GetOSSPath(params,this.problemChoicesList[i][0].MediaStorage[0][j])
						// 获取图片存在OSS上的网络地址		
						 uni.uploadFile({
							url: this.PostObjectParams.ossHost,                               //oss的bucket域名即可
							filePath: this.problemChoicesList[i][0].MediaStorage[0][j],                         //文件的物理地址
							name: 'file',
							formData: {
								key: osspath, //例如studentManeger/test.jpg文件存储在OSS上的位置
								policy: this.PostObjectParams.policy,
								OSSAccessKeyId: this.PostObjectParams.ossAccessKeyId,
								signature: this.PostObjectParams.signature,
							},
							success: (res) => {
								if (res.statusCode == 204) {
									let imgpath =`https://wy.pangmayi.cn/${osspath}`
									this.problemChoicesList[i][0].MediaStorage[0][j]=imgpath 
									times++
									console.log("times的值",times)
									console.log("应该执行",allNumber,"次")
										if((times)==allNumber){
											console.log("所有图片应该已经转化完成",this.problemChoicesList)
											this.AddText()
										}
								}
							},
							fail: err => {
								console.log("上传失败!", err)
								reject("uploadERR:",err)
							}
						 })
					}
				}
				
				for(let i=0 ;i<this.problemJudgmentList.length;i++){
					allNumber+=this.problemJudgmentList[i][0].MediaStorage[0].length
					for(let j=0;j<this.problemJudgmentList[i][0].MediaStorage[0].length;j++){
						let params={taskname:this.testName,tasktype:'judge',questionindex:(i+1),picture:(j+1)}
						let osspath=await this.GetOSSPath(params,this.problemJudgmentList[i][0].MediaStorage[0][j])
						// 获取图片存在OSS上的网络地址		
						 uni.uploadFile({
							url: this.PostObjectParams.ossHost,                               //oss的bucket域名即可
							filePath: this.problemJudgmentList[i][0].MediaStorage[0][j],                         //文件的物理地址
							name: 'file',
							formData: {
								key: osspath, //例如studentManeger/test.jpg文件存储在OSS上的位置
								policy: this.PostObjectParams.policy,
								OSSAccessKeyId: this.PostObjectParams.ossAccessKeyId,
								signature: this.PostObjectParams.signature,
							},
							success: (res) => {
								if (res.statusCode == 204) {
									let imgpath =`https://wy.pangmayi.cn/${osspath}`
									this.problemJudgmentList[i][0].MediaStorage[0][j]=imgpath 
									times++
									console.log("times的值",times)
									console.log("应该执行",allNumber,"次")
										if((times)==allNumber){
											console.log("所有图片应该已经转化完成",this.problemJudgmentList)
											this.AddText()
										}
								}
							},
							fail: err => {
								console.log("上传失败!", err)
								reject("uploadERR:",err)
							}
						 })
					}
				}
				
				for(let i=0 ;i<this.problemQAndAList.length;i++){
					allNumber+=this.problemQAndAList[i][0].MediaStorage[0].length
					for(let j=0;j<this.problemQAndAList[i][0].MediaStorage[0].length;j++){
						let params={taskname:this.testName,tasktype:'answer',questionindex:(i+1),picture:(j+1)}
						let osspath=await this.GetOSSPath(params,this.problemQAndAList[i][0].MediaStorage[0][j])
						// 获取图片存在OSS上的网络地址		
						 uni.uploadFile({
							url: this.PostObjectParams.ossHost,                               //oss的bucket域名即可
							filePath: this.problemQAndAList[i][0].MediaStorage[0][j],                         //文件的物理地址
							name: 'file',
							formData: {
								key: osspath, //例如studentManeger/test.jpg文件存储在OSS上的位置
								policy: this.PostObjectParams.policy,
								OSSAccessKeyId: this.PostObjectParams.ossAccessKeyId,
								signature: this.PostObjectParams.signature,
							},
							success: (res) => {
								if (res.statusCode == 204) {
									let imgpath =`https://wy.pangmayi.cn/${osspath}`
									this.problemQAndAList[i][0].MediaStorage[0][j]=imgpath 
									times++
									console.log("times的值",times)
									console.log("应该执行",allNumber,"次")
										if((times)==allNumber){
											console.log("所有图片应该已经转化完成",this.problemQAndAList)
											this.AddText()
										}
								}
							},
							fail: err => {
								console.log("上传失败!", err)
								reject("uploadERR:",err)
							}
						 })
					}
				}
				
			},
			// 实际转化模块
			//wy作
			 // UploadOSS(tempurl,ossSavePath,numTime){
				 // return new Promise((resolve, reject)=>{
					//  console.log("上传OSS之前的临时地址",tempurl,"OSS存储路径",ossSavePath)
					//  uni.uploadFile({
					//  	url: this.PostObjectParams.ossHost,                               //oss的bucket域名即可
					//  	filePath: tempurl,                         //文件的物理地址
					//  	name: 'file',
					//  	formData: {
					//  		key: ossSavePath, //例如studentManeger/test.jpg文件存储在OSS上的位置
					//  		policy: this.PostObjectParams.policy,
					//  		OSSAccessKeyId: this.PostObjectParams.ossAccessKeyId,
					//  		signature: this.PostObjectParams.signature,
					//  	},
					//  	success: (res) => {
					//  		if (res.statusCode == 204) {
					//  			let imgpath =`https://wy.pangmayi.cn/${ossSavePath}`
					//  				console.log("上传成功!")
					//  				console.log("上传完成的图片网络地址",imgpath)
					// 			this.OSSdo++;	
					//  			resolve(imgpath) 
					// 			console.log("一共需要执行",numTime,"次")
					// 				if(this.OSSdo==numTime){
					// 					this.AddText()
					// 				}
					//  		}
					//  	},
					//  	fail: err => {
					//  		console.log("上传失败!", err)
					// 		reject("uploadERR:",err)
					//  	}
					//  })
				 // })
			// },
			// 创建作业并返回发布作业界面
			AddText() {
				let t = new Date()
				this.createTime = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() +
					":" + t.getMinutes() + ":" + t.getSeconds()
				this.problemChoiceList = JSON.stringify(this.problemChoiceList)
				this.problemChoicesList = JSON.stringify(this.problemChoicesList)
				this.problemJudgmentList = JSON.stringify(this.problemJudgmentList)
				this.problemQAndAList = JSON.stringify(this.problemQAndAList)
				let a = {
					phone: this.phone,
					textName: this.testName,
					createTime: this.createTime,
					choice: this.problemChoiceList,
					choices: this.problemChoicesList,
					judgment: this.problemJudgmentList,
					qAndA: this.problemQAndAList
				}
			
				// a = JSON.stringify(a)
				console.log("创建作业传入的数据a", a)
				this.$Request.postRequest(this.$url.GATHER.teacherCreateTask, a).then(res => {
					console.log('作业创建成功没?', res);
					if (res.code == 0) {
						this.modalName = null
						uni.showToast({
							// 弹出框的标题
							title: '创建作业成功!',
							// 弹出框的图标，不想设置图标时请给none
							icon: 'none',
							duration: 500,
						})
						uni.navigateBack()
					} else {
						uni.showToast({
							// 弹出框的标题
							title: '创建作业失败!',
							// 弹出框的图标，不想设置图标时请给none
							icon: 'none',
							duration: 500,
						})
					}
					uni.navigateBack()
				}).catch(err => {
					console.log('222', err);
				})
			},
		}
	}
</script>
<style>
	.settext {
		width: 110rpx;
	}

	.home {
		width: 750rpx;
	}

	.frameSize {
		/* width: 700rpx; */
		height: 500px;
	}

	.problemType {
		width: 200rpx;
	}

	.text {
		font-size: 35rpx;
	}

	.textChoice {
		font-size: 40rpx;
	}
</style>
