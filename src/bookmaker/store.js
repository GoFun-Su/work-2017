import Vue from 'vue'
import Vuex from 'vuex'
import 'babel-polyfill'
import 'promise-polyfill'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		tree: [],
		storeTreeMap: new Map(),
		currentNode: {
			id: -1,
			parentID: -1,
			level: 1
		},
		editorID: '',
		editorArr: []
	},
	mutations: {
		updateContentByIndex (state, content) {			
			state.editorArr.splice(content.index, 1, content)
		},
		deleteEditor (state, index) {
			state.editorArr.splice(index, 1)
		},
		emptyEditor (state){
			state.editorArr = []
		},
		addEditor (state, editor) {			
			if(Array.isArray(editor)){								
				editor.forEach((item) => {
					state.editorArr.push(item)
				})
			} else {
				state.editorArr.push(editor)
			}
		},
		synContent (state, content) {
			var editorObj = state.editorArr[content.index]
			editorObj.content = content.content
			editorObj.relationID = content.relationID
			if (content.obj) {
				editorObj.obj =  {
					name: content.obj.name,
					url: content.obj.url
				}
			}
			
			
			
			state.editorArr.splice(content.index, 1, editorObj)
		},
		synPosition (state, position) {
			var editorObj = state.editorArr[position.index]
			editorObj.position = position.position;
			state.editorArr.splice(position.index, 1, editorObj)
		},
		modifyEditor (state, editor) {					
			state.editorArr.splice(editor.index, 1, editor)			
		},
		setEditorID (state, editorID) {
			state.editorID = editorID
		},
		setTree (state, allTree) {
			state.tree = allTree;
		},
		addTreeNode (state, treeNode) {
			if(treeNode.parentID < 0){
				treeNode.orderIndex = state.tree.length
				state.tree.push(treeNode)
			} else {
				var storeTree = state.storeTreeMap.get(treeNode.parentID)
				if(storeTree){
					treeNode.orderIndex = storeTree.children.length
					storeTree.children.push(treeNode)
				} else {
					treeNode.parentID = -1
					treeNode.orderIndex = state.tree.length
					state.tree.push(treeNode)
				}
			}
			state.storeTreeMap.set(treeNode.id, treeNode);
		},
		updateTreeNode (state, treeNode) {						
			var oldNode = state.storeTreeMap.get(treeNode.id);
			if(typeof(oldNode) == 'undefined'){
				oldNode = state.storeTreeMap.get(0);
				state.storeTreeMap.delete(0);
			}
			if(typeof(oldNode) == 'undefined'){				
				return;
			}
			oldNode.id = treeNode.id;
			oldNode.title = treeNode.title;
			oldNode.level = treeNode.level;
			oldNode.parentID = treeNode.parentID;
			state.storeTreeMap.set(treeNode.id, treeNode);
		},
		deleteTreeNode (state, treeNode) {
			var storeTree = state.storeTreeMap.get(treeNode.id);
			var parentID = storeTree.parentID;
			var parentArr;
			if(parentID > 0){
				parentArr = state.storeTreeMap.get(parentID).children;
			} else {
				parentArr = state.tree;
			}
			var index = parentArr.findIndex((item) => {
				return item.id == treeNode.id;
			});
			parentArr.splice(index, 1);
		},
		moveTreeNode (state, moveTreeNode) {
			var oldParentNode;
			var newParentNode;
			var currentNode = state.storeTreeMap.get(moveTreeNode.currentNodeID)
			oldParentNode = state.storeTreeMap.get(currentNode.parentID)
			if(moveTreeNode.operationType == 'appendChild'){				
				newParentNode = state.storeTreeMap.get(moveTreeNode.targetNode.id)
			} else {
				newParentNode = state.storeTreeMap.get(moveTreeNode.targetNode.parentID)
			}
			oldParentNode.children.splice(oldParentNode.children.findIndex((item) => {
				return item.id == moveTreeNode.currentNodeID
			}), 1)
			var targetIndex = newParentNode.children.findIndex((item) => {
				return item.id == moveTreeNode.targetNode.id
			})			
			if(moveTreeNode.operationType == 'appendChild'){
				currentNode.parentID = moveTreeNode.targetNode.id
				currentNode.level = moveTreeNode.targetNode.level + 1
				newParentNode.children.push(currentNode)
			} else if(moveTreeNode.operationType == 'appendBefore'){
				currentNode.parentID = moveTreeNode.targetNode.parentID
				currentNode.level = moveTreeNode.targetNode.level
				newParentNode.children.splice(targetIndex, 0, currentNode)
			} else if(moveTreeNode.operationType == 'appendAfter'){				
				currentNode.parentID = moveTreeNode.targetNode.parentID
				currentNode.level = moveTreeNode.targetNode.level
				newParentNode.children.splice(targetIndex + 1, 0, currentNode)
			} else {
				return
			}	
		},
		setCurrentNode (state, treeNode) {
			state.currentNode = treeNode;
		},
		setStoreTreeMap (state) {
			const analyzeTree = (tree) => {
				tree.forEach((item) => {
					state.storeTreeMap.set(item.id, item);
					analyzeTree(item.children);
				});
			}
			analyzeTree(state.tree);
			state.storeTreeMap.set(-1, {
				id: -1,
				level: 0,
				children: state.tree
			})
		}
	},
	actions: {
		loadPage ({commit}, backlistID) {
			axios.get("/pageContentModule/" + backlistID)
			.then(({data}) => {
				var editorArr = []
				data.forEach((item, index) => {
					item.position = JSON.parse(item.position)
					item.index = index
					item.obj =  {
						name: item.resourseName,
						url: item.content
					}
					editorArr.push(item)
				})
				commit("emptyEditor")
				commit("addEditor", editorArr)
			})
		},
		loadTree({commit}, bookID = -1) {
			axios.get("/backlistTree/" + bookID)
			.then((response) => {
				const createTree = (item) => {
					if(typeof(item) == "undefined" || item == null){
						return;
					}
					var tree = [];
					item.forEach((model, index) => {
						var backlistModel = model.backlistModel;
						var treeNode = {
							id: backlistModel.id,
							title: backlistModel.title,
							level: backlistModel.level,
							parentID: backlistModel.parentID,
							bookID: backlistModel.bookID,
							orderIndex: backlistModel.orderIndex,
							children: []
						};
						tree.push(treeNode);
						var children = createTree(model.childrenList);
						if(typeof(children) != "undefined" && children != null){
							treeNode.children = children;
						}
						if(index == 0){
							commit("setCurrentNode", treeNode)
						}
					});
					return tree;
				};
				// createTree(response.data);								
				commit("setTree", createTree(response.data));
				commit("setStoreTreeMap");
			});
		},
		modifyTreeNode ({commit}, {treeNode, closeInput}) {
			axios.post("/backlist", {
			  id: treeNode.id,			  			  
			  orderIndex: 0,
			  parentID: treeNode.parentID,
			  title: treeNode.title,
			  bookID: treeNode.bookID,
			  orderIndex: treeNode.orderIndex
			}).then((response) => {				
				treeNode.id = response.data.id;
				treeNode.level = response.data.level;
				treeNode.bookID = response.data.bookID;
				commit("updateTreeNode", treeNode);
				closeInput();
			});
		},
		deleteTreeNode ({commit}, treeNode) {
			axios.delete("/backlist/" + treeNode.id)
			.then((response) => {
				commit("deleteTreeNode", treeNode);
			});
		},
		moveTreeNode ({commit, state}, moveTreeNode) {
			var parentID = -1;
			//在当前节点添加子节点
			if(moveTreeNode.operationType == 'appendChild') {
				parentID = moveTreeNode.targetNode.id
			} else {
				//移动当前节点位置
				parentID = moveTreeNode.targetNode.parentID
			}
			axios.put("/backlist/move/" + moveTreeNode.currentNodeID + "/" + parentID)
			.then((response) => {
				commit("moveTreeNode", moveTreeNode);
				var parentArr = state.storeTreeMap.get(parentID).children;
				var orderArr = [];
				parentArr.forEach((item, index) => {
					item.orderIndex = index
					orderArr.push(item)
				})
				axios.put("/synBacklistOrder", orderArr)				
			});
		}
	}
})