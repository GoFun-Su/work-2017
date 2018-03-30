import Vue from 'vue'
import Vuex from 'vuex'
import '../../theme/index.css'
import Commoncss from 'Common/assets/css/common.css'
import BootStrap from 'bootstrap/dist/css/bootstrap'
import 'element-ui/lib/theme-default/index.css'
import iconFont from 'Common/assets/iconFont/iconfont.css'
import Question from './Question'
import Index from './components/index'
import radioQuestions from './components/radioQuestions'
//import multChoice from './components/multChoice'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import store from './store'
import 'babel-polyfill'
import 'promise-polyfill'
import VeeValidate from 'vee-validate'
import Auth from 'Common/auth.js'


axios.defaults.baseURL = '/api/questions';
window.moment =require('moment')
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VeeValidate)

Vue.directive('focus', {
	inserted (el) {
		el.focus()
	}
})

/*路由跳转*/
var router = new VueRouter({
	routes: [
		{
			name:"Question",
			path: '/Question',
			component: Question
		},
		{	
			name:"radioQuestions",
			path: '/radioQuestions/:id',
			component: radioQuestions
		},
		{
			name:"index",
			path: '/index',
			component: Index
		},
		{
			name: "search",
			path: "/search/:searchKey",
			component: Question
		}/*,
		{
			name: "multChoice",
			path: '/multChoice/:id',
			component: multChoice
		}*/
	]
});

var eventHub = new Vue();
var vue = new Vue({
	el: '#app',
	router,
	store,
	template: '<router-view/>',
	components: {
		Question
	}
});
router.push("/Question");
Auth(vue)
