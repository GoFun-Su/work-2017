import Vue from 'vue'
import Vuex from 'vuex'
import '../../theme/index.css'
import Commoncss from 'Common/assets/css/common.css'
//import Commonjs from 'Common/assets/js/pdf.js'
import iconFont from 'Common/assets/iconFont/iconfont.css'
import BootStrap from 'bootstrap/dist/css/bootstrap'
import Material from './Material'
import materialPreview from './components/materialPreview'
import 'babel-polyfill'
import 'promise-polyfill'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import Auth from 'Common/auth.js'
import qs from 'qs';
import infiniteScroll from 'vue-infinite-scroll'
import VueVideoPlayer from 'vue-video-player'


window.moment =require('moment')
axios.defaults.baseURL = '/api/material';
Vue.use(infiniteScroll)
Vue.use(Vuex);
Vue.use(VueVideoPlayer)
//Vue.component(CPdf.name, CPdf)


const pagesize = 20;
const materialAllTypeApi = (type = 0, order = 1, page = 1, keyword) => {	
	var url = "/folder/materialAllType";			
	return axios.get(url, {
		params: {
			materialType: type,
			timeOrNameOrder: order,
			keyword: keyword,
			pagenum: page,
			pagesize: pagesize
		}
	});
}

const getFolderChildApi = (folderID = -1, timeOrNameOrder = 1, page = 1) => {	
	var url = "/folder/getFolderChild/" + folderID;
	return axios.get(url, {
		params: {
			timeOrNameOrder: timeOrNameOrder,
			pagenum: page,
			pagesize: pagesize
		}
	});
}

const saveFile = (folderID = -1, file) => {
	var url = "/material/add/" + folderID;
	return axios.post(url, {
	  "fileType": file.fileType,   
	  "materialName": file.fileName,
	  "materialSize": file.fileSize,
	  "materialUrl": file.filePath
	});
}

const modifyFolder = (parentID = -1, folderID, folderName) => {
	var url = "/folder/saveOrUpdateFolder";
	return axios.post(url, {
		folderId: folderID,
		folderName: folderName,
		parentId: parentID
	});
}

const moveResources = (targetFolderID = -1, moveFolders, moverMaterials) => {
	var url = "/folder/moveResourse";
	/*var params = new URLSearchParams();
	data = Qs.stringify({});
	params.append("aimsFolderId", targetFolderID);
	params.append("moverFolders", moveFolders.toString());
	params.append("moverMaterials", moverMaterials.toString());
	return axios.post(url, params);*/
	return axios.post(url, qs.stringify({
		'aimsFolderId':targetFolderID,
		'moverFolders':moveFolders.toString(),
		'moverMaterials':moverMaterials.toString()
	}))
}

const delResources = (delFolders, delMaterials) => {
	var url = "/folder/deleteAll";
	/*var params = new URLSearchParams();
	params.append("removerFolders", delFolders.toString());
	params.append("removerMaterials", delMaterials.toString());
	return axios.post(url, params);*/
	return axios.post(url, qs.stringify({
		'removerFolders': delFolders.toString(),
		'removerMaterials':delMaterials.toString()
	}))
}
const store = new Vuex.Store({
	state: {
		allResourceList: [],
		listType: false,
		folderNav: [],
		changeName: false,
		checkIDArr: [],
		orderParam: 1,
		page: 1,
		disableScroll: true
	},
	mutations: {
		sortResource(state, sort){
			state.orderParam = sort;
			if(sort == '1'){
				state.allResourceList = state.allResourceList.sort((a, b) => {
					return a.name.localeCompare(b.name);
				});
			} else if(sort == '2'){
				state.allResourceList = state.allResourceList.sort((a, b) => {
					return b.creatorDate - a.creatorDate;
				});
			}
		},
		checkResource(state, resource){
			var index = state.checkIDArr.findIndex((item) => {
				return item.id == resource.id && item.hasFolder == resource.hasFolder;
			});
			if(index > -1){
				state.checkIDArr.splice(index, 1);
			} else {
				state.checkIDArr.push(resource);
			}
		},
		changeFolderNav(state, nav){
			if(nav.top){				
				state.folderNav = [nav];
			} else {
				if(nav.index > -1){
					state.folderNav.splice(nav.index + 1, state.folderNav.length - nav.index);
				} else {
					state.folderNav.push(nav);
				}
			} 
		},
		changeListType(state){
			state.listType = ! state.listType;
		},
		listResource(state, resourceList){
			if(state.page == 1){
				state.allResourceList = [];
			}			
			resourceList.forEach((item) => {
				state.allResourceList.push(item);
			});
		},
		modifyResource (state, resource){
			var target = state.allResourceList.find(function(item){
				return item.id == resource.id && item.hasFolder == resource.hasFolder;
			});
			if(typeof(target) != 'undefined'){
				target = resource;
			} else {
				state.allResourceList.unshift(resource);
			}
		},
		deleteResource (state, resource){		
			var index = state.allResourceList.findIndex(function(item){
				return item.id == resource.id && item.hasFolder == resource.hasFolder;
			});	
			if(index > -1){
				// if(resource.id > 0){
				// 	state.changeName = false;					
				// } else {
					state.allResourceList.splice(index, 1);	
				// }
			}
		},
		/*****加载更多*******/
		initPage(state){
			state.page = 1;
		},
		turnPage (state){			
			state.page ++;			
		},		
		closeScroll (state, disableScroll){
			state.disableScroll = disableScroll;
		}
	},
	actions: {
		getResourceByFolder({commit, state}, folderID){			
			commit("closeScroll", true);			
			getFolderChildApi(folderID, state.orderParam, state.page)
			.then((response) => {				
				commit("listResource", response.data.list);						
				commit("closeScroll", response.data.pageNum >= response.data.pages);				
			});
		},
		getResourceByType({commit, state}, type){
			commit("closeScroll", true);
			materialAllTypeApi(type, state.orderParam, state.page).
			then((response) => {
				commit("listResource", response.data.list);				
				commit("closeScroll", response.data.pageNum >= response.data.pages);
			});
		},
		getResourceByKeyworkds({commit, state}, keywords){
			commit("closeScroll", true);
			materialAllTypeApi(undefined, state.orderParam, state.page, keywords).
			then((response) => {
				commit("listResource", response.data.list);
				commit("closeScroll", response.data.pageNum >= response.data.pages);
			});
		},
		addFile({commit, state}, fileInfo){			
			saveFile(fileInfo.currentFolder, fileInfo)
			.then((response) => {
				var material = response.data;
				commit("modifyResource", {
					id: material.materialId,
					name: material.materialName,
					hasFolder: "0",
					parentID: fileInfo.currentFolder,
					fileType: material.fileType
				});				
			});			
		},
		modifyFolder({commit, state}, folder){			
			modifyFolder(folder.parentID, folder.id, folder.name)
			.then((response) => {
				if(response.data.code != '2'){
					folder.id = response.data.folderId;
					folder.name = response.data.folderName;
					state.changeName = false;
				}
			});
		},
		moveResource ({commit, state}, targetFolderID){			
			var moveFolders = [];
			var moveMaterials = [];			
			state.checkIDArr.forEach((item) => {
				if(item.hasFolder == '0'){
					moveMaterials.push(item.id);
				} else {
					moveFolders.push(item.id);
				}
			});
			return moveResources(targetFolderID, moveFolders, moveMaterials);
		},
		delFile ({commit, state}){
			var delFolders = [];
			var delMaterials = [];
			state.checkIDArr.forEach((item) => {
				if(item.hasFolder == '0'){
					delMaterials.push(item.id);
				} else {
					delFolders.push(item.id);					
				}
			});
			delResources(delFolders, delMaterials)
			.then((response) => {
				if(response.data.code != '2'){
					delFolders.forEach((item) => {
						var folder = state.allResourceList.find((item2) => {
							return item == item2.id && item2.hasFolder == '1';
						});
						commit('deleteResource', folder);
					});
					delMaterials.forEach((item) => {						
						var file = state.allResourceList.find((item2) => {
							return item == item2.id && item2.hasFolder == '0';
						});
						commit('deleteResource', file);
					});
					state.checkIDArr = [];
				}
			});
		}
	}
});

Vue.use(VueRouter); 
const router = new VueRouter({
	routes: [
		{
			name: "folder",
			path: "/folder/:id",
			component: Material
		},
		{
			name: "type",
			path: "/type/:type",
			component: Material
		},
		{
			name: "search",
			path: "/search/:searchKey",
			component: Material
		},
		{
			name: "materialPreview",
			path: "/materialPreview/:id",
			component: materialPreview
		}
	]
});

router.beforeEach((to, from, next) => {	
	store.commit("initPage");	
	var nav = {
		id: to.params.id,
		name: "全部文件",
		url: to.path,
		top: true,
		index: -1
	};
	if(to.name == "folder"){		
		if(to.params.id != -1){
			nav.top = false;
		}		
		nav.index = store.state.folderNav.findIndex((item) => {
			return item.id == to.params.id;
		});
		var folder = store.state.allResourceList.find((item) => {
			return item.id == to.params.id && item.hasFolder == '1';
		});
		if(typeof(folder) != 'undefined'){
			nav.name = folder.name;
		}		
	} else if(to.name == "type"){		
		switch(to.params.type)
		{
			case '0': nav.name = "全部文件";break;
			case '1': nav.name = "文档";break;
			case '2': nav.name = "视频";break;
			case '3': nav.name = "图片";break;
			case '4': nav.name = "音频";break;
			case '5': nav.name = "其他";break;
		}
	} else if(to.name == "search"){
		nav.name = to.params.searchKey;		
	}	
	store.commit("changeFolderNav", nav);	
	next();
});


// Vue.use(iView);
Vue.use(ElementUI);
var eventHub = new Vue();
var vue = new Vue({
	el: '#app',
	router,
	store,
	data: {
		eventHub: eventHub,		
	    checkAllGroup: [],
	    BreadNav: [],
	    modifyName: false
	},
	template: '<router-view/></router-view>',
	components: {
		Material
	},
	computed:{
		checkIDArr: function(){
			return this.checkAllGroup.map(function(item){
				return item.id + "" + item.hasFolder;
			});	
		}
	},
	created (){
		var _this = this;
		this.$router.push("/folder/-1");
		var pagesize = 10;
		eventHub.$on("getByType", function(page, type, timeOrNameOrder, keyword){			
			if(typeof(page) == "undefined"){
				page = 1;
			}
			if(typeof(type) == "undefined"){
				type = 1;
			} 
			if(typeof(timeOrNameOrder) == "undefined"){
				timeOrNameOrder = 1;
			}
			
		});

		eventHub.$on("getByFolder", function(page, folderID, timeOrNameOrder){
			if(typeof(page) == "undefined"){
				page = 1;
			}
			if(typeof(folderID) == "undefined"){
				folderID = -1;
			}
			if(typeof(timeOrNameOrder) == "undefined"){
				timeOrNameOrder = 1;
			}			
			
		});

		eventHub.$on("enterFolder", function(folderID){
			this.$router.push("/1/" + folderID + "/1");
		});

		eventHub.$on("updateMaterial", function(id, name, hasFolder, parentID){
			if(name == null || name == ''){
				alert("参数错误");
			}
			parentID = -1;
			if(hasFolder == '1'){
				axios.post("/folder/saveOrUpdateFolder", 
					{
						"folderId": id,
						"folderName": name,
						"parentId": parentID
					}
				).then(function(response){
					var index = _this.allFileList.map(function(item){
						return item.id + "" + item.hasFolder;
					}).indexOf(id + "" + hasFolder);
					var file = _this.allFileList[index];
					file.name = name;
					file.id = response.data.folderId;
					_this.$set(_this.allFileList, index, file);
				});
			} else {
				axios.post("/material/updateMaterial", {
					"materialId": id,
					"materialName": name,
					"parentId": parentID
				}).then(function(response){
					var index = _this.allFileList.map(function(item){
						return item.id + "" + item.hasFolder;
					}).indexOf(id + "" + hasFolder);
					var file = _this.allFileList[index];
					file.name = name;
					file.id = response.data.folderId;
					_this.$set(_this.allFileList, index, file);
				});
			}			
		});

		eventHub.$on("check", function(file){
			var index = _this.checkIDArr.indexOf(file.id + "" + file.hasFolder);			
			if(index > -1){
				_this.checkAllGroup.splice(index, 1);
			} else {
				_this.checkAllGroup.push(file);
			}			
		});

		eventHub.$on("moveResource", function(targetFolderID){
			if(targetFolderID < -1){
				alert("没有目标文件夹");
				return;
			}
			var moveFolders = [];
			var moverMaterials = [];
			for(var i in _this.checkAllGroup){
				var resource = _this.checkAllGroup[i];
				if(resource.hasFolder == "1"){
					moveFolders.push(resource.id);
				} else {
					moverMaterials.push(resource.id);
				}
			}
			/*var params = new URLSearchParams();
			params.append("aimsFolderId", targetFolderID);
			params.append("moverFolders", moveFolders.toString());
			params.append("moverMaterials", moverMaterials.toString());*/
			axios.post("/folder/moveResourse",qs.stringify({
				"aimsFolderId": targetFolderID,
				"moverFolders": moveFolders.toString(),
				"moverMaterials": moverMaterials.toString()
			}))
			.then(function(response){
				_this.$router.push("/1/-1/1")
			});
		})

		eventHub.$on("deleteResource", function(){
			
		});
	}
})
Vue.directive('focus', {
  update: function (el,binding) {
  	if (binding.value != binding.oldValue && binding.value) {
  		el.select()	
  	}
  }
})
Auth(vue)

