import Vue from 'vue'
import Vuex from 'vuex'
import 'babel-polyfill'
import 'promise-polyfill'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		tree: [],
		checkIDArr:[],
		storeTreeMap: new Map(),
		currentNode: {
			id: -1,
			parentID: -1
		},
		currentFolder: -1
	},
	mutations: {
		emptyCheckIDArr (state) {
			state.checkIDArr = []
		},
		setTree (state, {tree, parentid}) {			
			if(! tree){
				return;
			}			
			for(var i = 0;i < tree.length;i ++){
				tree[i].children = [];
				tree[i].parentID = tree[i].parentid
			}			
			var parentNode = state.storeTreeMap.get(parentid);			
			if(parentNode && parentNode != null){
				parentNode.children = tree
			} else {
				state.tree = tree
			}			
			if(parentid < 0 && state.tree.length > 0){
				state.currentFolder = state.tree[0].id
			}
		},
		addTreeNode (state, treeNode) {			
			var parentNode = state.storeTreeMap.get(treeNode.parentID);			
			if(! parentNode){
				return;
			}			
			if(Array.isArray(parentNode)){
				parentNode.push(treeNode);
			} else {
				parentNode.children.push(treeNode);
			}
		},
		updateTreeNode (state, treeNode) {
			if(typeof(oldNode) == 'undefined'){				
				return;
			}
			var oldNode = state.storeTreeMap.get(treeNode.id);
			if(typeof(oldNode) == 'undefined'){
				oldNode = state.storeTreeMap.get(0);
				state.storeTreeMap.delete(0);
			}
			oldNode.id = treeNode.id
			oldNode.title = treeNode.title
			oldNode.level = treeNode.level
			oldNode.parentID = treeNode.parentID			
		},
		deleteTreeNode (state, treeNode) {			
			var storeTree = state.storeTreeMap.get(treeNode.parentID);			
			var parentArr;
			if(treeNode.parentID > 0){
				parentArr = storeTree.children;
			} else {
				parentArr = state.tree;
			}			
			var index = parentArr.findIndex((item) => {
				return item.id == treeNode.id
			})			
			if(index < 0){
				return
			}
			parentArr.splice(index, 1)
		},	
		setCurrentNode (state, treeNode) {			
			state.currentNode = treeNode
			state.currentFolder = treeNode.id
		},
		setParentNode (state, treeNode) {
			state.currentParentNode = treeNode
		},
		setStoreTreeMap (state) {			
			const analyzeTree = (tree) => {
				if(tree){									
					tree.forEach((item) => {
						state.storeTreeMap.set(item.id, item);
						analyzeTree(item.children);
					});
				}				
			}
			analyzeTree(state.tree);
			state.storeTreeMap.set(-1, state.tree);
		},
		checkResource(state, resource){		
			var index = state.checkIDArr.findIndex((item) => {								
				return item.id == resource.id;
			});
			if(index > -1){
				state.checkIDArr.splice(index, 1);
			} else {
				state.checkIDArr.push(resource);
			}
		}
	},
	actions: {
		loadTree({commit}, parentid = -1) {			
			var allFoldersUrl='/quesion/findFolderList';
			axios.get(allFoldersUrl,{
				params: {
					parentid : parentid
				}
			}).then((response) => {				
				commit("setTree", {
					tree: response.data,
					parentid: parentid
				})
				commit("setStoreTreeMap")
			})
		},
		//创建
		createTreeNode ({commit}, {treeNode, closeInput}) {		
			axios.post("/quesion/saveQuestionList",{
				 parentid:treeNode.parentID,
				 id:treeNode.id,
			     title: treeNode.title,
				 type: 50
			}).then((response) => {
				treeNode.id = response.data.id;
				commit("updateTreeNode", treeNode);
				commit("setStoreTreeMap")
				closeInput();
			});
		},
		//重命名
		modifyTreeNode ({commit}, {treeNode, closeInput}) {			
			axios.put("/quesion/updateQuestion", 
			  	{
			  		"questionModel": {
				        "id": treeNode.id,
				        "parentid": treeNode.parentID,
				        "title": treeNode.title
			    	}
				}
			).then((response) => {
				commit("updateTreeNode", treeNode);
				closeInput();
			});
		},
		//删除目录
		deleteTreeNode ({commit}, treeNode) {
			if(treeNode.id > 0){
				axios.delete("/quesion/delFalseQuestion/" + treeNode.id,{
					id: treeNode.id
				}).then((response) => {
					commit("deleteTreeNode", treeNode);
				});
			} else {
				commit("deleteTreeNode", treeNode)
			}
			
		}
	}
})