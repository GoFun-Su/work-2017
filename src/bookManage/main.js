import Vue from 'vue'
import Vuex from 'vuex'
import Commoncss from 'Common/assets/css/common.css'
import bookManage from './bookManage'
import iconFont from 'Common/assets/iconFont/iconfont.css'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import VeeValidate from 'vee-validate'
import 'element-ui/lib/theme-default/index.css'
import '../../theme/index.css'
import Index from './views/index'
import Update from './views/update'
import Filing from './views/filing'
import Auth from 'Common/auth.js'
import 'babel-polyfill'
import 'promise-polyfill'

axios.defaults.baseURL = '/api/bookmanage'

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VeeValidate)

/*路由跳转*/
var router = new VueRouter({
	routes: [
		{
			name:"Index",
			path: '/Index',
			component: Index
		},
		{
			name:"Update",
			path: '/Update:/id:/logo:/logoId',
			component: Update
		},
		{
			name:"Filing",
			path: '/Filing',
			component: Filing
		}
	]
});

var eventHub = new Vue();
var vue = new Vue({
	el: '#app',
	router,
	 render: h => h(bookManage)
});
router.push("/Index");
Auth(vue)
