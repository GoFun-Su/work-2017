<template>
	<div class="container-fluid">		
		<div id="toolbar"></div>
	 	<div class="header">		 		
 			<div class="headTitle">{{name}}</div>
	 		<!--<p class="headTitle">新世纪大学英语</p>-->
	 		<p class="save" v-if="isSaving">保存中....</p>
 			<ul class="headBtn">
	 			<li style="cursor: hand;" @click="isSeeEditor">预览</li>
	 			<li @click="saveEditor">	 				
	 				保存	 					
	 			</li>
	 			<li @click="exitEditor">
	 				退出
	 			</li>
	 		</ul>
	 	</div>
	 	<div class="editMain">
	 		<div class="row" v-bind:class="{ isHidden: isHide}">
	 			<div class="leftCatalog">
	 				<CatalogNav/>
	 			</div>
			 	<div class="editCon">			 		
		 			<div class="editBodyTitle">
		 				<p style="font-size: 0.16rem;padding-left: 0.5rem;">{{$store.state.currentNode.title}}</p>
		 				<!-- <span style="font-size: 0.14rem;padding-left: 0.5rem;color: #969696;">+添加知识点</span> -->
		 			</div>
		 			<div id="editBody" class="editBody" style="border: 1px solid black;position:relative;"
		 					@dragover.prevent.stop="" @drop.prevent.stop="drop" @click="closeEdit">	
		 							
		 				<template v-for="(editor, index) in editorArr" >
		 					<ContentArea :tabindex="index"
		 						:editorModel="editor"
		 						:index="index"
		 						v-on:deleteEditor="deleteEditor(index)"
		 						@editStateChangeHandler="editStateChangeHandler"/>
		 				</template>
		 			</div>
			 	</div>
			 	<div class="rightTool" style="width: 12%;float: left;">
			 		<p class="insert">插入</p>
			 		<ul class="insertType">
			 			<li draggable="true" @dragstart="addEditor($event, 1)"><i class="iconfont icon-biaoti"></i><span>标题</span></li>
			 			<li draggable="true" @dragstart="addEditor($event, 2)"><i class="iconfont icon-wenzi"></i><span>文本</span></li>
			 			<li draggable="true" @dragstart="addEditor($event, 3)"><i class="iconfont icon-tupian"></i><span>图片</span></li>
			 			<li draggable="true" @dragstart="addEditor($event, 4)"><i class="iconfont icon-shipin"></i><span>视频</span></li>
			 			<li draggable="true" @dragstart="addEditor($event, 5)"><i class="iconfont icon-yinle"></i><span>音频</span></li>
			 			<li draggable="true" @dragstart="addEditor($event, 6)"><i class="iconfont icon-shiti"></i><span>试题</span></li>
			 			<li draggable="true" @dragstart="addEditor($event, 7)"><i class="iconfont icon-tupian"></i><span>图文混排</span></li>
			 			<li draggable="true" @dragstart="addEditor($event, 8)"><i class="iconfont icon-biaoge"></i><span>表格</span></li>
			 			<li draggable="true" @dragstart="addEditor($event, 'extra')"><i class="iconfont icon-fujian"></i><span>附件</span></li>
			 			<li draggable="true" @dragstart="addEditor($event, 'formula')"><i class="iconfont icon-gongshi"></i><span>公式</span></li>
			 		</ul>
			 	</div>
			</div>
		</div>
		<div class="editMain" v-if="isPreview">
			<div class="mask-main">
		 		<div class="row">
		 			
		 			<div class="leftCatalog">
		 				<PreCatalogNav/>
		 			</div>
				 	<div class="editCon">
				 		<i class="del" @click="isSeeEditor"></i>			 		
			 			<div class="editBodyTitle">
			 				<p style="font-size: 0.16rem;padding-left: 0.5rem;">{{$store.state.currentNode.title}}</p>
			 			</div>
			 			<div id="editBody" class="editBody" style="position:relative;">
			 				<template v-for="(editor, index) in editorArr" >
			 					<PreContentArea :tabindex="index"
			 						:editorModel="editor"
			 						:index="index" style="outline: 0;cursor: default;">
			 					</PreContentArea>
			 				</template>
			 			</div>
				 	</div>
				</div>
			</div>
		</div>
		<ResourceList :visible="visible" :type="currentType" :modifyIndex="currentIndex" @closeResourceList="visible = false"/>
	</div>
</template>
<script>
	import ResourceList from './components/ResourceList'
	import CatalogNav from './components/CatalogNav'
	import PreCatalogNav from './components/preview/PreCatalogNav'
	import PreContentArea from './components/preview/PreContentArea'
	import 'Common/assets/iconFont/iconfont.css'
	import ContentArea from './components/ContentArea'
	import {mapState} from 'vuex'
	import './assets/font'
	import 'Common/assets/css/common'
	var minWidth = 100;
	var minHeight = 100;
	const		
		HEAD = 1,//标题
		CONTENT = 2,//文本
		IMG = 3,//图片
		VIDEO = 4,//视频
		AUDIO = 5,//音频
		QUESTION = 6,//试题
		IMG_CONTENT = 7,//图文混排
		TABLE = 8;//表格
	export default {
		data () {
			return {
				visible: false,
				currentIndex: -1,
				currentType: -1,
				isSaving: false,
				name: "",
				isPreview: false,
				isHide : false			
			}
		},
		created () {		
			document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5/ 2 +'px';

			var queryString = window.location.search
			if(queryString.length > 0){				
				var params = queryString.substring(1, queryString.length).split("&")
				for(var i = 0;i < params.length;i ++){
					var item = params[i]
					var param = item.split("=")					
					if(param.length > 0 && param[0] == 'name'){
						this.name = decodeURI(param[1])
						break					
					}
				}				
			}								
		},		
		components: {
			CatalogNav,
			ContentArea,
			ResourceList,
			PreCatalogNav,
			PreContentArea
		},
		computed: {
			...mapState({
				currentEditor: state => state.editorObj.editor,
				currentBacklistID: state => state.currentNode.id,
				editorArr: state => state.editorArr
			})
		},
		watch: {
			'currentBacklistID': 'loadPage'
		},
		methods: {
			deleteEditor (index) {
				this.$store.commit("deleteEditor", index)
			},
			editStateChangeHandler (contentType, index) {
				this.visible = true
				this.currentIndex = index
				this.currentType = contentType				
			},	
			saveEditor () {				
				this.isSaving = true;				
				axios.post("/pageContentModule/" + this.currentBacklistID, this.editorArr)
				.then(({data}) => {
					data.forEach((item) => {						
						var newEditorVal = this.editorArr[item.index];
						newEditorVal.contentID = item.id;
						this.$store.commit("updateContentByIndex", newEditorVal)
					});					
					this.isSaving = false;
				});
			},
			loadPage () {
				this.$store.dispatch("loadPage", this.currentBacklistID)				
			},
			addEditor (e, type) {
				e.dataTransfer.setData('type', type);
			},
			drop (e) {
				if(this.currentBacklistID < 0){
					return;
				}
				var type = parseInt(e.dataTransfer.getData('type'));
				if(type != HEAD && type != CONTENT && type != IMG && type != VIDEO &&type != AUDIO && type != QUESTION){
					this.$message.error('正在开发中.....');
					return;
				}

				var width = 100;
				if (type == 1 || type == 2) {
				 	width = 400/type;
				 }else{
				 	width = minWidth;
				 }
				
				this.$store.commit("addEditor", {
					contentID: -1,
					relationID: -1,
					backlistID: this.currentBacklistID,
					position: {
						top: e.layerY,
						left: e.layerX,
						height: minHeight,
						width: width
					},
					content: '',
					contentType: type					
				});
			},
			closeEdit () {
				this.$store.commit("setEditorID", -1);
			},
			exitEditor () {
				window.location.href = 'bookManage.html'
			},
			isSeeEditor(){
				this.isPreview = !this.isPreview;
				this.isHide = !this.isHide;
			}
		}
	}
</script>
<style>
	li button {
		border: none;
		background-color: #fff;
		outline:none;
	}
	.row.isHidden{
		height: 750px;
		overflow: hidden;
	}
	.mask-main .row{
		width: 70%;
		margin: 0 auto;
		background-color: rgba(255,255,255,1);
		height: 100%;
		border-radius: 10px;
	}
	.mask-main {
	        text-align: center;
	        line-height: 2;
	        color: #000;
	        position: fixed;
	        left: 0;
	        right: 0;
	        top: 0;
	        bottom: 0;
	        background-color: rgba(0,0,0,0.40);
	        z-index: 1000;
	        padding-top: 20px;
	        padding-bottom: 20px;
    	}
    	.mask-main .catalog ,.mask-main .backlist{
    		position: static;
    	}
    	.mask-main .editCon {
	    	height: 7rem;
	    	top: 0;
	    	width: 80%;
	   	height: 100%;
	   	border-radius: 10px;
	}
	.mask-main .editBodyTitle{
		height: 10%;
		margin-top: 0;
		background-color: #fff;
		text-align: left;
	}
	.mask-main .editBodyTitle p{
		margin: 0;
		padding-top: 10px;
	}
	.mask-main .editBody{
	    	overflow-y: scroll;
    	    	height: 90%;
    	    	width: 100%;
    	    	box-sizing: border-box;
    	    	background-color: transparent;
	}
	.mask-main .leftCatalog{
		width: 20%;
		box-sizing: border-box;
		height: 100%;
    		border: none;
    		border-right: 1px solid #d5d5d5;
	}
	.mask-main .backlist{
		width: 100%;
	}
	.mask-main .backlist li span{
		width: 100%;
	}
	.mask-main .del{
		position: absolute;
		background: url("./assets/img/delete.png");
		width: 30px;
		height: 30px;
		display: block;
		z-index: 200;
		background-size: 30px;
	    	right: 30px;
	    	top: 10px;
	    	border-radius: 30px;
	    	opacity: .3;
	}
	.mask-main .clearfix{
		text-align: left;
	}
	@import './assets/edit.css'
</style>