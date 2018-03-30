<template>
	<div class="topDiv">		
		<div class="catalog">
			<div class="cataTop">
				<h4>目录</h4>
			</div>
		</div>
		<div class="backlist">
			<ul>
				<treeNode v-for="child in tree" :node="child"/>
			</ul>			
		</div>
	</div>
</template>
<script>	
	import { mapState } from 'vuex'
	import treeNode from './TreeNode'
	export default {
		created () {
			var queryString = window.location.search
			var bookID;
			if(queryString.length > 0){				
				var params = queryString.substring(1, queryString.length).split("&")
				for(var i = 0;i < params.length;i ++){
					var item = params[i]
					var param = item.split("=")					
					if(param.length > 0 && param[0] == 'bookID'){
						this.bookID = param[1]
						break												
					}
				}				
			}
			this.$store.dispatch("loadTree", this.bookID);
			// this.$store.commit("setStoreTreeMap");
		},
		components: {
			treeNode
		},
		data () {
			return {
				bookID: -1
			}
		},		
		computed: mapState({
			tree: state => state.tree			
		}),
		methods: {
			addSameLevel () {				
				var newNode = {
					id: 0,
					title: '',
					parentID: this.$store.state.currentNode.parentID,
					level: this.$store.state.currentNode.level,
					bookID: this.bookID,
					children: []
				};				
				this.$store.commit("addTreeNode", newNode);
			},
			addChildLevel () {
				if(this.$store.state.currentNode.level > 2){
					this.$message.error("最多只能添加三级目录")
					return ;
				}
				var newNode = {
					id: 0,
					title: '',
					parentID: this.$store.state.currentNode.id,
					level: (this.$store.state.currentNode.level + 1),
					bookID: this.bookID,
					children: []
				}
				this.$store.commit("addTreeNode", newNode);
			}
		}
	}
</script>
<style>
	.el-collapse-item__header__arrow, .el-icon-arrow-right{
		display: none;
	}

	.el-collapse-item__header {
	    height: 43px;
	    line-height: 43px;
	    padding-left: 5px;
	    background-color: #fff;
	    color: #48576a;
	    cursor: pointer;
	    border-bottom: 1px solid #dfe6ec;
	    font-size: 13px;
	}

	.el-collapse-item__content {
	    padding: 0px;
	    font-size: 13px;
	    color: #1f2d3d;
	    line-height: 1.769230769230769;
	}

	.topDiv {
		height: 100%;
	}

	.backlist {
		bottom: 0;
		position: fixed;
		overflow: auto;
		width: 305px;
		height: 100%;
		top: 180px;
	}

	input[type='button'] {
		background-color: white;
		border: 1px solid #C9C9C9;
		height: 27px;
		padding: 0 8px 0 5px;
		border-radius: 5px;		
	}

	input:hover{
		cursor: hand;
	}

	.minButton {
		display: block;
		float: right;
		margin-top: 20px;
	}

	.el-tree{
		border: 0;
	}

	.el-menu-item:hover,.el-submenu__title:hover{
		background: #fff!important;
	}
	.el-menu-item{
		padding-left: 10px!important;
	}
	.catalog{
		border-bottom: 0;		
		width: 302px;
		top: 50px;
		position: fixed;		
	}
	.cataTop{
		width: 100%;
		height: 80px;
	}
	.catalog h4{
		float: left;
		line-height: 50px;
	}
</style>