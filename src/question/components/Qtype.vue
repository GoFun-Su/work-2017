<template>
	<div class="clearfix" >
		<p class="Qtitle">{{question.questionModel.title}}</p>
		<ul class="Qchoice">
			<li v-for="(lists,index) in question.choiceItemModel">
				<span v-if="lists.isture==1" style="color:#62B4F5">
					{{String.fromCharCode(64 + (index + 1))}}
					&nbsp;&nbsp;
					{{lists.title}}
				</span>
				<span v-else="lists.isture==0" style="color:#444">
					{{String.fromCharCode(64 + (index + 1))}}
					&nbsp;&nbsp;
					{{lists.title}}
				</span>
			</li>
		</ul>	
		<div class="Qanalysis">
			<span class="jiexi">解析</span>
			<span>{{question.questionModel.correctreply}}</span>
			<ul class="Qkeyword" v-if="question.questionModel.keyword.length > 0">
				<li v-for="key in question.questionModel.keyword.split(';')">
					{{key}}
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default{
		name:'Qtype',
		props: ['question'],
		data(){
			return{}
		},
		methods:{
			deleteQuestion(id){
				this.$emit('deleteQuestion',id);
			},
			moveQuestion(id){
				this.$emit('moveQuestion', id);
			},
			deleteCount(){
				this.$emit('deleteCount');
			}
		} 
	}
</script>
<style>
	.Qtitle{
		font-size: 18px;
		line-height: 35px;
	}
	.Qchoice li{
		line-height: 30px;
	}
	.Qanalysis span{
		margin: 10px 0 10px 0;
		font-size: 15px;
		display: block;
		width: 100%;
	}
	.jiexi{
		height: 30px;
		line-height: 30px;
		text-align: center;
		width: 65px!important;
		background: #E3E3E9;
		border-radius: 14px;
		padding:0 10px 0 10px; 
	}
	.Qkeyword li{
		float: left;
		margin-left: 10px;				
		background: #F8DEDB;
		border-radius: 4px;
		padding: 5px 8px 5px 8px;
	}
	.Qkeyword li:first-child{
		margin-left: 0;
	}
</style>