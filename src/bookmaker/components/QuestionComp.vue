<template>
	<div style="height:100%;width:100%;">
        		<div class="qs" v-if="content != null && content != '' && questionModel !=null && questionModel !=''">
            		<ul class="qs-title  clearfix">
               			 <li>
                   				 {{date}}
                			</li>
               			<li>单选题</li>
                			<li>
                    				<el-rate 
                    					v-model="questionModel.hardlevel" 
                    					disabled 
                    					show-text 
                    					text-color="#ff9900" 
                    					text-template="难度">
                    				</el-rate>
               			 </li>
                			<li>上次修改：{{date}}</li>
            		</ul>
           		 <div class="clearfix">
               			 <p class="Qtitle">
               			 	{{questionModel.title}}
               			 </p>
               			 <ul class="Qchoice">
                    				<li v-for="(item,index) in choiceItemModel">
                        				<span v-if="item.isture==1" style="color:#62B4F5">
							{{String.fromCharCode(64 + (index + 1))}}
							&nbsp;&nbsp;
							{{item.title}}
						</span>
                        				<span v-else="item.isture==0" style="color:#444">
							{{String.fromCharCode(64 + (index + 1))}}
							&nbsp;&nbsp;
							{{item.title}}
						</span>
                   				 </li>
                			</ul>
                			<div class="Qanalysis">
                   			 	<span class="jiexi">解析</span>
                   			 	<span>
                   			 		{{questionModel.correctreply}}
                   			 	</span>
                			</div>
            		</div>
        		</div>
        		<div class="qs" v-else>
            		<p>请添加标题</p>
        		</div>
    	</div>
</template>
<script>

export default {
    	name: 'QuestionComp',
    	props: ['isEdit', 'componentID', 'editorModel', 'index'],
    	components: {},
    	data() {
       		 return {
            		questionModel: {},
            		choiceItemModel: {},
           		content: "",
            		date: 0
       		 }

    	},
    	created() {
        		this.initQuestion()
   	 },
    	watch: {
       		 'editorModel.content': 'initQuestion'
    	},
   	methods: {
        		initQuestion() {
            		var content = this.editorModel.content
            		if (content != null && content != "") {
                			this.content = JSON.parse(content)
                			this.questionModel = this.content.questionModel
               			     this.choiceItemModel = this.content.choiceItemModel
                                if (this.questionModel && this.questionModel.updatetime) {
                                          this.date = moment(this.questionModel.updatetime).format('YYYY-MM-DD hh:mm:ss')
                                }
               			     
            		}

        		}
   	 }

}
</script>
<style>
	.qs {
    		width: 90%;
    		margin: 0 auto;
	}

	.qs-title li {
   		 float: left;
   		 margin-left: 15px;
	}

	.qs-title li:first-child {
   		 margin-left: 0px;
	}

	/*难度级别样式*/
	.el-rate {
    		margin-left: 25px;
    		position: relative;
	}

	.el-rate span:last-child {
    		position: absolute;
   		 left: -25px;
    		top: 3px;
	}

	.el-rate span:first-child {
    		margin-left: 10px;
	}

	/*content*/

	.Qtitle {
    		font-size: 18px;
    		line-height: 35px;
	}

	.Qchoice li {
	     line-height: 30px;
	}

	.Qanalysis span {
	    margin: 10px 0 10px 0;
	    font-size: 15px;
	    display: block;
	    width: 100%;
	}

	.jiexi {
	    height: 30px;
	    line-height: 30px;
	    text-align: center;
	    width: 65px!important;
	    background: #E3E3E9;
	    border-radius: 14px;
	    padding: 0 10px 0 10px;
	}
</style>