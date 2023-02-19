import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false

//引入colorUI
import cuCustom from 'colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)


//引入uview
import uView from "uview-ui";
Vue.use(uView);

//引入全局request配置
import Request from './util/api.js'
Vue.prototype.$Request = Request


//引入icnofont库
// import 'common/font/iconfont.css'

//引入mqtt.js
import mqtt from './util/mqtt.js'
Vue.prototype.$mqtt = mqtt

//全局URL配置
import url from './util/url.js'
Vue.prototype.$url = url

//全局变量
import global from './util/global.js'
Vue.prototype.$global = global

import fileHandle from './util/fileHandle.js'
Vue.prototype.$fileHandle = fileHandle

App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
