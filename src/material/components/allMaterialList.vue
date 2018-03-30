<!-- ****横铺素材列表组件******* -->
<template>	
<div>
	<div class="rightContent" v-cloak >
		<p class="allMaterial">
			<el-checkbox
			v-model="checkAll"
            :indeterminate="indeterminate"
            :value="checkAll"
            @change="handleCheckAll">全选</el-checkbox>
			<span>				
				<el-breadcrumb separator=">">
					<template v-for="nav in navList">
						<el-breadcrumb-item :to="nav.url">
							<span style="margin-left:5px;">{{nav.name}}</span>
						</el-breadcrumb-item>	
					</template>					
				</el-breadcrumb>				
			</span>				
		</p>		
		<ul class="staticHover" v-bind:class="{allFileVertical: listType, fileList: !listType}" v-cloak >
			<li v-for="file in allFileList" class="clearfix"  >
				<ListType :file="file" v-if="listType" />
				<CardType :file="file" v-else/>				
			</li>
		</ul>		
	</div>
</div>
</template>
<script>
	import ListType from "./ListType"
	import CardType from "./CardType"
	export default {
		name:'allMaterialList',
		components: {
			ListType, CardType
		},
		data () {
			return {
				isIndeterminat : true
			}			
		},		
		computed: {
			listType (){
				return this.$store.state.listType;
			},
			indeterminate: function(){
				return this.$store.state.allResourceList.length > 0 
				&& this.$store.state.checkIDArr.length != this.$store.state.allResourceList.length
				&& this.$store.state.checkIDArr.length > 0;
			},
			checkAll (){
				return this.$store.state.allResourceList.length > 0 
				&& this.$store.state.checkIDArr.length == this.$store.state.allResourceList.length;
				this.isIndeterminate = false;
			},
			allFileList: function(){
				return this.$store.state.allResourceList;
			},
			navList (){
				return this.$store.state.folderNav;
			}
		},
		methods :{			
			//实现复选框效果
			handleCheckAll (event) {
            	/*this.$store.state.allResourceList.forEach((item) => {
            		this.$store.commit("checkResource", item);
            	});*/
            	this.$store.state.checkIDArr = event.target.checked ?  this.$store.state.allResourceList : [];
            },
            hoverShow(){
            	this.$refs.hoverShow.isListBackground()
            }
		}
	}
</script>

<style>	
	@import '../assets/index.css';
</style>