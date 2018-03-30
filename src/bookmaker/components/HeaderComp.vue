<template>
	<div style="height:100%;width:100%;">
		<div @mousedown.stop="" v-if="isEdit" style="height:100%;width:100%;">			
			<quill-editor
		      		v-model="content"
		      		ref="myQuillEditor"
		      		:options="editorOption"		      
		     		 style="height:100%;width:100%;">
		      	<div :id="componentID" slot="toolbar" style="position:fixed;top: 53px;left: 305px;cursor:pointer;">
			      	<span class="ql-formats">
				      <select class="ql-font"></select>
				      <select class="ql-size"></select>
				</span>
				<span class="ql-formats">
				      <button class="ql-bold"></button>
				      <button class="ql-italic"></button>
				      <button class="ql-underline"></button>
				      <button class="ql-strike"></button>
				</span>
				<span class="ql-formats">
				      <select class="ql-color"></select>
				      <select class="ql-background"></select>
				</span>
				    <!-- <span class="ql-formats">
				      <button class="ql-script" value="sub"></button>
				      <button class="ql-script" value="super"></button>
				    </span> -->
				    <!-- <span class="ql-formats">
				      <button class="ql-header" value="1"></button>
				      <button class="ql-header" value="2"></button>
				      <button class="ql-blockquote"></button>
				      <button class="ql-code-block"></button>
				    </span> -->
				<span class="ql-formats">
				      <!-- <button class="ql-list" value="ordered"></button>
				      <button class="ql-list" value="bullet"></button> -->
				      	<button class="ql-indent" value="-1"></button>
				      	<button class="ql-indent" value="+1"></button>
				</span>
				<span class="ql-formats">
				      	<button class="ql-direction" value="rtl"></button>
				      	<select class="ql-align"></select>
				</span>
				    <!-- <span class="ql-formats">
				      <button class="ql-link"></button>
				      <button class="ql-image"></button>
				      <button class="ql-video"></button>
				      <button class="ql-formula"></button>
				    </span> -->
				<span class="ql-formats">
				      	<button class="ql-clean"></button>
				</span>
		      	</div>
		</quill-editor>
	</div>		
	<div v-else v-html="content" class="ql-editor header-text"></div>
	</div>
</template>
<script>
	export default {
		props: ['isEdit', 'componentID', 'editorModel', 'index'],
		data () {
			return {
				content: '',
				editorOption: {
					modules: {
						toolbar: ''
					},
					placeholder: ''
				}
			}
		},
		created () {
			this.editorOption.modules.toolbar = '#' + this.componentID			
			this.initTextHeader()
		},
		watch: {
			'editorModel.content': 'initTextHeader',
			isEdit: function (value) {
				if(! value){
					this.$store.commit("synContent", {
						content: this.content,
						index: this.index
					})
				}
			}
		},
		methods: {
			initTextHeader () {				
				var content = this.editorModel.content;
				if(content != null && content != ''){
					this.content = content;
				} else {
					this.content = '<h1>请在此处输入标题</h1>'
				}
			}
		}
	}
</script>
<style>
	.ql-editor h1 {
		font-size: 36px !important;;
	}
	
</style>