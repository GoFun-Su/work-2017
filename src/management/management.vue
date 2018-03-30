<!-- ****机构首页*** -->
<template>	
	<div id="app">
		<div class="content">
			<div v-if="roleId==1||roleId==4">
				<index />
			</div>
			<div v-if="roleId==2">
				<orgIndex />
			</div>
		</div>	
	</div>
</template>
<script>	
	import index from './components/index';
	import orgIndex from './components/orgIndex';
	export default {
		data () {
			return {
				roleId:-1
			}
		},
		components: {
			'index' : index,
			"orgIndex":orgIndex
		},
		created(){
			this.$store.commit("get_parameter")
			this.roleId=this.$store.state.roleId;
		}
	}
</script>
<style>
	@import '../common/assets/css/common.css';
	@import './assets/manCom.css';
</style>