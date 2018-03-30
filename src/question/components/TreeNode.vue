<template>
	<li @click.stop="openFolder" 
		v-bind:class="{'firstNav': firstLevel,'secondNav': ! firstLevel,'checkedColor':isCheckedColor }">
		<!-- <div v-if="isFolder && node.level !=1" v-bind:class="{triangle: open, trianglTrans: !open}"></div> -->
		<i class="iconfont icon-fujianleixingwenjianjia fileIcon" style="color:#EFCE4A;"></i>
		<span v-if="edit" class="edit">
			<input type="text"  
				v-focus 
				v-model="nodeTitle" 
				@click.stop="" 
				placeholder="新建文件夹" 
				@keyup.enter="enterTitle" 
				@blur="titleBlur"/>
		</span>
		<span v-else class="nodeTitle" v-bind:title="node.title">{{node.title}}</span>
		<div class="operationFloat">
			<i class="el-icon-edit" @click.stop="modifyName"/>
			<i class="el-icon-delete2" @click.stop="deleteNode"/>
		</div>		
		<ul v-if="isFolder" v-show="open" class="childNode">
			<treeNode v-for="child in node.children" :node="child" v-on:openParent="openParent" @setParentNode="setParentNode"/>
		</ul>
	</li>
</template>
<script>
	import { mapState } from 'vuex'
	export default {
		name: 'treeNode',
		props: ['node'],
		data () {
			return {
				open: true,
				edit: false,
				nodeTitle: ''
			}
		},
		computed: {
			isFolder () {
				return this.node.children && this.node.children.length > 0
			},
			isCheckedColor () {
				return this.currentNode != null && this.node.id == this.currentNode.id;
			},
			firstLevel () {
				return this.node.parentid < 0
			},
			...mapState({
				currentNode: state => state.currentNode
			})
		},
		created () {			
			this.changeEdit();
		},
		updated () {			
			this.changeEdit();
		},
		methods: {
			setParentNode () {
				this.$store.commit("setParentNode", this.node);
			},
			openParent () {
				this.open = true;
			},
			changeEdit () {
				if(this.node.id < 1){					
					this.$emit("openParent");
					setTimeout(() => {
						this.edit = true;
					})
				}
			},
			loadSecondTree(){
				this.$store.dispatch("loadTree", this.node.id);
			},
			openFolder () {
				this.loadSecondTree();
				if(this.isFolder){
					this.open = !this.open;
				}				
				this.$store.commit("setCurrentNode", this.node);
			},
			modifyName () {
				this.nodeTitle = this.node.title;				
				this.edit = true;
			},
			titleBlur () {
				if(this.edit){					
					if(this.nodeTitle == '' && this.node.id < 1){
						this.deleteNode()
					} else if(this.nodeTitle == '' && this.node.id > 0){
						this.$message.error('修改的标题不能为空')
					} else if(this.nodeTitle.trim().length > 0) {
						this.enterTitle()
					}
				}				
			},
			enterTitle () {				
				this.node.title = this.nodeTitle;
				if(this.node.id < 1){
					 this.$store.dispatch("createTreeNode", {
					 treeNode: this.node,
					 closeInput: () => {
						 this.edit = false;
					   }
					});
				}else{
					 this.$store.dispatch("modifyTreeNode", {
						treeNode: this.node,
						closeInput: () => {
							this.edit = false;
						}
				    });
				}
			},
			deleteNode () {
				this.$store.dispatch("deleteTreeNode", this.node);
			}
		}
	}
</script>
<style>	 
	.firstNav{
		font-size: 16px;
		border-bottom: 0;
	}
    .secondNav{
    	font-size: 14px;
    	padding-left: 20px;
    	border-bottom: 0!important;
    }
  
    /*未展开倒三角样式*/
	.triangle{
		width:0px;
		height:0px;
		display: inline-block;
		border-top:12px solid #999;
		border-left:6px solid transparent;
		border-right:6px solid transparent;
	}
	/*展开三角旋转样式*/
	.trianglTrans{
		width:0; 
	    height:0; 
		display: inline-block;
	    border-top:6px solid transparent;
	    border-bottom: 6px solid transparent;
	    border-left: 11px solid #999;
	}
	.operationFloat {
		float: right;
		display: none;
		margin-right: 3px;
		font-size: 14px;
	}
	.operationFloat i{
		color: #959595;
		font-size:14px!important;
	}
	
	.edit input{
		height: 25px;
		line-height: 25px;
		width: 60%;
	} 
	.checkedColor{
		background: #f1f3f7;
	}
	.firstNav .nodeTitle{
		width: 135px;
		height: 30px;
		border:0;
		font-size: 15px;
	}
	.firstNav:hover .nodeTitle
	,.secondNav:hover .nodeTitle{
		background: #f1f3f7;
	}
	.secondNav .nodeTitle{
		height: 30px;
		border:0;
		font-size: 14px;
		width: 120px;
	}
</style>