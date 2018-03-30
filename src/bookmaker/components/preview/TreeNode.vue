<template>
	<li @click.stop="openFolder" draggable="true" 
			v-bind:class="{'firstNav': firstLevel, 'secondNav': ! firstLevel}">
		<div v-if="isFolder && node.level != 1" v-bind:class="{triangle: open, trianglTrans: !open}"></div>
		
		<template v-else>
			<span v-if="firstLevel">
				{{node.title.length > 20 ? node.title.substring(0, 20) + '...' : node.title}}
			</span>
			<template v-else>
				{{node.title}}
			</template>
		</template>	
		<ul v-if="isFolder" v-show="open"class="childNode">
			<treeNode v-for="child in node.children" :node="child" v-on:openParent="openParent"/>	
		</ul>		
	</li>
</template>
<script>
	export default {
		name: 'treeNode',
		props: ['node'],		
		data () {
			return {
				open: false,
				edit: false,
				nodeTitle: ''
			}
		},
		computed: {
			isFolder () {
				return this.node.children && this.node.children.length > 0
			},
			firstLevel () {
				return this.node.level == 1;
			}
		},
		created () {			
			this.changeEdit();
		},
		updated () {
			this.changeEdit();
		},
		methods: {
			openParent () {
				this.open = true;
			},
			changeEdit () {
				if(this.node.id < 1){
					this.$emit('openParent')
					setTimeout(() => {
						this.edit = true
					}, 50)
				}
			},
			openFolder () {
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
				if(this.nodeTitle == ''){
					this.$store.dispatch("deleteTreeNode", this.node)
				} else {
					this.enterTitle()
				}
			},
			enterTitle () {
				if(this.nodeTitle == ''){
					this.$message.error('标题不能为空')
					return;
				}else if(this.nodeTitle.length>100){
					this.$message.warning("请输入内容在100字符以内");
					return;
				}
				this.node.title = this.nodeTitle
				this.$store.dispatch("modifyTreeNode", {
					treeNode: this.node,
					closeInput: () => {
						this.edit = false;
					}
				});
			},
			deleteNode () {
				this.$store.dispatch("deleteTreeNode", this.node);
			},
			dragstart (e) {
				e.dataTransfer.setData("text/plain", JSON.stringify(this.node));
			},
			drop (e) {			
				var offsetY = e.offsetY;
				var height = e.target.offsetHeight;								
				var targetNode = JSON.parse(e.dataTransfer.getData('text/plain'));
				var moveTreeNode = {					
					currentNodeID: targetNode.id,
					targetNode: this.node
				};
				if(targetNode.id == this.node.id){
					return;
				}
				var operationType;
				if(offsetY > (height * 1/3) && offsetY < (height * 2/3)){					
					operationType = 'appendChild'
				} else if (offsetY <= (height * 1/3)) {					
					operationType = 'appendBefore'
				} else if (offsetY >= (height * 2/3)){					
					operationType = 'appendAfter'
				}
				moveTreeNode.operationType = operationType

				this.$store.dispatch("moveTreeNode", moveTreeNode);
			}
		}
	}
</script>
<style>	
    .backlist ul{
    	padding: 0;
    	margin: 0;
    	border: 1px solid #f1f3f7;
    	border-right: 0;
    }
	.backlist li{
		list-style: none;
		position: relative;
		line-height: 50px;
	}
	.backlist li:first-child{
		border-bottom: 1px solid #f1f3f7;
	}
	.firstNav{
		font-size: 16px;
		border-bottom: 1px solid #f1f3f7;
	}
    .secondNav{
    	font-size: 14px;
    	padding-left: 20px;
    	border-bottom: 0!important;
    }

    /*未展开倒三角样式*/
	.triangle{
		display: inline-block;
		width:0px;
		height:0px;
		border-top:12px solid #999;
		border-left:6px solid transparent;
		border-right:6px solid transparent;
	}
	
	/*展开三角旋转样式*/
	.trianglTrans{
		display: inline-block;
		width:0; 
	    height:0; 
	    border-top:6px solid transparent;
	    border-bottom: 6px solid transparent;
	    border-left: 11px solid #999;
	}

	.operationFloat {
		float: right;
		position: absolute;
		top: 2px;
		right: 0;
		height: 0;
		display: none;
		margin-right: 5px;
		font-size: 14px;
	}
	
	.firstNav span{
		display: block;
		height: 50px;
	}
	.childNode{
		border:0!important;
	}
	.backlist li span{
		width: 260px;
		padding-left: 10px;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}

	.firstNav:hover > .operationFloat{
		display: block;
	}
	.secondNav:hover > .operationFloat{
		display: block;
	}
</style>