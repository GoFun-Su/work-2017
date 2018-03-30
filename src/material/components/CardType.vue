<!-- ****素材复选框组件**** -->
<template>	
	<div class="hoverFile" @dblclick='previewMaterial' v-bind:class="{listBackground : isListBackground,borderActive : checked}" @mouseover="hoverShow = true" @mouseout="hoverShow = false">		
		<div v-show="isListBackground" @change="checkedFile" style="width:30px;">		
			<el-checkbox v-model="checked" >
				<span></span>
			</el-checkbox>
		</div>	
		<a href="javascript:;" @click="enterFolder" v-bind:title="file.name">
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
			<p v-else >
				<i class="iconfont icon-fujianleixingqita" style="color:#ea5947;"></i>
			</p>					
		</a> 

		<input type="text" v-model="file.name" class="fileName" v-bind:class="{active : isActive}" :disabled="! editName"  v-focus="editName" @keyup.enter="updateName" v-on:blur="updateName"   ref="enter"/>
		
	</div>
</template>	
<script>	
	var newFileName="";
	export default {
		name:'CardType',
		props: ['file'],
		data () {
			return {				
				folderName: '',
				hoverShow:false,
				isActive:false	
			}
		},
		watch:{
			editName: 'startEditName'
		},
		computed:{			
			editName (){
				return this.file.hasFolder == '1' 
					&& (this.file.id < 1 || (this.checked && this.$store.state.changeName));
			},
			checked (){
				return this.$store.state.checkIDArr.findIndex((item) => {
					return item.id == this.file.id && item.hasFolder == this.file.hasFolder;
				}) > -1;
			},
			isListBackground (){
				return this.hoverShow || this.checked;					
			}
		},
		updated (){
			if(this.file.id==0||this.file.id < 1 || (this.checked && this.$store.state.changeName)){
				this.isActive=true
			}else{
				this.isActive=false
			}	
		},
		methods :{
			startEditName (){
				this.folderName = this.file.name;
			},		
			checkedFile(){
				this.$store.commit("checkResource", this.file);
			},
			enterFolder(){
				if(this.file.hasFolder == '0'){	
					return ;			
					//window.open('http://leicloud.ulearning.cn/' + this.file.filePath + "?attname=" + this.file.name);
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
<style scoped>
	.listBackground{
		background: #f1f3f7;
		border-radius: 6px;
	}
	.hoverFile{
		border-top:1px solid #fff;
	}
	.borderActive{
		width: 120px;
		height: 120px;
		border:1px solid #ea5947;
	}
	.borderActive .fileName{
		margin-top:-47px;
		background: #f1f3f7;
	}
	.fileName{
		display: block;
		height: 20px;
		line-height: 20px;
		text-align: center;
		border:0;
		color: #444;
		background: #fff;
		font-weight: normal;
		font-size: 14px;
		width: 110px;
		padding-right: 10px;
		margin: -10px 0 0 4px;
		overflow:hidden;
		white-space:nowrap;  
		text-overflow:ellipsis;
		-moz-text-overflow: ellipsis; 
		-webkit-text-overflow: ellipsis; 
	}
	
	.active{
		background: #fff !important;
		border:1px solid #ea5947;
	}
	.el-checkbox, .el-checkbox__input{
		position: absolute!important;
		top:5px;
		left: 5px;
	}

</style>
