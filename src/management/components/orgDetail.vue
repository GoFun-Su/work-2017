<template>
	<div>
		<div class="header">
			<div class="logo"><img src="../assets/images/logo.png"/></div>
			<ul class="nav navbar-nav">
				<li style="background: #90D8D8;">
					<a href="javaScript:;">机构详情</a>
				</li>
			</ul>
			<router-link to="/orgIndex" class="back">返回</router-link>
		</div>
		<div class="orgDetail">
			{{orgName}}
		</div>
	</div>
</template>
<script>
	export default{
		name:"orgDetail",
		data(){
			return{
				orgName:''
			}
		},
		created(){
			this.orgName=this.$route.params.orgname
		}
	}
</script>
<style scoped>
@import '../assets/common.css';
	.orgDetail{
		font-size: 30px;
		width:1170px;
		margin:50px auto;
		text-align: center;
	}
	.back{
	    display: block;
	    color: #fff;
	    float: right;
	    margin-right: 60px;
	    line-height: 40px;
	    background: #90D8D8;
	    width: 90px;
	    border-radius: 4px;
	    text-align: center;
	    margin-top: 13px;
	}
</style>