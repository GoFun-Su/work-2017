<!-- ****我的试题首页*** -->
<template>	
	<div id="app">
		<div class="content">	
			<index />	
		</div>	
	</div>
</template>
<script>	
	import index from './components/index'
	export default {
		data () {
			return {}
		},
		components: {
			'index' : index,
		}
	}
</script>
<style>
	@import '../common/assets/css/common.css';
</style>