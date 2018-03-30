<!--**********素材上传，创建等操作组件*************-->
<template>
	<div class="fileDo">		
		<div class="fileDoGuide">
			<ul class="fileDoLeft">
				<li>
					<el-upload 
						class="upload-demo"
				        multiple	   
				        :data='form'		      
				        :before-upload="handleBeforeUpload"				        
				        :on-success="UploadComplete"
				        action="http://upload.qiniu.com/">
				        <el-button type="primary">上传文件</el-button>			        
   					</el-upload>
		   		</li>
		    	<li @click="add" style="border: 1px solid #f2f2f2;" v-if="showCreateFolder">
		    		<a href="javaScript:;">创建文件夹</a>
		    	</li>
		    	<!-- <li><a href="javaScript:;">共享</a></li> -->
		    	<li @click="openMoveDialog">
		    		<a href="javaScript:;" v-if="checkOneMore">移动</a>
		    	</li>
		    	<li @click="delDialog=true">
		    		<a href="javaScript:;" v-if="checkOneMore">删除</a>
		    	</li>
		    	<li @click="modifyName">
		    		<a href="javaScript:;" v-if="disableChangeName">重命名</a>
		    	</li>
		    	<li @click="downLoad" class="downLoad">
		    		<a href="javaScript:;" v-if="downLoadShow">下载</a>
		    	</li>
		    	<li  v-if="downLoadShow">
		    		<router-link  :to="{name:'materialPreview',params:{id:previewId}}">预览</router-link>
		    	</li>
			</ul>
			<ul class="fileDoRight">
				<li>
					<input type="text" v-model="searchStr"  placeholder="搜索你的文件" @keyup.enter="search"/>
					<i class="glyphicon glyphicon-search" @click="search"></i>
				</li>
				<li>
					<a @click="showSort"><i class="glyphicon glyphicon-sort-by-alphabet"></i></a>
					<dl class="sort" v-if="show">
						<dt @click="sort('2')">文件名</dt>
						<dt @click="sort('1')">修改日期</dt>
					</dl>
				</li>
				<li @click="cardChang">
					<a href="javaScript:;">
						<i class="iconfont icon-liebiaos01" v-if="! listType"></i>
						<i class="iconfont icon-qiapians01" v-else></i>
					</a>
				</li>
			</ul>
		</div>
		<!-- 移动弹框 -->
		<el-dialog title="移动" v-model="dialogVisible">
				<el-tree 
				:data="treeData"
				:show-checkbox="false"
				@check-change="chooseTreeNode"
				@node-click="chooseTreeNode"
				:highlight-current="true" 
				:expand-on-click-node="false" 
				/>
			<!-- <i class="iconfont icon-fujianleixingwenjianjia" style="color:#EFCE4A;"></i> -->
			<span  class="dialog-footer">
				<el-button @click="move"  class="confirm">确定</el-button>
				<el-button @click="dialogVisible = false"  class="delete">取消</el-button>
			</span>
		</el-dialog>
		<!-- 删除弹框 -->
		<el-dialog title="确认删除" v-model="delDialog">
			<p class="delConfirm">是否确认删除</p>
			<span solt="fotter" class="dialog-footer">
				<el-button @click="delFile" class="confirm">确认</el-button>
				<el-button @click="delDialog = false" class="delete">取消</el-button>
			</span>
		</el-dialog>		
	</div>
</template>

<script>
	var uploadUrl='/getToken/getToken';
	export default{
		name:'operation',
		data () {
			return {
				ok:true,
				show:false,
				successPrompt:false,
				errorPrompt:false,
				form:{},
                searchStr: '',
                dialogVisible: false,
                chooseFolderID: -1,
                treeData: [{
                	label: "全部文件",
                	folderID: -1,
                	children: []
                }],
                delDialog: false
			}
		},
		computed: {
			previewId() {
				return this.$store.state.checkIDArr[0].id
			},
			listType () {
				return this.$store.state.listType;
			},
			//重命名显示隐藏判断
			disableChangeName(){
				return this.$store.state.checkIDArr.length == 1
				&& this.$store.state.checkIDArr[0].hasFolder==1;	
			},
			//下载显示隐藏判断
			downLoadShow(){
				return this.$store.state.checkIDArr.length == 1
				&& this.$store.state.checkIDArr[0].hasFolder==0;	
			},
			checkOneMore(){
				return this.$store.state.checkIDArr.length > 0;
			},
			showCreateFolder(){
				return this.$route.name == 'folder';
			}
		},
		methods: {
			search (){
 				if(this.searchStr==''){
					this.$message.warning("请输入要搜索的内容！");
					return;
				}else{
					this.$router.push("/search/" + this.searchStr);
				}
			},
			//创建文件夹
			add: function(){
				this.$store.commit("modifyResource", {
		            id: 0,
		            name: "新建文件夹",
		            hasFolder: 1,
		            materialType: 0,
		            fileType: "0"
        		});  

			},
			//删除文件夹
			delFile:function(){
				this.$store.dispatch("delFile");
				this.delDialog = false;				
			},
			cardChang: function(){
				this.$store.commit("changeListType");
			},			
			showSort: function(){
				if(this.show==true){
		        	this.show=false;
		        }else{
		        	this.show=true;
		        }
			},
			//重命名
			modifyName (){
				if(this.$store.state.checkIDArr.length == 1){
					this.$store.state.changeName = true;
				}
			},
			//下载
			downLoad (){
				if(this.$store.state.checkIDArr[0].hasFolder==0){					
					window.open('http://leicloud.ulearning.cn/' + this.$store.state.checkIDArr[0].filePath + "?attname=" + this.$store.state.checkIDArr[0].name);
				} 
			},

			//上传文件
			handleBeforeUpload (file) {
				var upFile=new Array();
				upFile.push(file);
				if(file.size>1024*1024*1024*2){
					this.$message.error('文件大小不能超过2G！');
					var index = upFile.findIndex((item) => {
	                 	return item.uid == file.uid;
	                });
					upFile.splice(index,1);
					return;
				}else{
					var _this = this;
	               	return axios.get(uploadUrl, {
	                   params: {
	                	   fileName: file.name
	                   }
	                })
	                .then(function (response) {
	                	var fileInfo = response.data;
	                	_this.form = {
	                		key: fileInfo.key,
	                		token: fileInfo.uptoken
	                	};
	                })
				}
            },
            UploadComplete(response, file,fileList) { 
            	var fileName = file.name;
                this.$store.dispatch("addFile", {
                	fileSize: file.size,
                	fileType: fileName.substring(fileName.lastIndexOf("."), fileName.length),
                	fileName: file.name, 
                	filePath: response.key,
                	currentFolder: this.$route.params.id
                });
                 var index = fileList.findIndex((item) => {
                 	return item.uid == file.uid;
                 });               
                 fileList.splice(index, 1);
                 if (fileList.length==0){
                 	 this.$notify({
			          title: '成功',
			          message: '上传成功！',
			          type: 'success'
			        });
                 }
            },
            //移动文件
            openMoveDialog (){
            	if(this.$store.state.checkIDArr.length < 1){
            		this.$message.warning('请选择文件或文件夹！');
            	} else {
            		var url = "/folder/folderTree";
            		axios.get(url).then((response) => {
            			this.treeData[0].children=this.analyzeTreeData(response.data);
            			this.dialogVisible = true;
            		});
            	}
            },
            analyzeTreeData(data){
            	var result = [];
            	data.forEach((item) => {            		
            		var treeNode = {
	            		label:item.currentFolder.folderName,
	            		folderID: item.currentFolder.folderId
            		};
            		if(item.childFolderList.length > 0){
            			treeNode.children = this.analyzeTreeData(item.childFolderList);
            		}
            		result.push(treeNode);
            	});
            	return result;
            },
            //排序
            sort(sortType){
            	this.show=false;
            	this.$store.commit("sortResource", sortType);
            	this.$store.commit("initPage");
            	var name = this.$route.name;
            	if(name == "folder"){
            		this.$store.dispatch("getResourceByFolder", this.$route.params.id);
            	} else if(name == "type"){
            		this.$store.dispatch("getResourceByType", this.$route.params.type);
            	} else if(name == "search"){
            		this.$store.dispatch("getResourceByKeyworkds", this.$route.params.searchKey);
            	}
            },
            chooseTreeNode (nodeData){
            	this.chooseFolderID = nodeData.folderID;           	
            },
            move (){
            	this.$store.dispatch("moveResource", this.chooseFolderID)
            	.then((response) => {				
					if(response.data.code == '2'){
						this.$message.error(response.data.msg);
					} else {						
						this.dialogVisible = false;
						this.$router.push({
							path: this.$route.path,
							query: {
								reload: true
							}
						});
						this.$store.state.checkIDArr = [];						
					}
				});
            }
		}
	}
</script>

<style scoped>
	.fileDoGuide{
		width: 100%;
		height:32px;
	}
	.fileDoLeft li{
		float: left;
		height: 32px;
		line-height: 32px;
		text-align: center;
		margin-left: 10px;
		padding: 0 10px 0 10px;
		border-radius: 4px;		
	}	
	.fileDoLeft li:first-child{
		margin-left: -4px;
	}
	.fileDoLeft li:first-child a{
		color: #fff;
	}
	.fileDo li a{
		color: #969696;
	}
	.allMaterial input{
		width: 25px;
		height: 25px;
		border: none;
		float: left;
		background:#fff;
	}
	.allMaterial span{		
		line-height: 20px;
		margin-left: 10px; 
		height: 20px;
		margin-top: 5px;
		display:inline-block;
	}
	.allMaterial font{
		display: block;
		width: 70px;
		float: left;
		border-left:1px solid #f1f3f7;
		padding-left: 10px;
	}
	.fileDoRight{
		float: right;
		position: relative;
		margin-right: 20px;
	}
	.fileDoRight li{
		position: relative;
		float: left;
		color: #969696;
		line-height: 32px;
		margin-left: 10px;
	}
	.fileDoRight input{
		border:0;
		height: 32px;
		width: 190px;
		outline: none;
		text-align: left;
		padding-left: 20px;
		border-radius: 24px;
		background: #f1f3f7;
	}
	.glyphicon-search{
		top: 10px;
		right: 20px;
		cursor: pointer;
		position: absolute;
	}
	.sort{
		height: 80px;
		width: 120px;
		right: -30px;
		font-size: 14px;
		border:1px solid #f1f3f7;
		position: absolute;
	}
	.sort dt{
		line-height: 40px;
		text-align: center;
	}
	.sort dt:hover{
		cursor: pointer;
		background: #f1f3f7;
	}
	.success, .error{
		top: 50%;
		left: 50%;
		margin-left:-75px;
		margin-left:-25px;
		position: absolute;
		width: 150px;
		height: 50px;
		font-size: 15px;
		line-height: 30px;
		color: #fff;
		background: #000;
		opacity: 0.5;
	}
	.el-button--primary,.el-button--primary:hover{
		background: #ea5947;
		border-color:#ea5947;
		height: 32px;
		line-height: 10px;
	}
	/***弹框样式***/
	.delConfirm,.dialog-footer{
		width: 100%;
		text-align: center;
	}	
	.el-tree-node{
		width: 100% !important;
		float: left !important;
	}
	.delConfirm,.dialog-footer{
		width:100%;
		text-align: center;
	}
	.delConfirm{
		font-size: 16px;
	}
	.dialog-footer{
		margin-top: 30px;
		display: block;
	}
	.dialog-footer button{
		width: 80px;
	}
	.confirm{
		background: #ea5947;
		color:#fff;
	}
	.confirm:hover{
		color: #fff;
		border-color: #ea5947;
	}
	.delete:hover{
		color: #444;
		border-color: #444;
	}
	.downLoad{
		margin-left: -15px!important;
	}
</style>