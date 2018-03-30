<template>
	<div class="header">
		<div class="logo"><img src="../assets/images/logo.png"/></div>
		<ul class="nav navbar-nav">
			<li>
				<router-link to="/index">用户管理</router-link>
			</li>
			<li>
				<router-link to="/orgIndex">机构管理</router-link>
			</li>
		</ul>
	</div>
	
</template>
<script>	
	export default {
		name: 'manageHead',
		data () {
			return {
			}
		}
	}
</script>
<style scoped>
.header{
	height: 65px;
	width: 100%;
	background: #55BAB7;
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
	color: #fff;
	width: 110px;
	display: block;
	float: left;
	text-align: center;
	line-height: 35px;
}
.navbar-nav a:hover,.navbar-nav li:first-child a{
	background: #90D8D8;
}
</style>