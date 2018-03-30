<template>
	<div class="header">
		<div class="logo"><img src="../assets/images/logo.png"/></div>
		<ul class="nav navbar-nav">
			<li>
				<a :href="item.url" v-for="item in items"> {{item.title}}</a>
			</li>
		</ul>
		<div class="headerRight">
			<p class="share"><a href="#"><i class="iconfont icon-ku"></i>共享库</a></p>
			<p class="PersonalInfo">
				<img :src="'http://leicloud.qiniudn.com/'+src" class="personImg" v-if="src != 'null' && src !='' "> 
				<img src="../assets/images/logo.jpg" class="personImg" v-if="src == 'null' || src =='' " >
				<el-menu  class="el-menu-demo" id="el-menu-demo" mode="horizontal">
				  	<el-submenu index="1">
					    	<el-menu-item  index="1-1" @click="goPersonal">
					    		<i class="iconfont icon-yonghu"></i>
					    		个人信息
					    	</el-menu-item>
					    	<el-menu-item  index="1-2" @click="exit" class="exit">
					    		<i></i>退出
					    	</el-menu-item>
				  	</el-submenu>
				</el-menu>
			</p>
		</div>
	</div>
	
</template>
<script>
	import API from 'Common/assets/js/common.js'
	import axios from 'axios';
	export default {
		name: 'Navigation',
		data () {
			return {
				items:[
				        	{
				        		title: '我的教材',
				        		url: 'bookManage.html'
				        	}, 
				        	{
				        		title: '我的素材',
				        		url: 'material.html'
				        	},
				        	{
				        		title: '我的试题',
				        		url: 'question.html'
				        	}
		       		 ],
		        		userid : -1,
		       		 orgid: -1,
		       		 src: ""
			}
		},
		created () {
			this.userid = API.getCookie("userid");
			this.src = API.getCookie("src");
			console.log(this.src)
		},
		methods: {
			exit(){
				axios.get("../user/user/userExit").then((response) => {
					if (response.status == '200') {
						window.location.href = "http://192.168.100.196/index.html";
					}
				})
				
			},
			goPersonal(){
				 window.location.href = "personInfo.html";
			}
		}
	}
</script>
<style scoped>
	.header{
		height: 65px;
		width: 100%;
		background: #ea5947;
	}
	a{
		font-style: "Microsoft YaHei";
	}
	.logo{
		width: 200px;
		height: 65px;
		float: left;
		margin-left: 20px;
		padding: 8px 10px 0 10px;
	}
	.navbar-nav a{
		font-size: 16px;
		color: #ffd2cd;
		width: 110px;
		display: block;
		float: left;
		text-align: center;
		line-height: 35px;
	}
	.navbar-nav a:hover{
		background: #f28679;
		color: #fff;
	}
	.show{
    	background-color:#ea5947;
	}
	.headerRight{
		float: right;
		height: 65px;
		margin-right: 15px;
	}
	.share{
		width: 120px;
		height: 45px;
		float: left;
		text-align: center;
		line-height: 45px;
		border-radius: 4px;
		background: #f28679;
		margin-top:10px;
	}
	.share a{
		color: #ffd2cd;
	}
	.icon-ku{
		font-size: 20px;
		padding:10px 10px 0 0;
	}
	.PersonalInfo{
		float: left;
		margin:10px 0 0 30px;
	}
	.PersonalInfo a{
		width: 30px;
		float: left;
		height: 30px;
		display: block;
		background: #f2f2f2;
		border-radius: 100%;
		margin-top: 4px;
	}
	.PersonalInfo span{
		float: right;
    		width: 0;
    		height: 0;
    		margin:13px 15px 0 5px; 
    		border-left: 5px solid transparent;
    		border-right: 5px solid transparent;
    		border-top: 8px solid #f2f2f2;
	}
	.personImg{
		width:50px;
		height:50px;
		border-radius:100%;
		float:left;
	}
</style>
<style type="text/css">
	#el-menu-demo.el-menu--horizontal .el-submenu .el-submenu__title{
		height: 60px;
		line-height: 45px;
		border-bottom: none;
	}
	#el-menu-demo.el-menu--horizontal .el-submenu > .el-menu{
		top: 50px;
		box-shadow: 0 5px 20px rgba(0,34,77,.1);
		border: 1px solid #e7eaf1;
	}
	#el-menu-demo .el-submenu__title{
		padding: 0;
	}
	#el-menu-demo.el-menu--horizontal .el-submenu .el-submenu__title:hover{
		background-color: rgba(0,0,0,0) !important;
		border-bottom: none !important;
	}
	#el-menu-demo.el-menu--horizontal .el-submenu .el-submenu__icon-arrow{
		color: #fff;
	}
	#el-menu-demo.el-menu--horizontal .el-submenu > .el-menu{
		left: -30px;
	}
	#el-menu-demo .el-menu-item:hover{
		background: none !important;
	}
	#el-menu-demo.el-menu--horizontal .el-submenu > .el-menu{
		padding: 0;
	}
	#el-menu-demo.el-menu-demo{
		background: none;
		float: right; 
		margin-right: 25px;
	}
	.el-menu--horizontal .el-submenu .el-menu-item.exit{
		position: relative;
		padding-left: 30px;
	}
	.el-menu--horizontal .el-submenu .el-menu-item.exit i{
		position: absolute;
		/*background-image: url("../assets/images/exit.png")*/
		background-image: url("../assets/images/ex.png");
		background-repeat: no-repeat;
		width: 15px;
		height: 15px;
		background-size: 15px;
		top: 10px;
		left: 10px;
	}
</style>