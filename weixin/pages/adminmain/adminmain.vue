<template>
	<view class="home">
		<!-- 所有内容的容器 -->
		<view class="cu-bar header-style solid-bottom ">
			<view class="header">
				<u-icon class="allicon" name="grid" size="55"></u-icon>
				<text class="allclass">全部课程</text>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow" @tap="AddCourse" data-target="DialogModal1">+ 创建课程</button>
			</view>
		</view>


		<view class="scroll">
			<scroll-view class="scrolllist" scroll-y="true" :refresher-enabled='refresherEnabled'
				@refresherpulling="OnPulling" @refresherrefresh="OnRefresh" @refresherrestore="OnRestore"
				@refresherabort="OnAbort" :refresher-triggered="triggered" @scrolltolower="onbottom" @scroll='Roll'
				refresher-background="#f0f0f0">
				<view class="courselist" v-if="exist">
					<u-cell-group @longpress="Langtap(index)" v-for="(item,index) in classList" :key="index">
						<u-swipe-action class=" bg-white" @click="EditCourse(item.cou_id)" @open="open" :options="options">
							<u-cell-item 
							iconSize="100"
							:icon-style="{'overflow':'hidden',
								'width':'100rpx',
								'height':'100rpx',
								'border':'2rpx solid rgb(193,193,193)',
								'border-radius':'20rpx'}" 
							:icon="item.cou_picture" size="40" :title="item.cou_name" :title-style="{'font-size':'40rpx'}"
							:label-style="{'font-size':'30rpx'}" :label="item.cou_id" :value="item.cou_existtime"
							@click="Clickitem(item.cou_id,item.cou_name)"></u-cell-item>
						</u-swipe-action>
					</u-cell-group>
				</view>

				<view class="none" v-if="isexist">
					<view class="nonetext">当前没有内容</view>
				</view>
			</scroll-view>
		</view>
		<!-- 长按删除课程-->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green modalfont" @tap="Delete()">确定</view>
					<view class="action text-blue modalfont" @tap="HideModal()">取消</view>
				</view>
				<view class="modalfont bg-white padding text-lg">
					确认删除该课程？
				</view>
			</view>
		</view>

		<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
		<u-tabbar v-model="current" active-color="#1E90FF" :height="tabbarheight" :list="list"></u-tabbar>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						pagePath: '/pages/adminmain/adminmain',
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '主页',
						//count: 23,
						isDot: false,
						customIcon: false,
					},
					{
						pagePath: '/pages/adminRelease/adminRelease',
						iconPath: "plus-circle",
						selectedIconPath: "plus-circle-fill",
						text: '发布',
						//count: 23,
						isDot: false,
						customIcon: false,
					},
					{
						pagePath: '/pages/adminhome/adminhome',
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的',
						//count: 23,
						isDot: false,
						customIcon: false,
					}
				],
				options: [{
					text: '修改',
					style: {
						backgroundColor: '#007aff'
					}
				}],
				current: 0,
				idclass: this.idclass,
				modalName: null,
				errorMessage: '',
				// 教师端课程列表
				classList: [],
				// 删除课程的索引
				deleteIndex: 0,
				refresherEnabled: false, //开启自定义下拉刷新
				triggered: false, //设置当前下拉刷新的状态
				tabbarheight: '50px', //宽屏动态改变tabbar高度
				exist: true,
				isexist: false,
				refresherEnabled: true, //开启自定义下拉刷新
				triggered: false, //设置当前下拉刷新的状态
			}
		},

		onShow: function() {
			this.Iswidthscreen()
			this.GetData()
		},

		methods: {
			// 编辑课程
			EditCourse(courseid){
				this.$global.vxUser.courseId = courseid
				uni.navigateTo({
					url:'../adminEditCourseMessage/adminEditCourseMessage'
				})
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},
			// 长按删除
			Langtap(index) { //长按item
				this.deleteIndex = index
				this.ShowModal();
			},
			// 显示删除课程弹窗
			ShowModal() {
				// this.modalName = e.currentTarget.dataset.target;
				this.modalName = 'bottomModal';
			},
			// 删除课程
			Delete() {
				let a = {
					courseId: this.classList[this.deleteIndex].cou_id,
				}
				this.$Request.getRequest(this.$url.GATHER.deleteCourse, a).then(res => {
					this.HideModal()
					this.GetData()
				}).catch(err => {
					console.log('出错了，错误是', err);
				})

			},
			// 跳转至添加课程页面
			AddCourse() {
				uni.navigateTo({
					url: '../adminAddCourse/adminAddCourse'
				})
			},
			HideModal() {
				this.modalName = null
			},
			Isexist() { //课程是否有内容
				if (this.classList.length == 0) {
					this.isexist = true;
					this.exist = false;
				} else {
					this.isexist = false;
					this.exist = true;
				}
			},
			Addclass() {
				var id = this.idclass; //获取输入框里的课程号
				var classlist = this.classList; ///获取已存在课程的课程数组
				console.log(id);
				console.log(classlist);
				for (var i in classlist) {
					if (id == classlist[i].classid) {
						this.errorMessage = '课程已存在或未填写,请重新输入'
						console.log("课程已存在");
						break;
					} else {
						//发送请求，先查询课程库中是否存在该课程
						//若存在，添加课程，并返回添加课程后的该用户所有课程表
						//若不存在：this.errorMessage = '请输入正确课程号'
						this.modalName = null;
						console.log("添加课程");
					}
				}
			},
			GetData() { //获取当前用户课程
				this.classList = []
				let a = {
					phone: this.$global.openid
				}
				console.log("传输数据",a)
				this.$Request.getRequest(this.$url.GATHER.getAllcourse, a).then(res => {
					console.log('服务器返回课程是', res)
					if (res.code == 0) {
						let array = res.result;
						for (var i = 0; i < array.length; i++) {
							this.classList = array;
						}
						this.triggered = false
						uni.showToast({
							icon: 'none',
							title: '获取课程成功',
							duration: 500,
						})
					} else {
						this.triggered = false
						uni.showToast({
							icon: 'none',
							title: '当前没有课程',
							duration: 500,
						})
						this.Isexist();
					}

				}).catch(err => {
					console.log('出错了，错误是:', err);
					uni.stopPullDownRefresh();
					uni.showToast({
						icon: 'error',
						title: '获取课程失败'
					})
				})
			},
			Clickitem(courseid,coursename) { //进入课程
				this.$global.vxUser.courseId = courseid
				console.log("储存的课程名称",coursename)
				this.$global.vxUser.coursename=coursename
				uni.navigateTo({
					url: '../adminKeC/adminKeC'
				})
			},

			Iswidthscreen() { //是否为宽屏
				let screenwidth = 0;
				uni.getSystemInfo({
					success: (res => {
						console.log('设备品牌和设备型号', res.brand, ' - ', res.model)
						console.log('屏幕宽度', res.screenWidth);
						console.log('可使用屏幕宽度', res.windowWidth);
						screenwidth = res.screenWidth;
					})
				});
				let height = screenwidth * 0.12 + 3;
				this.tabbarheight = JSON.stringify(parseInt(height)) + 'px';
				console.log('最终高度', this.tabbarheight);
			},

			OnPulling(e) { //自定义下拉刷新控件被下拉
				// console.log("onpulling");
			},

			OnRefresh(e) { //自定义下拉刷新被触发
				//调用获取数据的函数
				console.log('下拉刷新触发');
				this.triggered = true;
				this.GetData(true);
				console.log('输出triggered->', this.triggered);
			},

			OnRestore() { //自定义下拉刷新被复位
				// console.log("执行复位")
				this.triggered = false;
			},

			OnAbort() { //自定义下拉刷新被中止
				console.log("中断")
				this.triggered = false
			},

			Roll(res) { // 获取滚动距离
				if (res.target.scrollTop >= 20) {
					this.refresherEnabled = false
				} else {
					this.refresherEnabled = true
				};
				console.log('距离顶部', res.target.scrollTop);
				if (res.target.scrollTop <= 10) {
					this.isbottom = false;
				}
			}
		}

	}
</script>

<style scoped lang="scss">
	.home {
		display: flex;
		flex-direction: column; //在弹性布局中给纵向排列
		// flex: 1;
		height: calc(100vh - var(--window-top));
		width: 100%;

		.scroll {
			flex: 1;
			overflow: hidden;
			box-sizing: border-box;

			.scrolllist {
				height: 100%;
				display: flex;
				flex-direction: column;
			}
		}
	}


	.header {
		font-size: 35rpx;
	}

	.allicon {
		padding-left: 30rpx;
	}

	.allclass {
		margin-left: 5rpx;
	}

	.header-style {
		background-color: #ffffff;
		height: 120rpx;
		border: 1rpx solid #ffffff;
		border-radius: 5rpx;
	}

	.cell-item {
		background-color: #007AFF;
	}

	.none {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.nonetext {
		font-size: 32rpx;
		color: #ababab;
	}
</style>
