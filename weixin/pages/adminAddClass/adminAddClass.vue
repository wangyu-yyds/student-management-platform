<template>
	<view>
		<view class="padding bg-white text1 text-bold">
			<u-field v-model="nameClass" label="班级名:" :label-style="{'font-size':'35rpx'}" placeholder="请填写班级名"
				clear-size="50rpx"></u-field>
			<view v-if="classNameTip" class="bg-white text-red text-bold text-center text-lg">班级名称不能为空！</view>
		</view>

		<view class="flex padding bg-white justify-around butbox">
			<u-button class="buttons" type="primary" :ripple="true" shape="circle" size="medium" @click="CreateClass">
				创建班级</u-button>
			<u-button class="buttons" type="primary" :ripple="true" shape="circle" size="medium" @click="Cancel">
				取消创建</u-button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				//班级名
				nameClass:"",
				//课程编号
				courseId:0,
				//未填写班级名称时，显示提示信息
				classNameTip:false,
			}
		},
		onLoad:function(options){
			this.courseId=options.courseId
			uni.setNavigationBarTitle({
							title:this.$global.vxUser.coursename
						})
		},
		methods: {
			//创建班级
			CreateClass(){
				if(this.nameClass==""){
					this.classNameTip=true
					return
				}else{
					this.classNameTip=false
				}
				let a = {
					courseId:this.courseId,
					className:this.nameClass
				}
				console.log("传入的数据a",a)
				this.$Request.getRequest(this.$url.GATHER.createClass, a).then(res => {
					console.log('服务器返回列表', res);
					// console.log('服务器返回列表', res.result);
					uni.navigateBack()
				}).catch(err => {
					console.log('出错了，错误是：', err);
				})
			},
			Cancel(){
				this.nameClass=""
				this.numberClass=0
			}
		}
	}
</script>

<style>

</style>
