<template>
	<el-dialog 
			:visible.sync="visible"
			:before-close="handleClose">
		<el-table style="width: 100%;"
			   :data="tableData"
			   ref="singleTable"
			   highlight-current-row
			  @current-change="handleCurrentChange">
			  <el-table-column prop="questionModel.title" :label="title" v-if="type == 6">					
			</el-table-column>
			<el-table-column prop="name" :label="title" v-else>					
			</el-table-column>
		</el-table>			
		<el-pagination layout="prev, pager, next"
			:total="resourceTotalPage">				
		</el-pagination>			
		<span slot="footer" class="dialog-footer">		      
	      		<el-button type="primary" @click="choseContent">确 定</el-button>
	    	</span>
	</el-dialog>
</template>
<script>
	const	typeList = {
			1: "标题",
			2: "文本",
			3: "图片列表",
			4: "视频列表",
			5: "音频列表",
			6: "试题列表",
			7: "图文混排",
			8: "表格"
	}	
		 
	export default {
		props: ['type', 'modifyIndex', 'visible'],
		data () {
			return {
				tableData: [],
				currentRow: null,
				resourceTotalPage: 0
			}
		},
		computed: {
			title(){ //设置头部title
				return typeList[this.type]
			}
		},
		watch: {
			'visible': function(value){
				if(value){
					this.showImgList()
				}
			}
		},
		methods: {
			handleClose(done) {
				this.$emit("closeResourceList")
			},
			choseContent () {
				if (this.type == 6) {
					this.contentTypeSiTi()
				}
				if (this.type == 3 || this.type == 4) {
					this.contentTypeNotSiTi()
				}
				if (this.type == 5) {
					this.contentTypeAudio()
				}
				
			},	
			contentTypeSiTi(){
				this.$store.commit("synContent", {
					content: JSON.stringify(this.currentRow),
					index: this.modifyIndex,
					relationID: this.currentRow.questionModel.id
				})
				this.$emit("closeResourceList")
			},
			contentTypeNotSiTi(){
				this.$store.commit("synContent", {
					content: this.currentRow.filePath,
					index: this.modifyIndex,
					relationID: this.currentRow.id
				})
				this.$emit("closeResourceList")
			},
			contentTypeAudio(){
				this.$store.commit("synContent", {
					content: JSON.stringify(this.currentRow),
					index: this.modifyIndex,
					relationID: this.currentRow.id,
					obj: {
						name: this.currentRow.name,
						url: this.currentRow.filePath
					} 
				})
				this.$emit("closeResourceList")
			},		
			handleCurrentChange(val) {
		     		 this.currentRow = val
		    	},
			showImgList () {
			  	var contentType = this.type
			  	var _self = this
			  	var instance = axios.create(
					{
					baseURL: "/api/material"
					}
			 	 )
			  	var type = -1
			  	if(contentType == 3){
			  		type = 3
			 	 }
			  	if(contentType == 4){
			  		type = 2
			 	 }
			  	if(contentType == 6){
				  	  instance.get("../questions/quesion/findAllQuestion?type=0&hardlevel=0&parentid=-1&pageNumber=1&pagesize=10")
					  	    .then(function({data}){
					  		 _self.resourceTotalPage = data.pages
							 _self.tableData = data.list
					 	   })
			 		 return;
			  	}
			  	if(contentType == 5){
				  	  instance.get("../material/folder/materialAllType?materialType=4&timeOrNameOrder=1&pagenum=1&pagesize=20")
					  	    .then(function({data}){
					  		 _self.resourceTotalPage = data.pages
							 _self.tableData = data.list
					 	   })
			 		 return;
			  	}		  
			  	instance.get("/folder/materialAllType?materialType=" + type + "&timeOrNameOrder=1&pagenum=1&pagesize=20")
			  		.then(function({data}){
			  			_self.resourceTotalPage = data.pages
						_self.tableData = data.list
			  		})
				},
			}
		}
</script>
<style>
	
</style>