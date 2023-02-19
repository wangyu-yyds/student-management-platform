<template>
	<view class="cu-list menu-avatar">
		<view>
			<view class="bg-white solids text-lg bg11">
				
				<u-table>
					<u-tr class="u-tr ">
						<u-th class="u-th">资料名称</u-th>
						<u-th class="u-th">阅读次数</u-th>
					</u-tr>
					<u-tr font-size="28" class="u-tr"v-for="(item, index) in itemList" :key="index">
						<u-td class="u-td setHeight">{{item.mea_name}}</u-td>
						<u-td class="correct u-td setHeight">{{item.mstu_condition}}</u-td>
					</u-tr>
				</u-table>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				classId:0,
				studentId:0,
				itemList:[],
			}
		},
		onLoad:function(options){
			this.classId=options.classId
			this.studentId=options.studentId
		},
		onShow:function(){
			this.GetData()
		},
		methods: {
			GetData(){
					this.itemList=[]
					let a = {
						classId: this.classId,
						studentId:this.studentId,
					}
					console.log("班级编号参数正在传递" ,a)
					//获取学生的作业平均分和资料平均分
					this.$Request.getRequest(this.$url.GATHER.classStuMeansRead, a).then(res => {
						console.log('服务器返回的学生作业成绩列表', res.result);
						this.itemList=this.itemList.concat(res.result)
						this.Change()
						console.log("接收到的学生作业成绩列表", this.itemList)
					}).catch(err => {
						console.log('出错了，错误是', err);
					})
			},
			Change(){
				for(let i=0;i<this.itemList.length;i++){		
					if(this.itemList[i].mstu_condition==-1||this.itemList[i].mstu_condition==null){
						this.itemList[i].mstu_condition=0
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
	.setHeight{
		height:60rpx
	}
</style>
