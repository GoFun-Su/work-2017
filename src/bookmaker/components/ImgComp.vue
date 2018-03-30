<template>
	<div style="height:100%;width:100%;">		
		<img style="height:100%;width:100%;" :src="imgSrc" draggable="false" ondragstart="return false;"/>				
	</div>
</template>
<script>
	export default {
		props: ['isEdit', 'editorModel', 'index'],
		data () {
			return {
				imgSrc: ''				
			}
		},
		created () {
			this.initImg()
		},
		watch: {
			'editorModel.content': 'initImg'			
		},
		methods: {
			initImg () {				
				var imgSrc = this.editorModel.content
				if(imgSrc != null && imgSrc != ''){
					this.imgSrc = 'http://leicloud.ulearning.cn/' + imgSrc
				} else {
					this.imgSrc = 'http://leicloud.ulearning.cn/rescourse/material/201706281445206839.png'
				}
			}			
		}
	}
</script>
<style>
	
</style>