<!-- 创建文件：Noticeitem.vue 创建时间： 2022.1.17_20:45 创建人：张煜林 -->

<template>
	<view class="home">
		<view class="content">
			<view class="classname">《{{classna}}》</view>
			<view class="message">
				<view class="teacher">{{teacher}}</view>
				<view class="date">{{date}}</view>
			</view>
			<view class="textcontent">
				<rich-text :nodes="strings"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				teacher: '',
				date: '',
				strings: '',
				informid: '',
				classna:'',
			}
		},
		
		onLoad: function(option) {
			let data = JSON.parse(option.index);
			this.informid = data.informNum;
			console.log('这是参数通知的：', data);
			let params = {
				tel: this.$global.vxUser.tel,
				informId: this.informid,
				classid: data.classid
			};
			this.classna = data.classname;
			uni.setNavigationBarTitle({
				title: data.title
			})
			
			this.$Request.postRequest(this.$url.GATHER.readInform,params).then(res => {
				console.log('阅读成功', res);
				// this.Refresh();
			}).catch(err => {
				console.log('阅读错误', err);
			});
			this.Gettext();
		},
		
		methods: {
			Gettext() { //获取该通知所有内容
				let params = {
					informid: '' //传输的informid
				}
				params.informid = this.informid;
				this.$Request.getRequest(this.$url.GATHER.getinformation, params).then(res => {
					console.log('服务器返回通知内容', res);
					let data = res.infor[0];
					console.log('这是数据' + data.author)
					this.teacher = data.author;
					this.date = data.startTime;
					this.strings = data.informContent;
				}).catch(err => {
					console.log('错误', err);
				})
			},
			
			Refresh() {			//刷新上一页面
				let pages = getCurrentPages();
				let beforepage = pages[pages.length - 2];
				uni.navigateBack({
					success: function() {
						beforepage.onLoad();
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #f6f6f6;
	}
	
	.home {
		width: 100vw;
	}
	
	.content {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}
	
	.classname {
		margin-left: 30rpx;
		margin-top: 10rpx;
		font-size: 40rpx;
	}
	
	.message {
		display: flex;
		flex-direction: row;
		/* width: 100%; */
		/* background-color: blue; */
		margin: 20rpx 40rpx 0 40rpx;
		height: 100rpx;
		border-bottom: #dfdfdf solid 1rpx;
	}

	.textcontent {
		/* width: 100%; */
		/* background-color: blue	; */
		margin-left: 40rpx;
		margin-right: 40rpx;
		margin-top: 20rpx;
		text-indent: 2em;
		padding-bottom: 20rpx;
	}

	.teacher {
		margin-left: 10rpx;
		color: blue;
	}

	.date {
		margin-top: 5rpx;
		margin-left: 40rpx;
	}

	.teacher,.date {
		font-size: 32rpx;
		/* padding-top: 120rpx; */
	}
	
	rich-text {
		font-size: 35rpx;
	}
</style>
