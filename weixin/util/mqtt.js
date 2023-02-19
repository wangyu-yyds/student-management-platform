import {
	v4
} from 'uuid';
var mqtt = require('mqtt/dist/mqtt.js')
var client

const MQTT_IP = 'mqtt.pangmayi.cn/mqtt'
const connectUrl = `wxs://${MQTT_IP}`
const MQTT_USERNAME = 'PHC'
const MQTT_PASSWORD = 'public'
const TOPIC = 'student'

const MQTT_OPTIONS = {
	username: MQTT_USERNAME,
	password: MQTT_PASSWORD,
	clientId: '',
	clean: true,
	connectTimeout: 4000,
	reconnectPeriod: 1000,
}

// Connect函数功能: 实现mqtt连接以及订阅默认主题'student'
function Connect(callback) {
	MQTT_OPTIONS.clientId = v4()
	var that = this
	client = mqtt.connect(connectUrl, MQTT_OPTIONS)
	client.on('connect', () => {
		console.log('连接成功')
		// client.subscribe(TOPIC, err => {
		// 	if (!err) {
		// 		console.log(`订阅主题:${TOPIC}成功`)
		// 	}
		// })
	}).on('message', (theme, payload) => {
		// const msgstr = `接收到了来自 '${theme}' 主题的消息: ${payload.toString()}`  
		// console.log(msgstr)             //调试时使用的提示信息
		callback(theme, payload.toString())
	})
}

//Subscribe函数功能: 实现订阅topic主题
function Subscribe(topic) {
	// try {
	// 	client.on('connect', () => {
	try {
		client.subscribe(topic, () => {
			console.log(`订阅 ${topic} 主题成功`)
		})
	} catch (e) {
		console.log('订阅主题时client.subscribe()出错了!')
		return
	}
// })
// } catch (e) {
// 	console.log('订阅主题时client.on()出错了!')
// 	return
// }
}

// 输入: topic(主题), message(待发送的消息)
function PublishMessage(topic, message) {
	client.publish(topic, message, {
		qos: 2,
		retain: false
	}, (error) => {
		if (error) {
			console.error('publishMessage时出错了:', error)
			return
		}
	})
}

// 开启接收消息
function ReceivedMessage(callback) {
	client.on('message', (theme, payload) => {
		// const msgstr = `接收到了来自 '${theme}' 主题的消息: ${payload.toString()}`  
		// console.log(msgstr)             //调试时使用的提示信息
		callback(theme, payload.toString())
	})
}

// 断开连接
// function Disconnect() {
// 	client.end(() => {
// 		console.log('连接已断开')
// 	})
// }

export default {
	Connect,
	Subscribe,
	PublishMessage,
	ReceivedMessage,
	// Disconnect
}





// export const MQTT_IP = '172.16.40.118:8083/mqtt'

// const MQTT_USERNAME = 'admin'
// const MQTT_PASSWORD = 'public'

// export const MQTT_OPTIONS = {
// 	connectTimeout: 5000,
// 	clientId: '',
// 	username: MQTT_USERNAME,
// 	password: MQTT_PASSWORD,
// 	clean: false
// }
