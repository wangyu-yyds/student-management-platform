const MQTT_IP = 'mqtt.pangmayi.cn/mqtt'
const connectUrl = `wxs://${MQTT_IP}`
const MQTT_USERNAME = 'ZYL'
const MQTT_PASSWORD = 'public'
var client

const MQTT_OPTIONS = {
	username: MQTT_USERNAME,
	password: MQTT_PASSWORD,
	clientId: '',
	clean: true,
	connectTimeout: 4000,
	reconnectPeriod: 1000,
}

let sf = {};		//进入小程序登录时，传回的用户信息， code，姓名，学号/教师号/游客号，身份

let openid = '';		//通过uni.request获取的openid
let code = '';		//通过uni.login获取的code

let vxUser = {		//用户的微信名和手机号等，第三方vx登录获取
	vxavatar: 'https://tse1-mm.cn.bing.net/th/id/R-C.0617f601afc4c9a9203563d4c5bae5af?rik=DbU%2bZKlhw15v2A&riu=http%3a%2f%2fpic152.huitu.com%2fres%2f20201119%2f2493699_20201119190800940060_3.jpg&ehk=wHkxtdXfbmaXl1X4ak0xxJiKAViRuVO9FHwVBY4oG9o%3d&risl=&pid=ImgRaw&r=0',	//微信头像
	vxname: '虎虎生威',		//微信名
	tel: '',		//手机号
};


let user = {				//用户的姓名和工号/学号	
	username: '',			//用户输入的姓名
	usernum: '',			//用户输入的学号/工号
	visitor: 'YK6824483',	//游客号
	number: '',				//用户编号
	tagid: '游客',			//身份标签,未绑定时为游客
	code: -1,				//登录状态, -1 为游客，0 为老师/学生
};

export default {
	openid,
	code,
	sf,
	vxUser,
	user,
}

