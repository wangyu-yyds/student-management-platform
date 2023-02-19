<!-- 创建文件：Classitem.vue 创建时间： 2022.1.16_17:22 创建人：张煜林 -->

<template>
	<view class="home">

		<u-tabs-swiper ref="tabs" :list="tablist" :current="current" name="cate_name" count="cate_count" height="100"
			font-size="40" bar-width="80" bar-height="12" @change="tabsChange" :is-scroll="false" swiperWidth="750">
		</u-tabs-swiper>

		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<view class="scroll">
					<scroll-view class="scrolllist" scroll-y="true" :refresher-enabled='refresherEnabled'
						@refresherpulling="OnPulling" @refresherrefresh="OnRefresh" @refresherrestore="OnRestore"
						@refresherabort="OnAbort" :refresher-triggered="triggered" @scrolltolower="onbottom"
						@scroll='Roll' refresher-background="#f0f0f0">
						<u-cell-group v-for="(item,index) in sortList" :key="index">
							<u-cell-item @long="Langtap(item)" :title-style="{'font-size':'40rpx'}"
								:label-style="{'font-size':'30rpx'}" :icon="typeicon" iconSize="65" :title="item.title"
								:label="Label(item)" :arrow="false" @click="Clickitem(item)">
								<u-badge v-show="Isopen(item)" :is-dot="true" type="error" slot="right-icon"
									:absolute="false">
								</u-badge>
							</u-cell-item>
						</u-cell-group>
						<view class="none" v-show="isexist">
							<view class="nonetext">当前没有内容</view>
						</view>
						<view class="bottombox" v-show="isbottom">
							<view class="bottomtext">没有更多了</view>
							<view class="bottomtext">----------------</view>
						</view>
					</scroll-view>
					<button class="pos cu-btn shadow bg-gradual-blue" v-if="showhistory" @tap="ShowModalright"
						data-target="DrawerModalR">历史通知</button>
				</view>
			</swiper-item>

			<swiper-item class="swiper-item">
				<view class="scroll">
					<scroll-view class="scrolllist" scroll-y="true" :refresher-enabled='refresherEnabled'
						@refresherpulling="OnPulling" @refresherrefresh="OnRefresh" @refresherrestore="OnRestore"
						@refresherabort="OnAbort" :refresher-triggered="triggered" @scrolltolower="onbottom"
						@scroll='Roll' refresher-background="#f0f0f0">
						<u-cell-group v-for="(item,index) in sortList" :key="index">
							<u-cell-item @long="Langtap(item)" :title-style="{'font-size':'40rpx'}"
								:label-style="{'font-size':'30rpx'}" :icon="typeicon" iconSize="65" :title="item.title"
								:label="Label(item)" :arrow="false" @click="Clickitem(item)">
								<u-badge v-show="Isopen(item)" :is-dot="true" type="error" slot="right-icon"
									:absolute="false">
								</u-badge>
							</u-cell-item>
						</u-cell-group>
						<view class="none" v-show="isexist">
							<view class="nonetext">当前没有内容</view>
						</view>
						<view class="bottombox" v-show="isbottom">
							<view class="bottomtext">没有更多了</view>
							<view class="bottomtext">----------------</view>
						</view>
					</scroll-view>
				</view>
			</swiper-item>

			<swiper-item class="swiper-item">
				<view class="scroll">
					<scroll-view class="scrolllist" scroll-y="true" :refresher-enabled='refresherEnabled'
						@refresherpulling="OnPulling" @refresherrefresh="OnRefresh" @refresherrestore="OnRestore"
						@refresherabort="OnAbort" :refresher-triggered="triggered" @scrolltolower="onbottom"
						@scroll='Roll' refresher-background="#f0f0f0">
						<u-cell-group v-for="(item,index) in sortList" :key="index">
							<u-cell-item @long="Langtap(item)" :title-style="{'font-size':'40rpx'}"
								:label-style="{'font-size':'30rpx'}" :icon="typeicon" iconSize="65" :title="item.title"
								:label="Label(item)" :arrow="false" @click="Clickitem(item)">
								<u-badge v-show="Isopen(item)" :is-dot="true" type="error" slot="right-icon"
									:absolute="false">
								</u-badge>
							</u-cell-item>
						</u-cell-group>
						<view class="none" v-show="isexist">
							<view class="nonetext">当前没有内容</view>
						</view>
						<view class="bottombox" v-show="isbottom">
							<view class="bottomtext">没有更多了</view>
							<view class="bottomtext">----------------</view>
						</view>
					</scroll-view>
				</view>
			</swiper-item>

		</swiper>

		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green modalfont" @tap="Deleteinfor">确定</view>
					<view class="action text-blue modalfont" @tap="HideModal">取消</view>
				</view>
				<view class="modalfont text1">
					删除该通知？
				</view>
				<view class="modalfont text2">
					(删除的通知仅能保留七天，谨慎操作)
				</view>
			</view>
		</view>

		<view class="cu-modal drawer-modal justify-end" :class="modalName=='DrawerModalR'?'show':''"
			@tap="HideModalright">
			<view class="cu-si basis-lg" @tap.stop=""
				:style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
				<view class="cu-list menu text-left">
					<view class="cu-item arrow" v-for="(item,index) in historyinfor" :key="index">
						<view class="content" @tap="Historyitem(item)">
							<view class="historyitem">{{item.title}}</view>
						</view>
					</view>

					<view class="textbottom">{{textbottom}}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的

				tablist: [{
					cate_name: '通知',
					cate_count: ''
				}, {
					cate_name: '资料',
					cate_count: ''
				}, {
					cate_name: '测试',
					cate_count: ''
				}],
				sortList: [],
				typeList: [
					[],
					[],
					[]
				],
				textbottom: '', //历史消息下提示
				historyinfor: [], //历史通知
				typeicon: '', //图标
				refresherEnabled: true, //开启自定义下拉刷新
				triggered: false, //设置当前下拉刷新的状态
				isopen: true, //item是否打开
				date: '', //item的日期
				navName: '', //导航栏名称
				modalName: null,
				longitem: '', //长按的item
				CustomBar: this.CustomBar,
				showhistory: null, //底部历史通知
				isbottom: false, //是否到达底部
				params: { //课程内容参数，包括tel(用户电话),classid(课程的编号)
					tel: this.$global.openid,
				},
				time: {}, //当前时间
				isexist: false,
				classid: -1,		//当前班级班级id
			}
		},

		onLoad(option) {
			console.log("page onload");
			let classitem = JSON.parse(option.index);
			console.log('传递的对象', classitem);
			this.classid = classitem.classNum;
			this.Getdate();
			this.GetClassitem();
			this.navName = classitem.courseName;
			this.params.classid = classitem.classNum;
			
		},

		onShow() {
			console.log("page onshow");
			this.$global.client.on('message', (theme, payload) => {
				console.log('接收来自!!!', theme, '主题的消息', payload.toString());
				let msg = JSON.parse(payload.toString());
				console.log('转换后', msg);
				this.Deal(msg);
			})
			
		},
		
		onHide() {
			console.log('page onHide');
			// this.$mqtt.Disconnect();
		},

		methods: {
			async Deal(msg) {
				let theme = 'class' + this.classid;
				if (msg.code == 1 && msg.content == 1 && msg.topic == theme) {
					if (msg.type == 'message' || msg.type == 'test' || msg.type == 'means') {

						if (this.swiperCurrent == 0) {
							this.historyinfor = [];
							await this.Getinformationlist(true);
							this.Updata(this.typeList);
						}
						if (this.swiperCurrent == 1) {
							await this.Getmeanslist(true);
							this.Updata(this.typeList);
						}
						if (this.swiperCurrent == 2) {
							await this.Gettasklist(true);
							this.Updata(this.typeList);
						}
						console.log('输出triggered->', this.triggered);
					}
				}
			},
			
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.tabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				this.tabsChange(this.current);
			},

			ShowModal(e) {
				// this.modalName = e.currentTarget.dataset.target;
				this.modalName = 'bottomModal';
			},

			ShowModalright() {
				this.modalName = 'DrawerModalR';
				// console.log('输出历史通知：',this.historyinfor);
				if (this.historyinfor.length == 0) {
					this.textbottom = '当前没有内容';
				} else {
					this.textbottom = '';
				}
			},

			HideModal(e) {
				this.modalName = null;
			},

			HideModalright() {
				this.modalName = null;
			},

			// tabs切换
			tabsChange(index) {
				this.swiperCurrent = index;
				// this.current = index;
				for (let i = 0; i < this.typeList.length; i++) {
					if (i == index) {
						this.sortList = this.typeList[i];
						break;
					}
				}
				if (this.swiperCurrent == 0) {
					this.typeicon = 'chat';
					this.showhistory = true;
				} else if (this.swiperCurrent == 1) {
					this.typeicon = 'bookmark';
					this.showhistory = false;
				} else if (this.swiperCurrent == 2) {
					this.typeicon = 'order';
					this.showhistory = false;
				}
				if (this.sortList.length == 0) {
					this.isexist = true;
				} else {
					this.isexist = false;
				}
				console.log('图标', this.typeicon);
			},

			async GetClassitem(flag) { //获取班级内容信息

				await this.Getinformationlist();
				await this.Getmeanslist();
				await this.Gettasklist();

				// let params = {
				// 	tel: '11112222333', //用户电话
				// 	classid: '1', //班级id
				// };	

				// console.log('课程里的所有内容：', this.typeList);
				this.Updata(this.typeList);
				// console.log('打印历史通知去重->', this.historyinfor);
				// console.log('getclass中的trigger第一次', this.triggered);
				if (flag) {
					this.triggered = false;
				}
				if (this.sortList.length == 0) {
					this.isexist = true;
				} else {
					this.isexist = false;
				}
				// console.log('getclass中的trigger第二次', this.triggered);
			},

			async Getinformationlist(flag) { //获取通知列表
				let tag = 0;
				await this.$Request.getRequest(this.$url.GATHER.getinformationlist, this.params).then(res => {
					console.log('服务器返回通知列表', res);
					if (res.code == 0) {
						tag = 1;
						this.typeList[0] = res.informationlist;
						let tmplist = res.informationlist;
						for (let i = tmplist.length - 1; i >= 0; i--) {
							if (tmplist[i].delestate == 1) {
								this.historyinfor.push(tmplist[i]);
								tmplist.splice(i, 1);
							}
						}
						this.typeList[0] = tmplist;
						for (let i = 0; i < this.historyinfor.length; i++) {
							for (let j = i + 1; j < this.historyinfor.length; j++) {
								if (this.historyinfor[i].informNum == this.historyinfor[j].informNum) {
									this.historyinfor.splice(j, 1);
									j--;
								}
							}
						}
						
					}
					if(res.code == -1) {
						uni.showToast({
							icon: 'none',
							title: '请求失败',
							duration: 500,
						})
					}
					if(res.code == -1) {
						uni.showToast({
							icon: 'none',
							title: '请求失败',
							duration: 500,
						})
					}

				}).catch(err => {
					console.log('222', err);
				});

				if(tag == 1) {
					this.Sortlist(this.typeList[0]);
					this.Sortlist(this.historyinfor);
				}
				
				if (flag) {
					this.triggered = false;
				}
				
			},

			async Getmeanslist(flag) { //获取资料列表
				let tag = 0;
				await this.$Request.getRequest(this.$url.GATHER.getmeanslist, this.params).then(res => {
					console.log('服务器返回资料列表', res);
					if (res.code == 0) {
						tag = 1;
						this.typeList[1] = res.meanslist;
					}
					if(res.code == -1) {
						uni.showToast({
							icon: 'none',
							title: '请求失败',
							duration: 500,
						})
					}
				}).catch(err => {
					console.log('222', err);
				});
				
				if(tag == 1) {
					this.Sortlist(this.typeList[1]);
				}
				
				if (flag) {
					this.triggered = false;
				}
				
			},


			async Gettasklist(flag) { //获取测试列表
				let tag = 0;
				await this.$Request.getRequest(this.$url.GATHER.gettasklist, this.params).then(res => {
					console.log('服务器返回测试列表', res);
					if (res.code == 0) {
						tag = 1;
						this.typeList[2] = res.taskList;
						console.log('进来了');
					} 
					if(res.code == -1) {
						uni.showToast({
							icon: 'none',
							title: '请求失败',
							duration: 500,
						})
					}
				}).catch(err => {
					console.log('222', err);
				});
				
				if(tag == 1) {
					this.Sortlist(this.typeList[2]);
				}
				
				if (flag) {
					this.triggered = false;
				}
				
			},

			Sortlist(list) { //对各个列表进行按时间排序
				if(list == false) {
					return;
				}
				// console.log('打印传递xx列表j->', list);
				if ('startDate' in list[0]) {
					for (let i = 0; i < list.length - 1; i++) {
						for (let j = 0; j < list.length - 1 - i; j++) {
							let tmp1 = new Date(Date.parse(list[j].startDate));
							let tmp2 = new Date(Date.parse(list[j + 1].startDate));
							if (tmp1 < tmp2) {
								let temp = list[j];
								list[j] = list[j + 1];
								list[j + 1] = temp;
							}
						}
					}
				} else if ('startTime' in list[0]) {
					for (let i = 0; i < list.length - 1; i++) {
						for (let j = 0; j < list.length - 1 - i; j++) {
							let tmp1 = new Date(Date.parse(list[j].startTime));
							let tmp2 = new Date(Date.parse(list[j + 1].startTime));
							if (tmp1 < tmp2) {
								let temp = list[j];
								list[j] = list[j + 1];
								list[j + 1] = temp;
							}
						}
					}
				}

				return list;
			},

			Updata(list) { //初次加载通知页面
				uni.setNavigationBarTitle({
					title: this.navName
				})
				console.log("初次加载输出typelist", list);
				console.log(this.current)
				let index = this.current;
				for (let i = 0; i < list.length; i++) {
					if (i == index) {
						this.sortList = list[i];
						console.log("输出sortlist", this.sortList);
						break;
					}
				}
				this.Getdate();
				this.Rendericon();
				this.GetBadge();
				if (this.sortList.length == 0) {
					this.isexist = true;
				}else {
					this.isexist = false;
				}
			},

			Rendericon() { //渲染图标
				if (this.current == 0) {
					this.typeicon = 'chat';
					this.showhistory = true;
				} else if (this.current == 1) {
					this.typeicon = 'bookmark';
				} else {
					this.typeicon = 'order';
				}
			},

			Label(item) { //渲染时间
				if ('startDate' in item) {
					return item.startDate;
				} else if (item.startTime) {
					let date = item.startTime + '-' + item.endTime;
					return date;
				}
			},

			Isopen(item) { //渲染红点
				if (item.state == -1) {
					return true;
				} else if (item.readCounter == 0) {
					return true;
				} else if (item.grade == -1) {
					return true;
				}
			},

			GetBadge() { //获取徽标数
				let ntreadlist = this.typeList[0];
				let atreadlist = this.typeList[1];
				let ttreadlist = this.typeList[2];
				let ntread = 0;
				let atread = 0;
				let ttread = 0;
				if (ntreadlist.length != 0) {
					for (let i = 0; i < ntreadlist.length; i++) {
						if (ntreadlist[i].state == -1) {
							ntread++;
						}
					}
				}
				if (atreadlist.length != 0) {
					for (let i = 0; i < atreadlist.length; i++) {
						if (atreadlist[i].readCounter == 0) {
							atread++;
						}
					}
				}
				if (ttreadlist.length != 0) {
					for (let i = 0; i < ttreadlist.length; i++) {
						if (ttreadlist[i].grade == -1) {
							ttread++;
						}
					}
				}
				this.tablist[0].cate_count = ntread;
				this.tablist[1].cate_count = atread;
				this.tablist[2].cate_count = ttread;
			},

			Getdate() { //获取当前时间
				let date = new Date(),
					year = date.getFullYear(), //年
					month = date.getMonth() + 1, //月
					day = date.getDate(), //日
					hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(), //时
					minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(), //分
					second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //秒
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				this.time = date;
				let now = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
			},

			Isexist(item) { //测试是否再时段内，返回true/false
				let startdate = new Date(Date.parse(item.startTime));
				let enddate = new Date(Date.parse(item.endTime));
				console.log('开始时间', startdate);
				console.log('结束时间', enddate);
				if (this.time >= startdate && this.time <= enddate) {
					return 1;
				} else {
					return 0;
				}

			},

			Clickitem(res) { //单击事件
				console.log('点击单个item', res);
				let urlto = '';
				let param = res;
				param.classid = this.classid;
				param.classname = this.navName;
				if ('informNum' in res) {
					console.log('通知的id:', res.informNum);
					let params = JSON.stringify(param);
					urlto = '../Noticeitem/Noticeitem?index=' + params;
				} else if ('meansid' in res) {
					console.log('资料的id:', res.meansid);
					let params = JSON.stringify(param);
					urlto = '../Datumitem/Datumitem?index=' + params;
				} else if (('taskNum' in res) && (res.grade == -1) && this.Isexist(res) == 1) {
					console.log('测试的id:', res.taskNum);
					let params = JSON.stringify(param);
					urlto = '../Testitem/Testitem?index=' + params;
				} else if (('taskNum' in res) && (res.grade != -1)) {
					console.log('做过的测试的id:', res.taskNum);
					let params = JSON.stringify(param);
					urlto = '../Testresult/Testresult?index=' + params;
				} else if (('taskNum' in res) && (res.grade == -1) && this.Isexist(res) == 0) {
					console.log('测试的id:', res.taskNum);
					uni.showToast({
						title: '当前不在开放时段',
						icon: 'none',
						duration: 500
					})
				}
				uni.navigateTo({
					url: urlto
				});
			},

			Langtap(item) { //长按item
				if ('informNum' in item) {
					console.log('长按了', item);
					this.ShowModal(item);
					this.longitem = item;
				} else {
					return;
				}
			},

			Historyitem(item) { //点击历史通知
				console.log('点击历史通知', item);
				let urlto = '';
				let params = {};
				params.classid = this.classid;
				if ('informNum' in item) {
					console.log('通知的id:' + item.informNum);
					let params = JSON.stringify(item);
					urlto = '../Noticeitem/Noticeitem?index=' + params;
				}
				uni.navigateTo({
					url: urlto
				})
			},

			Deleteinfor() { //删除通知
				console.log('删除该课程成功', this.longitem);
				console.log('在删除中打印typeList->', this.typeList[0]);
				let params = {
					tel: this.$global.openid,
					informId: this.longitem.informNum
				}
				console.log('删除的id', this.longitem.informNum);
				this.historyinfor.push(this.longitem);
				this.$Request.postRequest(this.$url.GATHER.stuDeleteInform, params).then(res => {
					console.log('删除', res);
					if (res.code == 0) {
						console.log('历史通知->', this.historyinfor);
						let ntreadlist = this.typeList[0];
						console.log("输出ntreadlist->", ntreadlist);
						let ntread = 0;
						for (let i = 0; i < ntreadlist.length; i++) {
							if (ntreadlist[i].state == -1) {
								ntread++;
							}
						}
						this.tablist[0].cate_count = ntread;
					} else {
						uni.showToast({
							title: '删除失败',
							icon: 'none',
							duration: 500
						})
					}
					if (this.sortList.length == 0) {
						this.isexist = true;
					} else {
						this.isexist = false;
					}
				}).catch(err => {
					console.log('删除失败', err);
				});
				for (let i = 0; i < this.sortList.length; i++) {
					if (this.longitem == this.sortList[i]) {
						this.sortList.splice(i, 1);
					}
				}
				console.log('输出历史通知', this.historyinfor);
				this.HideModal();
			},

			OnPulling(e) { //自定义下拉刷新控件被下拉
				// console.log("onpulling");
			},

			async OnRefresh(e) { //自定义下拉刷新被触发
				//调用获取数据的函数
				console.log('下拉刷新触发');
				this.triggered = true;
				// this.GetClassitem(true);
				if (this.swiperCurrent == 0) {
					this.historyinfor = [];
					await this.Getinformationlist(true);
					this.Updata(this.typeList);
				}
				if (this.swiperCurrent == 1) {
					await this.Getmeanslist(true);
					this.Updata(this.typeList);
				}
				if (this.swiperCurrent == 2) {
					await this.Gettasklist(true);
					this.Updata(this.typeList);
				}
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
			},

			onbottom() {
				console.log("到底了");
				this.isbottom = true;
			},

			MqttSubscribe() { //mqtt订阅主题
				let classNum = `class${this.classid}`;
				console.log('订阅主题', classNum);
				this.$mqtt.Subscribe(classNum);
			},

			MqttReceivedMessage() { //mqtt主题接收消息
				
			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
		height: 100%;
		display: flex;
	}

	.home {
		display: flex;
		flex-direction: column; //在弹性布局中给纵向排列
		// flex: 1;
		height: calc(100vh - var(--window-top));
		width: 100%;

		.scroll {
			// height: calc(100vh - 190rpx);
			// height: calc(100vh - var(--window-top));
			height: 100%;
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

	.modalfont {
		font-size: 35rpx;
	}

	.bgcolor {
		background-color: #e2e2e2;
	}

	.historyitem {
		font-size: 35rpx;
	}

	.textbottom {
		font-size: 30rpx;
	}

	.pos {
		position: fixed;
		z-index: 10;
		opacity: .7;
		bottom: 0;
		right: 0;
		margin-bottom: 50rpx;
		margin-right: 35rpx;
	}

	.cu-si {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		margin-left: auto;
		width: 680upx;
		max-width: 100%;
		background-color: #f8f8f8;
		border-radius: 10upx;
	}

	.bottombox {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fafafa;
	}

	.bottomtext {
		color: #cacaca;
	}

	.text1 {
		padding-top: 35rpx;
		font-size: 35rpx;
	}

	.text2 {
		font-size: 30rpx;
		padding-bottom: 45rpx;
		color: red;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
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
