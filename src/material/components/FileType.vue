<!-- ******列表字体图表判断组件***** -->
<template>		
	<a href="javascript:;">
		<p v-if="hasFolder==1" @click="enterFolder">
			<i class="iconfont icon-fujianleixingwenjianjia" style="color:#EFCE4A;"></i>
		</p>	
		<p v-else-if="hasFolder==0 && fileType=='txt'">
			<i class="iconfont icon-fujianleixingtxt" style="color:#AF9BE3;"></i>
		</p> 
		<p v-else-if="hasFolder==0 && fileType=='word'">
			<i class="iconfont icon-fujianleixingword" style="color:#529FFF;"></i>
		</p>
		<p v-else-if="hasFolder==0 && fileType=='doc'">
			<i class="iconfont icon-fujianleixingword" style="color:#529FFF;"></i>
		</p>
		<p v-else-if="hasFolder==0 && fileType=='mp4'">
			<i class="iconfont icon-fujianleixingshipin" style="color:#EFC756;"></i>
		</p> 
		<p v-else-if="hasFolder==0 && fileType=='avi'">
			<i class="iconfont icon-fujianleixingshipin" style="color:#EFCF4A;"></i>
		</p>
		<p v-else-if="hasFolder==0 && fileType=='zip'">
			<i class="iconfont icon-fujianleixingyasuobao" style="color:#EFCE4A;"></i>
		</p> 
		<p v-else-if="hasFolder==0 && fileType=='excel'">
			<i class="iconfont icon-fujianleixingexcel" style="color:#7DCCAC;"></i>
		</p> 
		<p v-else-if="hasFolder==0 && fileType=='pdf'">
			<i class="iconfont icon-fujianleixingpdf"  style="color:#F36666;"></i>
		</p> 
		<p v-else-if="hasFolder==0 && fileType=='ppt'">
			<i class="iconfont icon-fujianleixingppt" style="color:#F36666;"></i>
		</p> 							
		<p v-else-if="hasFolder==0 && fileType=='mp3'">
			<i class="iconfont icon-fujianleixingyinpin" style="color:#859DD5;"></i>
		</p>
		<p v-else-if="hasFolder==0 && fileType=='jpg'||fileType=='png'||fileType=='gif'">
			<i class="iconfont icon-fujianleixingtupian" style="color:#D1469D;"></i>
		</p>
		<input type="text" value="{{fileName}}" class="fileName" :class="{active : isActive}" @click="focusFileName" />	
		<div v-bind:class="{editName : editName}" v-if="editName">
			<font class="iconfont icon-duigou" @click="updateName"></font>
			<font class="iconfont icon-lei_guanbi" @click="cancel"></font>
		</div>		
	</a>
</template>
<script>
	var addUrl="/folder/saveOrUpdateFolder"
	var parentId= -1;	
	export default {
		name: "FileType",
		props: ["hasFolder", "fileType", "fileName", "fileID"],
		data () {
			return {	
				editName:false,
				isActive:false,
				myfilename:''
			}
		},
		created() {
			this.myfilename = this.fileName;
		},
		updated () {
			// this.myfilename = this.fileName;
			if(this.fileID < 1){
				this.editName=true
				this.isActive=true
			}
		},
		methods:{
			focusFileName:function(){				
				this.editName=! this.editName
			},
			updateName:function(){
				var _this=this;				
				axios.post(addUrl, {
			      	folderName : _this.myfilename,
			       	parentId : parentId,
			       	folderId: _this.fileID	    	
			  	})
			   	.then(function (response) {	
			   		console.log(response.data)		  		
			     	if(response.data.folderId) {
			     		_this.$root.eventHub.$emit('success');
			     		var index = _this.$root.allFileList.map(function(item){
			     			return item.id;
			     		}).indexOf(_this.myfilename);
			     		_this.$root.allFileList.splice(index, 1, response.data);
			     	}  	
				 })
				 .catch(function (error) {
			     	console.log(error);
			   	});
			},
			cancel: function(){	
				this.editName=false;
				this.backActive=true

			},
			//点击文件夹进入二级文件
			enterFolder:function(){
				this.$router.push("/1/" + this.fileID + "/" + 1);
			}
		}
	}
</script>
<style scoped>
.fileName{
	height: 20px;
	line-height: 20px;
	text-align: center;
	border:0;
	color: #969696;
	font-weight: normal;
	font-size: 14px;
	width: 100%;
	overflow:hidden;
	white-space:nowrap;  
	text-overflow:ellipsis;
	-moz-text-overflow: ellipsis; 
	-webkit-text-overflow: ellipsis;
}
.active{
	background:#f1f3f7;
	/*border:1px solid #ea5947;*/
}

.editName{
	position: absolute;
	z-index: 9;	
	bottom: 30px;
	right: -30px;	
}
.editName .iconfont{
	font-size:12px;
	color: #ea5947;
	width: 15px;
	height: 15px;
	display: block;
	position: absolute;
	border:1px solid #ea5947; 
}
.editName .icon-duigou{
	right: 10px;
}
.editName .icon-lei_guanbi{
	right: -10px;
}
</style>