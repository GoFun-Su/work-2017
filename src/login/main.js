import Vue from 'vue'
import VeeValidate, {Validator}from 'vee-validate'
import VueRouter from 'vue-router'
import BootStrap from 'bootstrap/dist/css/bootstrap'
import Index from './index'
import Login from './components/Login'
import Submit from './components/Submit'
import Register from './components/Register'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Auth from 'Common/auth.js'
import   'Common/assets/js/validate.js'
import 'babel-polyfill'
import 'promise-polyfill'

Vue.use(VueRouter)

axios.defaults.baseURL = '/api/user'

Vue.use(VeeValidate)
Vue.use(ElementUI)

var router = new VueRouter({
	routes: [
		{
			name:"Login",
			path: '/Login',
			component: Login
		},
		{	
			name:"Submit",
			path: '/Submit',
			component: Submit,
		},
		{	
			name:"Register",
			path: '/Register',
			component: Register,
		}
	]
});

var vue=new Vue({
    el: '#app',
  router: router,
  render: h => h(Index)
})

router.push("/Login");

Auth(vue)
