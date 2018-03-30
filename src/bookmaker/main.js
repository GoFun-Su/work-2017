import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import BookMaker from './BookMaker'
import store from './store'
import BootStrap from 'bootstrap/dist/css/bootstrap'
import VueQuillEditor from 'vue-quill-editor'
import VueVideoPlayer from 'vue-video-player'
import 'babel-polyfill'
import 'promise-polyfill'
import Auth from 'Common/auth.js'


window.moment  = require('moment')
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.use(VueVideoPlayer)
axios.defaults.baseURL = '/api/bookmaker';

Vue.directive('focus', {
	inserted (el, binding) {		
		el.focus()
	},
	componentUpdated (el, binding) {		
		el.focus()		
	},
	update (el) {		
		el.focus()
	}
})

var vue = new Vue({
	el: "#app",
	store,
	components: {
		BookMaker
	},
	template: '<BookMaker/>'
});

Auth(vue)