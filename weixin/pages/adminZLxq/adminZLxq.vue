<template>
	<view>
		<u-collapse :item-style="itemStyle">		
			<!-- <u-collapse-item title="学生具体阅读情况"> -->
				
					<view class="bg11">
						<u-table>
							<u-tr class="u-tr">
								<u-th class="u-th text1">姓名</u-th>
								<u-th class="u-th text1">学号</u-th>
								<u-th class="u-th text1">阅读次数</u-th>
							</u-tr>
							<u-tr class="u-tr"v-for="(item,index) in zlList" :key="index">
								<u-td class="u-td setHeight">{{zlList[index].stu_name}}</u-td>
								<u-td class="u-td setHeight">{{zlList[index].stu_no}}</u-td>
								<u-td class="u-td setHeight">{{zlList[index].dition}}</u-td>
							</u-tr>
						</u-table>
					</view>
					
			<!-- </u-collapse-item> -->
		</u-collapse>		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				itemStyle:{
					marginTop:'5rpx',
					background: '#ffffff',
					paddingLeft:'10rpx'
				},
				modalName: null,
				gridCol: 3,
				gridBorder: false,
				menuBorder: false,
				menuArrow: false,
				menuCard: false,
				skin: false,
				listTouchStart: 0,
				listTouchDirection: null,
				// 班级Id
				classId:0,
				// 资料Id
				zlId:0,
				// 本地资料列表
				zlList:[],
			}
		},
		onLoad: function(options) {
			// 该班级的编号
			console.log("这是资料详情页")
			this.classId = options.classId
			this.zlId=options.zlId
			console.log(this.classId,this.zlId)
			// 向服务器请求该课程列表数据
			let a={classId: this.classId,meansId:this.zlId, }
			console.log("班级编号参数正在传递zdfhgbxfh",a)
			this.$Request.getRequest(this.$url.GATHER.classMeansCondition,a).then(res =>{
				console.log('服务器返回的班级作业列表',res);
				this.zlList=this.zlList.concat(res.result)
				// let array = res.result;			
				// for( var i = 0; i < array.length; i++ ){
				// 	this.textList = array;
				// }
				console.log("接收到资料列表",this.zlList)
				this.ChangNull();
			}).catch(err => {
				console.log('222',err);
			})
			
		},
		methods: {
			// 将数组中为null的部分变为未读
			ChangNull(){
				for(let i=0;i<this.zlList.length;i++)
				{
					if(this.zlList[i].dition==null){
						this.zlList[i].dition="未提交"
					}
				}
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			Gridchange(e) {
				this.gridCol = e.detail.value
			},
			Gridswitch(e) {
				this.gridBorder = e.detail.value
			},
			MenuBorder(e) {
				this.menuBorder = e.detail.value
			},
			MenuArrow(e) {
				this.menuArrow = e.detail.value
			},
			MenuCard(e) {
				this.menuCard = e.detail.value
			},
			SwitchSex(e) {
				this.skin = e.detail.value
			},
			
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		},
		
	}
</script>

<style>
.text1{
	font-size: 35rpx;
}
.bg11{
	width: 750rpx;
	height: auto;
}
.setHeight{
	height: 60rpx;
}
</style>

