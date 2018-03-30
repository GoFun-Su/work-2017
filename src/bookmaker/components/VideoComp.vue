<template>
	<video-player
			:options="playerOptions"
			ref="videoPlayer"
			style="width: 100%;"/>
</template>
<script>	
	import 'videojs-contrib-hls/dist/videojs-contrib-hls'	
	export default {
		props: ['editorModel', 'cssStyle'],
		data () {
			return {
				playerOptions: {					
		        }
			}
		},
		mounted () {
			this.modifyPlayerSize()
			this.initSrc()	
		},
		watch: {
			'cssStyle': 'modifyPlayerSize',
			'editorModel.content': 'initSrc'
		},
		computed: {
			player() {
		      return this.$refs.videoPlayer.player
		    }
		},
		methods: {
			initSrc () {
				var src = this.editorModel.content
				if(src && src.length > 0){					
					src = src.substring(0, this.editorModel.content.lastIndexOf(".")) + '.m3u8';
					this.player.src({
						type: "application/x-mpegURL",
			            src: 'http://leicloud.ulearning.cn/' + src,
			            withCredentials: false
					})
				}
			},
			modifyPlayerSize() {				
				this.player.width(this.editorModel.position.width)
				this.player.height(this.editorModel.position.height)

			}
		}
	}
</script>
<style>
	
</style>