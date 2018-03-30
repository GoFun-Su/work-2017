import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import BootStrap from 'bootstrap/dist/css/bootstrap'
import store from './store'
import 'babel-polyfill'
import 'promise-polyfill'
import qs from 'qs'
import VueRouter from 'vue-router'
import Auth from 'Common/auth.js'
import management from './management'
import index from './components/index'
import addManage from './components/addManage'
import orgIndex from './components/orgIndex'
import addOrg from './components/addOrg'
import orgDetail from './components/orgDetail'

Vue.use(VueRouter)
Vue.use(ElementUI)
axios.defaults.baseURL = '/api/user';


/*路由跳转*/
var router = new VueRouter({
	routes: [
		{
			name:"management",
			path: '/management',
			component: management
		},
		{
			name:"index",
			path: '/index',
			component: index
		},
		{
			name:"addManage",
			path: '/addManage/:userid',
			component: addManage
		},
		{
			name:"orgIndex",
			path: '/orgIndex',
			component: orgIndex
		},
		{
			name:"addOrg",
			path: '/addOrg/:getOrgById',
			component: addOrg
		},
		{
			name:"orgDetail",
			path: '/orgDetail/:orgname',
			component: orgDetail
		}
	]
});

var vue = new Vue({
	el: "#app",
	store,
	router,
	template: '<router-view/>',
	components: {
		management
	},
});
router.push("/management");
Auth(vue)