<!-- ****横铺素材列表组件******* -->
<template>	
	<div class="listType"  @dblclick="previewMaterial" >
		 <div @click.prevent="checkedFile" style="float:left;">			
			<el-checkbox  v-model="checked" ></el-checkbox>
		</div>
 		<a href="javascript:;" @click="enterFolder">	
			<p v-if="file.hasFolder==1">
				<i class="iconfont icon-fujianleixingwenjianjia" style="color:#EFCE4A;"></i>
			</p>	
			<p v-else-if="file.hasFolder==0 && file.fileType=='txt'">
				<i class="iconfont icon-fujianleixingtxt" style="color:#AF9BE3;"></i>
			</p> 
			<p v-else-if="file.hasFolder==0 && file.fileType=='doc'||file.fileType=='docx'||
				file.fileType=='dot'||file.fileType=='wps'||file.fileType=='wpt'">
				<i class="iconfont icon-fujianleixingword" style="color:#529FFF;"></i>
			</p>
			<p v-else-if="file.hasFolder==0 && file.fileType=='mp4' ||file.fileType=='avi'||
				file.fileType=='rm'||file.fileType=='flv'||file.fileType=='rmvb'||file.fileType=='mpeg'
				||file.fileType=='mpg'||file.fileType=='mov'||file.fileType=='wmv'">
				<i class="iconfont icon-fujianleixingshipin" style="color:#96CFE7;"></i>
			</p> 
			<p v-else-if="file.hasFolder==0 && file.fileType=='zip'||file.fileType=='rar'||
				file.fileType=='7-zip'||file.fileType=='z'||file.fileType=='arj'||file.fileType=='tar'">
				<i class="iconfont icon-fujianleixingyasuobao" style="color:#F28340;"></i>
			</p> 
			<p v-else-if="file.hasFolder==0 && file.fileType=='xls' || file.fileType=='xlsx'||
				file.fileType=='xlt'||file.fileType=='et'||file.fileType=='ett'">
				<i class="iconfont icon-fujianleixingexcel" style="color:#7DCCAC;"></i>
			</p> 
			<p v-else-if="file.hasFolder==0 && file.fileType=='pdf'">
				<i class="iconfont icon-fujianleixingpdf"  style="color:#F36666;"></i>
			</p> 
			<p v-else-if="file.hasFolder==0 && file.fileType=='ppt'||file.fileType=='pptx'||
				file.fileType=='pot'||file.fileType=='pps'||file.fileType=='dps'||file.fileType=='dpt'">
				<i class="iconfont icon-fujianleixingppt" style="color:#F36666;"></i>
			</p> 							
			<p v-else-if="file.hasFolder==0 && file.fileType=='mp3'||file.fileType=='wma'||file.fileType=='wav'||file.fileType=='m4a'">
				<i class="iconfont icon-fujianleixingyinpin" style="color:#859DD5;"></i>
			</p>
			<p v-else-if="file.hasFolder==0 && file.fileType=='jpg'|| file.fileType=='png'|| file.fileType=='gif'|| file.fileType=='jpeg'|| file.fileType=='bmp'">
				<i class="iconfont icon-fujianleixingtupian" style="color:#D1469D;"></i>
			</p>
			<p v-else>
				<i class="iconfont icon-fujianleixingqita" style="color:#ea5947;"></i>
			</p>
					
		<input type="text" :disabled="! editName" v-model="file.name" class="fileName"  @keyup.enter="updateName" v-bind:title="file.name" v-on:blur="updateName" v-bind:class="{active : isActive}" ref="enter" v-focus="editName" />
		</a>
		<span class="doList">
			<i class="iconfont icon-action_download" @click="downFile" v-if="file.hasFolder == 0"></i>
			<!-- <i class="iconfont icon-action_share"></i>
			<i class="iconfont icon-action_move"></i>
			<i class="iconfont icon-action_edit"></i>
			<i class="iconfont icon-shanchu"></i> -->
		</span>
		<div class="createTime">{{moment(file.editorDate).format('YYYY-DD-MM hh:mm:ss')}}</div>
	</div>
</template>	

<script>
	var newFileName="";	
	export default {
		name:'ListType',
		props: ["file"],
		data () {
			return {
				newName: '',
				isActive:false
			}	
		},
		watch:{
			editName: 'startEditName'
		},
		created (){
			this.newName = this.file.name;
		},
		computed: {			
			checked: function(){
				return this.$store.state.checkIDArr.findIndex((item) => {
					return item.id == this.file.id && item.hasFolder == this.file.hasFolder;
				}) > -1;
			},
			editName (){
				return this.file.hasFolder == '1' 
					&& (this.file.id < 1 || (this.checked && this.$store.state.changeName));
			}
		},
		updated (){
			if(this.file.id==0||this.file.id < 1 || (this.checked && this.$store.state.changeName)){
				this.isActive=true
			}else{
				this.isActive=false
			}	
		},
		methods: {
			moment: function (date) {
			      return moment(date);
			    },
			startEditName (){
				this.folderName = this.file.name;
			},
			enterFolder(){
				if(this.file.hasFolder == '0'){	
					return ;			
				} else {
					this.$router.push("/folder/" + this.file.id);
				}				
			},	
			downFile(){
				if(this.file.hasFolder == '0'){	
					window.open('http://leicloud.ulearning.cn/' + this.file.filePath + "?attname=" + this.file.name);
				}
			},
			checkedFile(){
				this.$store.commit("checkResource", this.file);	
			},
			enterFolder(){
				if(this.file.hasFolder == '0'||this.isActive==true){	
					return ;			
				} else {
					this.$router.push("/folder/" + this.file.id);
				}			
			},
			updateName (event){
				if(newFileName==this.file.name){
					return;
				}
				newFileName = this.file.name;
				if(newFileName.length<2||newFileName.length>50){
					this.$message.error('请输入2~50个字符的标题');
				}else{
					this.file.parentID = this.$route.params.id;
					this.$store.dispatch("modifyFolder", this.file);
				} 
				//this.$message.success('重命名成功！');
			},									
			cancel (){
				if(this.editName){
					this.$store.commit("deleteResource", this.file);					
					this.file.name = this.folderName;
				}
			},
			previewMaterial(){
				this.$router.push("/materialPreview/" +this.file.id);
			}		   			 
		}
	}

</script>

<style>		
	.allFileVertical{
		width: 100%;
		margin: 20px 0px;
	}
	.allFileVertical li{
		height: 50px;
		width: 100%;
		position: relative;	
		border-bottom: 1px solid #f1f3f7;
	}
	.allFileVertical li:hover{
		background: #f1f3f7;
	}
	.allFileVertical li:hover .fileName{
		background: #f1f3f7;
		cursor: pointer;
	}
	.allFileVertical li:hover .doList i{
		background: #f1f3f7;
		display: block;
	}
	.listType a i{
		float: left;
		display: block;
		margin: 0px 5px 0 10px;
		font-size: 20px;
		cursor: pointer;
	}
	.doList{
		width: 100px;
		float: right;
		margin:5px 43% 0 0; 
	}
	.doList i{
		cursor: pointer;
		color: #969696;
		display: none;
		font-size: 15px;
	}
	.fileName{		
		width: 150px;
		height: 20px;
		margin:0px 0 0 10px;
		line-height: 20px;
		border:0;
		background: #fff;
		padding-left:10px;
		color: #444;
		font-size: 14px;
		overflow:hidden;
		white-space:nowrap;  
		text-overflow:ellipsis;
		-moz-text-overflow: ellipsis; 
		-webkit-text-overflow: ellipsis; 	
	}
	input[type="file"]{
		display: none;
	}
	.active{
		border:1px solid #ea5947;
	}
	.createTime{
		float: right;
	    color: #999;
	    line-height: 30px;
	    margin-right: -43%;
	}
</style>