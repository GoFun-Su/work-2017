<template>
	<!-- <div style="position:absolute;overflow:hidden;cursor: move;"
		v-bind:class="{myborder: isFocus}"
		v-bind:style="cssStyle"		
		@mousedown="move"
		@blur.stop="isFocus = false"
		@focus.stop="isFocus = true"
		@dblclick="editContent"
		@click.stop=""
		@keyup.delete.stop="deleteEditor"
		class="unselectable"> -->
		<div style="position:absolute;overflow:hidden;cursor: move;"
		v-bind:class="{myborder: isFocus}"
		v-bind:style="cssStyle"		
		@mousedown="move"
		@blur.stop="isFocus = false"
		@focus.stop="isFocus = true"
		@dblclick="editContent"
		@click.stop=""
		@keyup.delete.stop="deleteEditor">
 		<TextHeader 
 			:isEdit="isEdit" 
 			:componentID="componentID" 
 			:editorModel="editorModel" 
 			:index="index"
 			v-if="editorModel.contentType == 1"/>
 		<TextComp
 			:isEdit="isEdit"
 			:componentID="componentID"
 			:editorModel="editorModel"
 			:index="index"
 			v-if="editorModel.contentType == 2"/>
 		<ImgComp
 			:isEdit="isEdit"
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
 			:isEdit="isEdit"
 			:componentID="componentID"
 			:editorModel="editorModel"
 			:index="index"
 			v-if="editorModel.contentType == 6"
 			/>
		<div style="top: 0;width: 5px;cursor:w-resize;height: 100%;position:absolute;"
				@mousedown.stop="resize($event, true, false, false, true)"></div>
  		<div style="top: 0;width: 5px;cursor:w-resize;height: 100%;position:absolute;right:0;"
  				@mousedown.stop="resize($event, false, false, false, true)"></div>
  		<div style="top: 0;height: 5px;cursor:n-resize;width: 100%;position:absolute;"
  				@mousedown.stop="resize($event, false, true, true, false)"></div>
  		<div style="bottom: 0;height: 5px;cursor:n-resize;width: 100%;position:absolute;"
  				@mousedown.stop="resize($event, false, false, true, false)"></div>  		
	</div>
</template>
<script>
	var minWidth = 100
	var minHeight = 100	
	import TextHeader from './HeaderComp'
	import TextComp from './TextComp'
	import ImgComp from './ImgComp'
	import VideoComp from './VideoComp'
	import AudioComp from './AudioComp'
	import QuestionComp from './QuestionComp'
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
			isEdit () {
				return this.$store.state.editorID == this.componentID
			},
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
			editContent () {
				this.$store.commit("setEditorID", this.componentID)
				if(this.isEdit && (this.editorModel.contentType == 3 || this.editorModel.contentType == 4 || this.editorModel.contentType == 5 || this.editorModel.contentType == 6)){
					this.$emit("editStateChangeHandler", this.editorModel.contentType, this.index)
				}
			},
			resize (e, isLeft, isTop, lockX, lockY) {
				var tempPostionObj = this.editorModel
				tempPostionObj.index = this.index

		  		var dragSrcElement = e.srcElement || e.target;
		  		var disX = e.clientX - dragSrcElement.offsetLeft;
		  		var disY = e.clientY - dragSrcElement.offsetTop;
		  		var iParentTop = this.position.top;
		  		var iParentLeft = this.position.left;
		  		var iParentWidth = this.position.width;
		  		var iParentHeight = this.position.height;
		  		document.onmousemove = (e) => {		  			
		  			var iL = e.clientX - disX;
		  			var iT = e.clientY - disY;
		  			var container = dragSrcElement.parentElement.parentElement;
		  			var maxW = container.clientWidth - this.position.left - 2;
		  			var maxH = container.clientHeight - this.position.top - 2;		  			
		  			var iW = isLeft ? iParentWidth - iL : dragSrcElement.offsetWidth + iL;
		  			var iH = isTop ? iParentHeight - iT : dragSrcElement.offsetHeight + iT;		  					  			
		  			if((isLeft && this.position.left < 3 && iL < 0)
		  				|| (isTop && this.position.top < 3 && iT < 0)){		  				
		  				return;
		  			}
		  			isLeft && (tempPostionObj.position.left = iParentLeft + iL);
		  			isTop && (tempPostionObj.position.top = iParentTop + iT);
		  			iW < minWidth && (iW = minWidth);
		  			iW > maxW && (iW = maxW);
		  			lockX || (tempPostionObj.position.width = iW);
		  			iH < minHeight && (iH = minHeight);
		  			iH > maxH && (iH = maxH);
		  			lockY || (tempPostionObj.position.height = iH)
		  			this.$store.commit("modifyEditor", tempPostionObj)
		  			if((isLeft && iW == minWidth) 
		  				    || (isTop && iH == minHeight)){
		  				document.onmousemove = null;
		  			}		  			
		  		}
		  		document.onmouseup = function (e) {
		  			document.onmousemove = null;
		  			document.onmouseup = null;
		        	this.releaseCapture && this.releaseCapture();
		  		}
		  	},
		    move (e) {		      
		      var tempPostionObj = this.editorModel
		      tempPostionObj.index = this.index

		      var disX,disY = 0;
		      disX = e.clientX - this.position.left;
		      disY = e.clientY - this.position.top;
		      var maxL = $('#editBody').width() - this.position.width;
		      var maxT = $('#editBody').height() - this.position.height;
		      document.onmousemove = (e) => {
		        var iL = e.clientX - disX;
		        var iT = e.clientY - disY;		        
		        iL <= 0 && (iL = 0);
		        iT <= 0 && (iT = 0);
		        iL >= maxL && (iL = maxL);
		        iT >= maxT && (iT = maxT);
		        tempPostionObj.position.left = iL;
		        tempPostionObj.position.top = iT;
		        this.$store.commit("modifyEditor", tempPostionObj)
		      }
		      document.onmouseup = function () {
		        document.onmousemove = null;
		        document.onmouseup = null;
		        this.releaseCapture && this.releaseCapture();
		      }
		    },
		    deleteEditor () {
		    	this.$emit("deleteEditor");
		    }
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