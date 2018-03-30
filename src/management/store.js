import Vue from 'vue'
import Vuex from 'vuex'
import 'babel-polyfill'
import 'promise-polyfill'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		userid:-1,
		orgid:-1,
		roleId:-1,
		checkIDArr:[]
	},
	mutations: {
		get_parameter(state){			
			var searchUrl = window.location.search;
			var parameter = new Object();
			if (searchUrl.indexOf("?") != -1) {
			    var str = searchUrl.substr(1);
			    var strs = str.split("&");
			    for(var i = 0; i < strs.length; i ++) {
				    parameter [strs[i].split("=")[0]]=(strs[i].split("=")[1]);
				}
			}
			state.userid = decodeURI(parameter.userid)
			state.orgid = decodeURI(parameter.orgid)
			state.roleId=decodeURI(parameter.roleId)
		}
	},
	actions: {

	}
})