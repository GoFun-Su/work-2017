<template>
		<div style="position:absolute;overflow:hidden;cursor: move;"
		       v-bind:style="cssStyle">
 		<TextHeader 
 			:componentID="componentID" 
 			:editorModel="editorModel" 
 			:index="index"
 			v-if="editorModel.contentType == 1"/>
 		<TextComp
 			:componentID="componentID"
 			:editorModel="editorModel"
 			:index="index"
 			v-if="editorModel.contentType == 2"/>
 		<ImgComp
 			:componentID="componentID"
 			:editorModel="editorModel"
 			:index="index"
 			v-if="editorModel.contentType == 3"
 			/>
 		<VideoComp
 			:editorModel="editorModel"
 			:cssStyle="cssStyle"
 			:index="index"
 			v-if="editorModel.contentType == 4"
 			/>
 		<AudioComp
 			:editorModel="editorModel"
 			:cssStyle="cssStyle"
 			:index="index"
 			v-if="editorModel.contentType == 5"
 			/>
 		<QuestionComp
 			:componentID="componentID"
 			:editorModel="editorModel"
 			:index="index"
 			v-if="editorModel.contentType == 6"
 			/>
	</div>
</template>
<script>
	var minWidth = 100
	var minHeight = 100	
	import TextHeader from '../HeaderComp'
	import TextComp from '../TextComp'
	import ImgComp from '../ImgComp'
	import VideoComp from '../VideoComp'
	import AudioComp from '../AudioComp'
	import QuestionComp from '../QuestionComp'
	export default {
		props: ['editorModel', 'index'],
		components: {
			TextHeader,
			TextComp,
			ImgComp,
			VideoComp,
			AudioComp,
			QuestionComp
		},
		data () {
			return {
				componentID: 'id' + new Date().getTime() + Math.ceil(Math.random() * 1000),								
				isFocus: false
			}
		},		
		computed: {	
			showFocusLine () {
				return this.isFocus || this.isEdit
			},
			position () {
				return this.editorModel.position;
			},
			cssStyle () {
				return {
					top: this.position.top + 'px',
					left: this.position.left + 'px',
					height: this.position.height + 'px',
					width: this.position.width + 'px'
				};
			}
		},
		methods: {
		}
	}
</script>
<style>
	.myborder {
		border: 1px dashed #ccc; 
		outline:none;  
	}
	.unselectable {
	   -moz-user-select: -moz-none;
	   -khtml-user-select: none;
	   -webkit-user-select: none;
	   -ms-user-select: none;
	   user-select: none;
	}

	div {
		word-wrap: break-word; 
		word-break: normal; 
	}	
</style>