<template>
	<view>
		<view class="padding bg-white ">
			
			<u-field maxlength="8" :auto-height="autoHeight" v-model="noticeName"  label="通知名:" :label-style="{'font-size':'35rpx'}"  placeholder="请填写通知名称"
				clear-size="50rpx"></u-field>
			<u-field v-model="noticeAuthor" label="作者:" :label-style="{'font-size':'35rpx'}" placeholder="请填写作者"
				clear-size="50rpx"></u-field>
			<view class="text-black margin-top margin-bottom text1">通知内容:</view>
			<textarea maxlength="-1" :disabled="modalName!=null" :auto-height="autoHeight" class="text1"
				v-model="noticeContent" placeholder="请输入通知内容" name="input"></textarea>
		</view>

		<view class="flex margin-top padding bg-white justify-around butbox">
			<u-button class="buttons" type="primary" :ripple="true" shape="circle" size="medium" @click="CreateNotice">
				创建通知</u-button>
			<u-button class="buttons" type="primary" :ripple="true" shape="circle" size="medium" @click="Cancel">
				取消创建</u-button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeName: "",
				noticeAuthor: "",
				noticeContent: "",
				phone: this.$global.openid,
				createTime: "",
				autoHeight:true
			}
		},
		onShow: function() {
				
		},
		methods: {
			
			//创建新通知
			CreateNotice() {
				//获取时间
				// this.createTime=this.GetTime()
				console.log("获取时间")
				let t = new Date()
				this.createTime = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() +
					":" + t.getMinutes() + ":" + t.getSeconds()
				let a = {
					informName: this.noticeName,
					informAuthor: this.noticeAuthor,
					informContent: this.noticeContent,
					informTime: this.createTime,
					phone: this.phone
				}
				console.log("传入的数据a", a)
				let b = JSON.stringify(a);
				console.log("转化后的a",b)
				// console.log(this.$url.GATHER.createCourse)
				this.$Request.postRequest(this.$url.GATHER.teacherCreateInform,b).then(res => {
					console.log('服务器返回列表1', res);

					if(res.code==0){
						console.log("创建成功!")
						uni.showToast({
						    // 弹出框的标题
						    title: '创建通知成功!',
						    // 弹出框的图标，不想设置图标时请给none
						    icon: 'none',
							duration:500,
						})
							uni.navigateBack()
						}else{
							uni.showToast({
							    // 弹出框的标题
							    title: '创建通知失败!',
							    // 弹出框的图标，不想设置图标时请给none
							    icon: 'none',
								duration:500,
							})
						}
					// console.log('服务器返回列表', res.result);
					
				}).catch(err => {
					console.log('222', err);
				})
			},
		},
		Cancel() {
			noticeName: ""
			noticeAuthor: ""
			noticeContent: ""
			teacherId: ""
			createTime: ""
		}
	}
</script>

<style>
	.text1{
		font-size: 35rpx;
	}
</style>
