<template>
<div>
	<ul class="Qcommon clearfix" >		
		<li @change="checkedQuestion"><el-checkbox v-model="checked"></el-checkbox></li>
		<li>
			{{ moment(question.questionModel.updatetime).format('YYYY-MM-DD hh:mm:ss')}}
		</li>
		<li v-if="question.questionModel.type==1">单选题</li>
		<li v-else-if="question.questionModel.type==2">多选题</li>
		<li>
			<el-rate
			  v-model="hardLevel"
			  disabled
			  show-text
			  text-color="#ff9900"
			  text-template="难度">
			</el-rate>
		</li>
		<li>上次修改：{{moment(question.questionModel.updatetime).format('YYYY-MM-DD hh:mm:ss') }}</li>
		<li class="edit" style="margin-left:9%;">
			<i class="iconfont icon-action_edit" @click="editQuestion"></i>
			<i class="iconfont icon-action_share"></i>
			<i class="iconfont icon-action_move" @click.stop="openMoveDialog"></i>
			<i class="iconfont icon-action_delete" @click.stop="deleteQuestion"></i> 
		</li>		
	</ul>
	<!-- 删除弹框 -->
	<el-dialog title="确认删除" v-model="delDialog">
		<p class="delConfirm">是否确认删除</p>
		<span solt="fotter" class="dialog-footer">
			<el-button @click="confirmDelete" class="confirm">确认</el-button>
			<el-button @click="delDialog = false" class="delete">取消</el-button>
		</span>
	</el-dialog>
</div>	
</template>
<script>
	 export default {
	 	name :'Qcommon',
	 	props:['question'],
	    data() {
	      return {
	      	routerId:'',
	      	delDialog:false,
	      	level: this.question.questionModel.hardlevel
	      }
	    },
	    computed:{
	    	checked (){
				return this.$store.state.checkIDArr.findIndex((item) => {
					return item.id == this.question.questionModel.id;
				}) > -1;
			},
			hardLevel () {
				return this.question.questionModel.hardlevel
			}
	    },
	    methods:{
	    	moment(date) {
			    return moment(date);
			},
			checkedQuestion(){
				this.$store.commit("checkResource", this.question.questionModel);
			},
		    deleteQuestion () {
		    	this.delDialog=true;
	   	 	}, 
	   	 	editQuestion(){
	   	 		this.$router.push("/radioQuestions/" + this.question.questionModel.id);
	   	 	},
	   	 	confirmDelete(){
	   	 		this.delDialog=false;
		    	this.$emit('deleteQuestion',this.question.questionModel.id);
	   	 	},
	   	 	openMoveDialog(){
				this.$emit('moveQuestion', this.question.questionModel.id);
	   	 	}
	    }
	}
 </script>
 <style>
 	.Qcommon{
 		width: 850px;
 	}
 	.Qcommon li{
 		float: left;
 		margin-left: 15px;
 	}
 	.Qcommon li:first-child{
 		margin-left: 0px;
 	}
 	.edit i{
 		color: #969696;
 		margin-left: 5px;
 	}
 	.delConfirm,.dialog-footer{
		width:100%;
		text-align: center;
	}
	.delConfirm{
		font-size: 16px;
	}
	.dialog-footer{
		margin-top: 30px;
		display: block;
	}
	.dialog-footer button{
		width: 80px;
	}
	.confirm{
		background:#ea5947!important;
		color:#fff!important;
	}
	.confirm:hover{
		color: #fff;
		border-color: #ea5947;
	}
	/*难度级别样式*/
	.el-rate{
		margin-left: 25px;
		position: relative;
	}
	.el-rate span:last-child{
		position: absolute;
		left: -25px;
		top:3px;
	}
	.el-rate span:first-child{
		margin-left: 10px;
	}
 </style>