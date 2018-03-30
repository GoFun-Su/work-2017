<template>
	<div>
		<a-player 
			:music="song" 
			v-if="flag"  
			ref="player" 
			:autoplay = "false"/>
		</a-player>  
		<img 
			v-else 
			src="http://www.jitu5.com/uploads/allimg/141012/259147-14101214324780.jpg" 
			style="width:100px;">
	</div>
</template>
<script>	
	import VueAplayer from 'vue-aplayer'
	export default {
		props: ['editorModel', 'cssStyle'],
		data () {
			return {
				song: [],
				content: {},
				flag: false	
			}
		},
		components: {
			'a-player': VueAplayer
		},
		created() {
        			this.initAudio()
   	 	},
		mounted () {
			$(".aplayer-icon.aplayer-icon-mode").hide()
			//let aplayer = this.$refs.player.control
        			//aplayer.pause()
		},
		watch: {
			'editorModel.content': 'initAudio'
		},
		computed: {
			
		},
		methods: {
			initAudio() {
	            		 this.content = this.editorModel.obj
	            		 console.log(this.content)
	            		if (this.content != null && this.content != '' && this.content.url != "") {
	                			let obj = {};
					obj.url = 'http://leicloud.ulearning.cn/'+this.content.url;
					obj.title = this.content.name;
					obj.pic = "http://www.jitu5.com/uploads/allimg/141012/259147-14101214324780.jpg";
					obj.author = "未知";
					this.song.push(obj)
					this.flag = true;

					if (this.song.length > 1) { //第一次进入的时候长度为1，不执行
						this.song.splice(this.song.length-2, 1);
					}
					
	                		}
	            	}
		}
	}
</script>
<style>
	
</style>