<template>
<div>
	<Navigation/>
	<div class="main" v-cloak>
	<!-- 左侧全部试题导航 -->
		<div class="toggleShow" v-show="isToggleShow">
			<i class="iconfont icon-doublearrow_left" @click="switching"></i>
		</div>
		<div class="leftSlidebar" v-show="isLeftSlidebar">
			<div class="leftNav">
				  <p class="navTop">
					<i class="iconfont icon-creat_fold" @click="addSameLevel"></i>文件夹
					<i class="iconfont icon-creat_fold1" @click="addChildLevel"></i>子文件夹
					<i class="iconfont icon-doublearrow_left"  @click="switching"></i>
				</p>
				<span class="all">全部</span>				
				<ul class="allQuestionFile">
					<treeNode v-for="child in tree" :node="child" @setParentNode="$store.commit('setParentNode', tree)"/>
				</ul>		
			</div>
		</div> 
		<div class="allQuestion clearfix" v-bind:class="{allSwitch:isAllSwitch}">
			<div class="operationNav">
				<ul class="operationLeft">
					<li class="create">
					   <el-popover
						  placement="bottom"
						  width="250"
						  trigger="click">
						 <p class="popContent">
						 	<router-link to="/radioQuestions/-1">单选题</router-link>
						 	<a href="#">多选题</a>
						 	<a href="#">填空题</a>
						 	<a href="#">判断题</a>
						 	<a href="#">综合题</a>
						 </p>
						<el-button  slot="reference">创建新题</el-button>
					  </el-popover>
					</li>
					<li class="import">导入试题</li>
					<li>共享</li>
					<li @click="moveCount">移动</li>
					<li @click="deleteCount">删除</li>
				</ul>
				<ul class="operationRight">
					<li class="type"> 
						<el-select v-model="value" placeholder="题型" @change="searchQuestion">
						    <el-option
						      v-for="item in options"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>
					</li>
					<li style="width: 80px;">
						<el-select v-model="level" placeholder="难度" @change="searchQuestion">
						    <el-option
						      v-for="level in difGrades"
						      :label="level.label"
						      :value="level.level">
						    </el-option>
						</el-select>
					</li>
					<li class="search">
						<input type="text" placeholder="搜索您的试题" @keyup.enter="searchQuestion" v-model="searchStr" />
						<i class="iconfont icon-fangdajing"></i>
					</li>
				</ul>
			</div>			
			<p class="allCheckd">
				<span>
					<el-checkbox
					 v-model="checkAll"
		             :value="checkAll"
		             :indeterminate="indeterminate"
		             @change="handleCheckAll"
					>全部</el-checkbox>
				</span>		
			</p>
			<!-- 删除弹框 -->
			<el-dialog title="确认删除" v-model="delDialog">
				<p class="delConfirm">是否确认删除</p>
				<span solt="fotter" class="dialog-footer">
					<el-button @click="confirmDelete" class="confirm">确认</el-button>
					<el-button @click="delDialog = false" class="delete">取消</el-button>
				</span>
			</el-dialog>
			<!-- 移动弹框 -->
			<el-dialog title="移动" v-model="dialogVisible">
				<el-tree					
					:show-checkbox="false"
					@check-change="chooseTreeNode"
					@node-click="chooseTreeNode"
					:highlight-current="true"
					:expand-on-click-node="false"
					:load="loadTree"
					lazy
				/>
				<span  class="dialog-footer">
					<el-button class="confirm" @click="comfirmMove">确定</el-button>
					<el-button @click="dialogVisible = false"  class="delete">取消</el-button>
				</span>
			</el-dialog>
			<!-- 试题渲染 -->	
			<div class="questionShow">
				<div  class="Qtype" v-for="question in allList.list">
					<Qcommon :question="question" 
							v-on:deleteQuestion="deleteQuestion" 
							v-on:moveQuestion="moveQuestion" 
							v-on:deleteCount="deleteCount"
						/>
					<Qtype :question="question" />
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
	import qs from 'qs';
	import { mapState } from 'vuex'
	import treeNode from './TreeNode'
	import Qtype from './Qtype'
	import Qcommon from './Qcommon'
	import Navigation from 'Common/components/Navigation'
	export default{
		name:"index",
		components: {
			'Qtype' : Qtype,
			'Navigation': Navigation,
			'treeNode':treeNode,
			'Qcommon' : Qcommon
		},
		data(){
			return{
				moveQuestionID: -1,
				value: '',
				level: '',
				allFolders:'',
				searchStr:'',
				dialogVisible:false,
		      	chooseFolderID: -1,
		      	isIndeterminat : true,
				isAllSwitch:false,
				isToggleShow:false,
				isLeftSlidebar:true,
				delDialog: false,
				allList:{
					list: []
				},
				/*试题类型*/
				options: [{
			        value: '1',
			        label: '单选题'
			      }, {
			        value: '2',
			        label: '多选题'
			      }, {
			        value: '3',
			        label: '填空题'
			      }, {
			        value: '4',
			        label: '判断题'
			      }, {
			        value: '17',
			        label: '综合题'
			      }],
		       /*难易程度*/
		        difGrades: [{
			        level: 1,
			        label: '容易'
			      }, {
			        level: 2,
			        label: '一般'
			      }, {
			        level: 3,
			        label: '中等'
			      }, {
			      	level: 4,
			      	label: '较难'
			      }, {
			      	level: 5,
			      	label: '困难'
			      }]
				}
			},
			created(){				
				this.$store.dispatch("loadTree");
				this.searchQuestion();
			},
			computed: {
				indeterminate(){
					return this.allList.list.length >0 
					&& this.$store.state.checkIDArr.length != this.allList.list.length
					&& this.$store.state.checkIDArr.length > 0;
				},
				checkAll(){		
					return this.allList.list.length >0 
					&& this.$store.state.checkIDArr.length == this.allList.list.length;
					this.isIndeterminate = false;
				},
				...mapState({
					tree: state => state.tree,
					currentFolder: state => state.currentFolder
				})
			},
			watch: {
			  'currentFolder': 'searchQuestion',			  
			},
			methods:{
				searchQuestion (){					
					var type = 0
					if(this.value != ''){
						type = this.value
					}
					var level = 0
					if(this.level != ''){
						level = this.level
					}
					var searchStr = this.searchStr;
					if(searchStr == ''){
						searchStr = null
					}
					axios.get("/quesion/findAllQuestion", {
						params: {
				   			type:type,
				   			hardlevel:level,
				   			parentid:this.currentFolder,
				   			keyword:searchStr,
				   			pageNumber:1,
				   			pagesize:10				   			
						}
					}).then((response) => {
					    this.allList=response.data
					    this.$store.commit("emptyCheckIDArr")	    
					});
				},
				switching(){
					this.isAllSwitch= ! this.isAllSwitch;
					this.isToggleShow = !this.isToggleShow;
					this.isLeftSlidebar = !this.isLeftSlidebar;
				},
				/*创建文件夹*/
			    addSameLevel () {				
					var newNode = {
						id: 0,
						title: '新建文件夹',
						parentID: -1,
						children: [],
						addChildNode: true
					};
					this.$store.commit("addTreeNode", newNode);
				},
				addChildLevel () {
					var newNode = {
						id: 0,
						title: '新建子文件夹',
						parentID: this.$store.state.currentNode.id,
						children: [],
						addChildNode: true
					}
					this.$store.commit("addTreeNode", newNode);
				},
				/*试题删除*/
				deleteQuestion(id){
				 	axios.delete("/quesion/delFalseQuestion/" + id)
					.then((response) => {
						if(response.date){
							this.$message.success('删除失败！');
						}else{
							this.$message.success('删除成功！');
						}
					});
					var index =this.allList.list.findIndex((item) => {
						return item.questionModel.id == id
					});
					this.allList.list.splice(index,1);
				 },
	            deleteCount(){
	            	if(this.$store.state.checkIDArr.length<1){
	            		this.$message.warning("请选择试题");
	            	} 
	            	else {
	            		this.delDialog=true;
	            	}
	            },
	            confirmDelete(){
	            	for(var i=0;i<this.$store.state.checkIDArr.length;i++){
	            		var deleteId=this.$store.state.checkIDArr[i].id;
	            		this.deleteQuestion(deleteId);
	            	}
	            	this.delDialog=false;
	            },
	            /*全选*/
	            handleCheckAll (event) {
				 	this.allList.list.forEach((item) => {
				 		this.$store.commit("checkResource", item.questionModel);
            	   })
	            },
	            /*试题移动*/
	            moveQuestion(id){
	            	this.moveQuestionID = id;            	
	            	this.dialogVisible = true
	            },
	            moveCount(id){
	            	if(this.$store.state.checkIDArr.length<1 && this.moveQuestionID < 0){
	            		this.$message.warning("请选择试题");
	            		return ;
	            	} 
	            	else {
	            		this.dialogVisible=true;
	            	}
	            	if(id){
	            		this.moveQuestionID = id;
	            	}
	            },
	            comfirmMove(){
	            	var ids=[];
	            	if(this.$store.state.checkIDArr.length > 0) {
	            		for(var i=0;i<this.$store.state.checkIDArr.length;i++){
		            		ids.push(this.$store.state.checkIDArr[i].id);
		            	}
	            	} else if(this.moveQuestionID > 0) {
	            		ids.push(this.moveQuestionID)
	            	} else {	            		
	            		return
	            	}	            	
		   	 	 	/*var params = new URLSearchParams();
					params.append("ids", ids.toString());
		   	 	 	params.append("parentid",this.chooseFolderID);*/
					axios.put('/quesion/updateQuestionsParentid', qs.stringify({
						"ids":ids.toString(),
						"parentid":this.chooseFolderID
					}))
					.then((response) => {
						this.dialogVisible=false;
						this.chooseFolderID = -2
						this.searchQuestion()
					});
		        },
	            chooseTreeNode (nodeData){
	            	this.chooseFolderID = nodeData.folderID;           	
	            },
	            loadTree (node, resolve) {	            	
	            	var parentID = -1;
	            	if(node.id > 0){
	            		parentID = node.data.folderID
	            	}
	            	axios.get('/quesion/findFolderList', {
	            		params: {
	            			parentid: parentID
	            		}
	            	}).then(function(response) {
	            		var treeData = []
	            		response.data.forEach(function(item){
	            			treeData.push({
	            				folderID: item.id,
	            				label: item.title
	            			})	            			
	            		})	            		
	            		resolve(treeData)
	            	}) 
	            }
		    }
	    }
</script>

<style scoped>
	@import '../assets/css/index.css';
</style>