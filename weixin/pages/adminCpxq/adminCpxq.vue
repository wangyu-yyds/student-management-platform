<template>
	<view  v-if="View">
		<view class="flex solids padding justify-between align-center bg-white">
			<view >
				<button class="cu-btn bg-blue" @tap="showModal" data-target="DialogModal1">添加缺勤</button>
				<button class="cu-btn margin-xs bg-blue" @tap="showModal" data-target="DialogModal2">添加加分</button>
				<button class="cu-btn bg-blue" @tap="showModal" data-target="DialogModal3">删除</button>
			</view>
		</view>
		<u-collapse :accordion="false">
		<u-collapse-item class="bg-white" title="课堂加分情况">
					<u-table>
						<u-tr class="u-tr">
							<u-th class="u-th setHeight2">编号</u-th>
							<u-th class="u-th setHeight2">事件</u-th>
							<u-th class="u-th setHeight2">处理方式</u-th>
							<u-th class="u-th setHeight2">添加时间</u-th>
						</u-tr>
						<u-tr class="u-tr " v-for="(item,index) in bonusList">
							<u-td class="u-td setHeight">{{index+1}}</u-td>
							<u-td class="u-td setHeight">加分</u-td>
							<u-td class="u-td setHeight">{{item.sbon_remarks}}</u-td>
							<u-td class="u-td setHeight">{{item.sbon_time}}</u-td>
						</u-tr>
					</u-table>
		</u-collapse-item>
		<u-collapse-item class="bg-white" title="课堂缺勤情况">
					<u-table>
						<u-tr class="u-tr">
							<u-th class="u-th setHeight2">编号</u-th>
							<u-th class="u-th setHeight2">事件</u-th>
							<u-th class="u-th setHeight2">处理方式</u-th>
							<u-th class="u-th setHeight2">添加时间</u-th>
						</u-tr>
						<u-tr class="u-tr" v-for="(item,index) in absenceList">
							<u-td class="u-td setHeight">{{index+1}}</u-td>
							<u-td class="u-td setHeight">缺勤</u-td>
							<u-td class="u-td setHeight">{{item.sabs_remarks}}</u-td>
							<u-td class="u-td setHeight">{{item.sabs_time}}</u-td>
						</u-tr>
					</u-table>
		</u-collapse-item>
		</u-collapse >
		<!-- 弹窗判断是否要添加缺勤事件 -->
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">是否添加缺勤事件</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<u-field v-model="tip" type="number"placeholder="备注:" >
					</u-field>
				</view>
				<view class="flex solid-bottom padding justify-around">
						<view >
							<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						</view>
						<view >
							<button class="cu-btn bg-green margin-left" @tap="AddAbsence">确定</button>
						</view>
				</view>
				
			</view>
		</view>
		<!-- 弹窗判断加分数值 -->
		<view class="cu-modal" :class="modalName=='DialogModal2'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">加分</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<u-field v-model="tip" type="number"placeholder="备注:" >
					</u-field>
				</view>
				<view class="flex cu-bar bg-white justify-around">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="AddBonus">确定</button>
		
					</view>
				</view>
			</view>
		</view>
		
		<!-- 弹窗选择删除事件 -->
		<view class="cu-modal" :class="modalName=='DialogModal3'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">删除事件</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="flex cu-bar bg-white justify-around">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="GetBonus">删除加分</button>
						<button class="cu-btn bg-green margin-left" @tap="GetAbsence">删除缺勤</button>
		
					</view>
				</view>
			</view>
		</view>
		<!-- 老师选择删除的加分事件 -->
		<view class="cu-modal " :class="modalName=='RadioModal1'?'show':''" @tap="hideModal()">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white justify-end">
					<view class="content">选择加分事件</view>
					<view class="action" @click="hideModal()">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<scroll-view class="tightSize" scroll-y="true" :style="{height:auto}">
					<checkbox-group class="block" @change="CheckboxChange">
						<view class="cu-item " v-for="(item,index) in bonusList" :key="index">
							<view class="content cu-form-group">
								<checkbox :class="radio==index?'checked':''" :checked="radio==index?true:false"
									:value="index"></checkbox>
								<view class="margin-right">序号: {{index+1}}</view>
								<view class="margin-right">备注: {{item.sbon_remarks}}</view>
							</view>
		
						</view>
					</checkbox-group>
				</scroll-view>
				<view class="cu-bar bg-white solids-top margin-top margin-bottom justify-between">
					<view>
						<button class="cu-btn line-green text-green margin-left" @click="hideModal()">取消</button>
					</view>
					<view>
						<button class="cu-btn bg-green margin-right" @click="DeleteBonus">删除</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 老师选择删除的缺勤事件 -->
		<view class="cu-modal " :class="modalName=='RadioModal2'?'show':''" @tap="hideModal()">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white justify-end">
					<view class="content">选择缺勤事件</view>
					<view class="action" @click="hideModal()">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<scroll-view class="tightSize" scroll-y="true" :style="{height:auto}">
					<checkbox-group class="block" @change="CheckboxChange">
						<view class="cu-item " v-for="(item,index) in absenceList" :key="index">
							<view class="content cu-form-group">
								<checkbox :class="radio==index?'checked':''" :checked="radio==index?true:false"
									:value="index"></checkbox>
								<view class="margin-right">序号: {{index+1}}</view>
								<view class="margin-right">备注: {{item.sabs_remarks}}</view>
							</view>
		
						</view>
					</checkbox-group>
				</scroll-view>
				<view class="cu-bar bg-white solids-top margin-top margin-bottom justify-between">
					<view>
						<button class="cu-btn line-green text-green margin-left" @click="hideModal()">取消</button>
					</view>
					<view>
						<button class="cu-btn bg-green margin-right" @click="DeleteAbsence()">删除</button>
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
				modalName:null,
				tip:"",
				// 加分情况
				bonusList:[],
				// 缺勤情况
				absenceList:[],
				classId:0,
				studentId:0,
				createTime:"",
				radio:-1,
				View:true,
				chociedthing:[],
			}
		},
		onLoad:function(options){
			this.classId=options.classId
			this.studentId=options.studentId
		},
		onShow(){
			this.GetData()
		},
		methods: {
			// 选择删除的事件
			CheckboxChange(e) {
				console.log("触发了CheckboxChange函数，传入的多选择正确答案", e.detail.value)
				this.chociedthing = e.detail.value
				
				console.log("传输完成的选择班级数组为", this.chociedthing)
			},
			// 获取其删除加分的事件
			GetBonus(){
				this.hideModal()
				this.modalName="RadioModal1"
			},
			// 获取其删除缺勤的事件
			GetAbsence(){
				this.hideModal()
				this.modalName="RadioModal2"
			},
			//删除加分事件
			DeleteBonus(){
				for(let i=0 ;i<this.chociedthing.length;i++){
					let a = {
						classId: this.classId,
						studentId:this.studentId,
						time:this.bonusList[Number(this.chociedthing[i])].sbon_time,
					}
					console.log("参数正在传递" ,a)
					//获取学生的作业平均分和资料平均分
					this.$Request.postRequest(this.$url.GATHER.classDeleteMemberBonus, a).then(res => {
						if(res.code==0){
							this.hideModal()
							this.GetData()
							uni.showToast({
							    // 弹出框的标题
							    title: '删除成功!',
							    // 弹出框的图标，不想设置图标时请给none
							    icon: 'none',
								duration:500,
							})
						}else{
							this.hideModal()
							uni.showToast({
							    // 弹出框的标题
							    title: '删除失败!',
							    // 弹出框的图标，不想设置图标时请给none
							    icon: 'none',
								duration:500,
							})
						}
					}).catch(err => {
						console.log('出错了，错误是', err);
					})
				}
				
			},
			//删除缺勤事件
			DeleteAbsence(){
				for(let i=0;i<this.chociedthing.length;i++)
				{
				let a = {
					classId: this.classId,
					studentId:this.studentId,
					time:this.absenceList[Number(this.chociedthing[i])].sabs_time,
				}
				console.log("参数正在传递" ,a)
				//获取学生的作业平均分和资料平均分
				this.$Request.postRequest(this.$url.GATHER.classDeleteMemberAbsence, a).then(res => {
					if(res.code==0){
						this.hideModal()
						this.GetData()
						uni.showToast({
						    // 弹出框的标题
						    title: '创建成功!',
						    // 弹出框的图标，不想设置图标时请给none
						    icon: 'none',
							duration:500,
						})
					}else{
						this.hideModal()
						uni.showToast({
						    // 弹出框的标题
						    title: '创建失败!',
						    // 弹出框的图标，不想设置图标时请给none
						    icon: 'none',
							duration:500,
						})
					}
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
				}
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
				this.tip=""
			},
			AddAbsence(){
				let t = new Date()
				this.createTime = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() +
					":" + t.getMinutes() + ":" + t.getSeconds()
				let a = {
					classId: this.classId,
					studentId:this.studentId,
					time:this.createTime,
					remarks:this.tip
				}
				console.log("参数正在传递" ,a)
				//获取学生的作业平均分和资料平均分
				this.$Request.postRequest(this.$url.GATHER.classCreateMemberAbsence, a).then(res => {
					console.log("添加缺勤的返回值",res)
					if(res.code==0){
						this.hideModal()
						this.GetData()
						uni.showToast({
						    // 弹出框的标题
						    title: '创建成功!',
						    // 弹出框的图标，不想设置图标时请给none
						    icon: 'none',
							duration:500,
						})
					}else{
						this.hideModal()
						uni.showToast({
						    // 弹出框的标题
						    title: '创建失败!',
						    // 弹出框的图标，不想设置图标时请给none
						    icon: 'none',
							duration:500,
						})
					}
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
			},
			Show(){
				this.View=false
				setTimeout(() => {
					this.View = true
				}, 0.01)
			},
			AddBonus(){
				let t = new Date()
				this.createTime = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() +
					":" + t.getMinutes() + ":" + t.getSeconds()
				let a = {
					classId: this.classId,
					studentId:this.studentId,
					time:this.createTime,
					remarks:this.tip
				}
				console.log("参数正在传递" ,a)
				//获取学生的作业平均分和资料平均分
				this.$Request.postRequest(this.$url.GATHER.classCreateMemberBonus, a).then(res => {
					console.log("添加加分的返回值",res)
					if(res.code==0){
							this.hideModal()
							this.GetData()
							uni.showToast({
							    // 弹出框的标题
							    title: '添加成功!',
							    // 弹出框的图标，不想设置图标时请给none
							    icon: 'none',
								duration:500,
							})
					}else{
						this.hideModal()
							uni.showToast({
							    // 弹出框的标题
							    title: '创建失败!',
							    // 弹出框的图标，不想设置图标时请给none
							    icon: 'none',
								duration:500,
							})
					}
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
			},
			GetData(){
				this.bonusList=[]
				this.absenceList=[]
				let a = {
					classId: this.classId,
					studentId:this.studentId,
				}
				console.log("班级编号参数正在传递" ,a)
				//获取学生的作业平均分和资料平均分
				this.$Request.getRequest(this.$url.GATHER.classCheckMemberBonus, a).then(res => {
					console.log('服务器返回的班级成员加分', res.result);
					this.bonusList=this.bonusList.concat(res.result)
					console.log("接收到的班级成员加分", this.bonusList)
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
				this.$Request.getRequest(this.$url.GATHER.classCheckMemberAbsence, a).then(res => {
					console.log('服务器返回的班级成员缺勤', res.result);
					this.absenceList=this.absenceList.concat(res.result)
					console.log("接收到的班级成员缺勤", this.absenceList)
				}).catch(err => {
					console.log('出错了，错误是', err);
				})
			}
		}
		
	}
	
</script>

<style>
	.setHeight{
		height: 150rpx;
	}
	.setHeight2{
		height: 50rpx;
	}
	.tightSize {
		width: auto;
		height: 450rpx
	}
</style>
