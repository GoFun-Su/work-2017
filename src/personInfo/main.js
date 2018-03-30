import Vue from 'vue'
import VeeValidate, {Validator}from 'vee-validate'
import VueRouter from 'vue-router'
import BootStrap from 'bootstrap/dist/css/bootstrap'
import Index from './index'
import PersonInfo from './components/personInfo'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Auth from 'Common/auth.js'
import   'Common/assets/js/validate.js'
import 'babel-polyfill'
import 'promise-polyfill'

Vue.use(VueRouter)
Vue.use(VeeValidate)

axios.defaults.baseURL = '/api/user'

Vue.use(ElementUI)

var router = new VueRouter({
	routes: [
		{
			name:"personInfo",
			path: '/PersonInfo',
			component: PersonInfo
		}
		
	]
});

var vue=new Vue({
    el: '#app',
  router: router,
  render: h => h(Index)
})

router.push("/PersonInfo");

Auth(vue)
