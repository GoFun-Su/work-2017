<!-- ****我的素材首页*** -->
<template>
	<div id="app" v-infinite-scroll="loadMore" 
		infinite-scroll-distance="0" 
		infinite-scroll-disabled="$store.state.disableScroll">			
		<Navigation/>
		<div class="content">
			<el-row :gutter="20">
			  <el-col :span="3"><Directory/></el-col>
			  <el-col :span="21">
			    <operation v-on:listSwitch="listSwitch" v-on:switchShowTree="switchShowTree"/>	
				<allMaterialList :allFileList="allFileList"/>
			   </el-col>
			</el-row>						
			<dialogContent v-if="showTree"/> 
		</div>			
	</div>
</template>
<script>	
	import Navigation from 'Common/components/Navigation'
	import Directory from './components/Directory'
	import operation from './components/fileOperation'
	import allMaterialList from './components/allMaterialList'
	import dialogContent from 'Common/components/dialog'
	export default {
		data () {
			return {
				ok: true,
				show:false,
				showTree: false,
				busy: false
			}
		},
		created (){			
			this.getData();
		},		
		watch: {
			'$route': 'getData'
		},		
		computed: {
			allFileList: function(){
				return this.$root.allFileList;
			}
		},
		components: {
			'Navigation': Navigation,
			'Directory': Directory,
			'operation': operation,
			'allMaterialList': allMaterialList,
			'dialogContent': dialogContent
		},
		methods: {
			loadMore (){
				if(! this.$store.state.disableScroll){
					this.$store.commit("turnPage");					
					this.getData();				
				}			
			},
			getData(){
				if(this.$route.path.indexOf("folder") > -1){					
					this.$store.dispatch('getResourceByFolder', this.$route.params.id);
				} else if(this.$route.path.indexOf("type") > -1){
					this.$store.dispatch('getResourceByType', this.$route.params.type);
				} else if(this.$route.path.indexOf("search") > -1){
					this.$store.dispatch('getResourceByKeyworkds', this.$route.params.searchKey);
				}
			},
			//列表显示样式转换	
			listSwitch:function(){			
				this.ok = ! this.ok;
			},
			switchShowTree: function(){
				this.showTree = true;
			}
		}
	}
</script>
<style>
	@import '../common/assets/css/common.css';
	.content{
		margin-top: 20px;
		width: 100%;
	}
	.el-upload-list__item-name{
		width: 300px !important;
	}
	
</style>