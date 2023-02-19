<!-- 创建文件：Datumitem.vue 创建时间： 2022.1.17_20:45 创建人：张煜林 -->

<template>
	<view class="content">
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			this.Showfile();
		},
		methods: {
			Showfile() {
				uni.downloadFile({
					url: 'https://example.com/somefile.pdf',
					success: (data) => {
						console.log("下载成功")
						console.log(data);
							uni.saveFile({
								tempFilePath: data.tempFilePath,
								success: (res) => {
									console.log(res);
									console.log("保存成功");
									uni.openDocument({
										filePath: res.savedFilePath,
										fileType: 'pdf',
										success: (res) => {
											console.log("打开成功")
										},
										fail: (err) => {
											console.log("打开失败")
										}
									})
								},
								fail: (err) => {
									console.log("保存失败")
								}
							})
					},
					fail: (err) => {
						console.log("下载失败")
					}
				})
			}
		}
	}
</script>
	
<style>

</style>
