<template>
	<div>		
		<form @submit.prevent="login('form-1')" role="form" 
				id="loginform" name="loginform" method="post" data-vv-scope="form-1">
			<div class="telephoneParent form-group ui-widget" style="margin-bottom:30px;">
				<label for="telephone">账号：</label>
				<input type="text" id="telephone" 
					class="form-control" 
					v-model="telephone"
					name="telephone"
					placeholder="请输入手机号"
					v-validate="'required|telephone'" :data-computed="tel">
				<span class="error" v-show="errors.has('form-1.telephone:required')">
					<strong>
						手机号不能为空
					</strong>
				</span>
				<span class="error" v-show="errors.has('form-1.telephone:telephone')">
					<strong>
						手机号格式不正确
					</strong>
				</span>
			</div>
			<div class="form-group" id="usernameparent">
				<label for="username">密码：</label>
				<input type="password" class="form-control" 
					v-model="password" id="password" 
					name="password" placeholder="请输入密码"
					v-validate="'required'" :data-computed="passWord">
				<span class="error" v-show="errors.has('form-1.password')">
					<strong>
						密码不能为空
					</strong>
				</span>
			</div>
			<div class="form-group">
				<button type="submit" class="btn subRegister" id="putUp">登录</button>
			</div>
			<div class="form-group register">
				还没有账号？&nbsp;&nbsp;&nbsp;<router-link to="register">注册新账号</router-link>
			</div>
		</form>		
	</div>	
</template>
<script>
	import API from 'Common/assets/js/common.js'
	import {MD5} from 'crypto-js'
	import '../assets/login'
	export default {
		name: 'login',
		data () {
			return {
				telephone: '',
				password: ''
			}
		},
		computed:{
			tel(){
				// if (sessionStorage.telephone) {
				// 	this.telephone = sessionStorage.telephone;
				// }
				if (API.getCookie("telephone")) {
				 	this.telephone = API.getCookie("telephone");
				 }
				
			},
			passWord(){
				// if (sessionStorage.password) {
				// 	this.password = sessionStorage.password;
				// }
				if (API.getCookie("password")) {
				 	this.password = API.getCookie("password");
				 }
			}
		},
		methods: {
			login (scope) {
				this.$validator.validateAll(scope).then(result => {
					if(result){
						axios.get("/login", {
							params: {
								username: this.telephone,
								password: MD5(this.password).toString()
							}
						}).then(({data}) => {
							if(data == "" || data == null || data.code == '2'){
							 	return;
							 }
							 else if(data.roleId==3||data.roleId==5){
							 	 document.cookie = "userid="+data.user.userid
                            					 	 document.cookie = "src="+data.headUrl
							 	 window.location.href = "bookManage.html";
							 }else{
								window.location.href = "management.html?roleId="+data.roleId;
							 }
						});						
					}
				});
			}
		}
	}
</script>
<style scoped>
	.error {
		position: absolute;
		top: 45px;
		right: 30px;
		color: red;
	}
	.subRegister{
		background: #ea5947;
	}
	.register{
		text-align: center;
		margin-top: 20px;
	}
	.register a{
		color: #ea5947;
	}
</style>