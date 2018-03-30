<template>
	<div class="dialogContent" v-if="dialog">
		<div class="dialogMain">
			<p>移动到 <i class="iconfont icon-lei_guanbi" @click="close"></i></p>
			<div class="diaMessage">
				<!-- <span>{{message}}</span>
				 -->
				<Tree :data="baseData"
					  @node-expand="selectChange"					  
					  >				 	
				</Tree>
				<div>
					<!-- <button class="newFolder">新建文件夹</button> -->
					<button class="cancel" @click="close">取消</button>
					<button class="delete" @click="moveResource">确定</button>
				</div>
			</div>

		</div>
		<div class="diaMask"></div>
	</div>
</template>

<script>
	export default{
		name :'dialogContent',		
		created (){			
			this.getData(-1);
		},
		data(){
			return {
				dialog:true,
				message:"确定要删除该文件夹吗？",
				baseData: [],
				targetFolder: -2		
			}		
		},
		methods:{
			getData: function(parentID){
				var _this = this;
				var url = "/folder/getFolderList/" + parentID;
				axios.get(url).then(function(response){
					var data = [{
						title: '全部文件',
						folderID: -1,
						children: []
					}];
					data[0].children = _this.analyze(response.data);					
					_this.baseData = data;
					console.log(_this.baseData);
				});
			},
			close:function(){
				this.dialog=! this.dialog
			},
			selectChange:function(p1){
				if(! p1){
					this.targetFolder = p1[0].folderID;
				}				
			},
			analyze: function(data){
				var result = [];
				for(var i in data){
					var currentFolderName = data[i].currentFolder.folderName;
					var folderID = data[i].currentFolder.folderId;
					var treeNode = {
						title: currentFolderName,
						folderID: folderID,
						children: []
					}
					if(data[i].childFolderList.length > 0){
						treeNode.children = this.analyze(data[i].childFolderList);
					}
					result.push(treeNode);
				}				
				return result;
			},
			moveResource: function(){
				this.$root.eventHub.$emit("moveResource", this.targetFolder);
			}
		}
	}
</script>

<style scoped>
.dialogMain{
	width: 460px;
	height: auto;
	position: absolute;
	left: 50%;
	top:50%;
	z-index: 6;
	margin-left: -230px;
	margin-top: -150px;
	background: #fff;
	border-radius: 4px;
}
.diaMask{
	width: 100%;
	height: 100%;
	background: #000;
	opacity: 0.3;
	top:0;
	left: 0;
	position: fixed;
	z-index: 5;
}
.dialogMain p{
	width: 100%;
	font-size: 16px;
	line-height: 40px;
	color: #969696;
	padding-left: 20px;
	border-bottom:1px solid #f1f3f7;
}
.dialogMain i{
	float: right;
	cursor: pointer;
	margin-right: 10px;
}
.diaMessage{
	margin:20px;
	color: #969696;
}
.diaMessage span{
	width: 100%;
	display: block;
	font-size: 16px;
	line-height: 24px;
}
.diaMessage button{
	width: 80px;
	line-height: 32px;	
	border-radius: 4px;
	font-size: 14px;
	margin:30px 12px 20px 12px; 
}
.diaMessage li:hover{
	background: #f1f3f7;
}
.cancel,.newFolder{
	background: #fff;
	color: #657180;
	border:1px solid #d1d1d1;
}
.cancel{
	margin-left:100px!important;
}
.delete{
	color: #fff;
	border:0;
	background:#ea5947;
}

</style>