<script>
	import {
		v4
	} from 'uuid';
	var mqtt = require('mqtt/dist/mqtt.js')
	var client
	
	const MQTT_IP = 'mqtt.pangmayi.cn/mqtt'
	const connectUrl = `wxs://${MQTT_IP}`
	const MQTT_USERNAME = 'ZYL'
	const MQTT_PASSWORD = 'public'

	const MQTT_OPTIONS = {
		username: MQTT_USERNAME,
		password: MQTT_PASSWORD,
		clientId: '',
		clean: true,
		connectTimeout: 4000,
		reconnectPeriod: 1000,
	}

	export default {
		onLaunch: function() {
			console.log('小程序启动');
			client = mqtt.connect(connectUrl, MQTT_OPTIONS);
			this.$global.client = client;
			try {
				client.on('connect', () => {
					console.log('连接成功');
				})
			} catch(e) {
				console.log('连接出错');
				return;
			}
			// 通过uni.login()拿到code, 然后发送请求给服务器,
			// uni.login({
			// 	provider: 'weixin',
			// 	// onlyAuthorize: true,
			// 	success: loginAuth => {
			// 		let param = {code: loginAuth.code};
			// 		this.$global.code = param.code; //将拿到的code赋值给全局变量
			// 		console.log('code类型', typeof(param.code));
			// 		console.log('code:', param.code)
			// 		console.log('全局code:', this.$global.code)
			// 		this.$Request.getRequest(this.$url.GATHER.getopenid, param).then(res => {
			// 			console.log('openid返回成功', res);
			// 			// console.log(typeof(res));
			// 			this.$global.openid = res;
			// 			// console.log('全局openid替换', this.$global.openid);
			// 			// console.log('openid返回成功:', res.data)
			// 		}).catch(err => {
			// 			console.log('openid返回错误', err);
			// 		})
			// 	}
			// })
			// this.$global.openid = openid;
			// console.log('全局openid替换', this.$global.openid);
			// console.log('全局code', this.$global.code);
		},
		onShow: function() {
			console.log('小程序页面展示');
		},
		onHide: function() {
			console.log('小程序页面隐藏');
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */

	/* 引入colorUI */
	@import url("colorui/main.css");
	@import url("colorui/icon.css");


	/* 引入uview基础样式 */
	@import "uview-ui/index.scss";
</style>
