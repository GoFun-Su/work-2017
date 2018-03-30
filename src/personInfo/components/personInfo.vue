<template>
<div>
	<Navigation/>
	<div class="personInfo">
		<el-row>
		  	<el-col :span="4" :offset="4" style="text-align: center;">
		  		<div class="headImg">
					<img :src="'http://leicloud.qiniudn.com/'+src" width="150px" height="150px" v-if="src!= '' && src!=null">
					<img src="../assets/img/logo.jpg" width="150px" height="150px" v-if="src== '' ||src == null">
					<button @click="upload_image" class="upload">上传头像</button>
				</div>
				<!-- 上传图片组件 -->
                                                <upload-image-tool @preview="preview_img" @success="success_img" ref="image">
                                                </upload-image-tool>
		  	</el-col>
		  	<el-col :span="14"  :offset="2">
		  		<form role="form"  name="form"  data-vv-scope="form" autocomplete="off" @submit.prevent="modify('form')">
					<div class="form-group">
						<label for="username">真实姓名:</label>
						<input  type="text" 
							class="form-control" 
							name="username"
							id="username" 
							placeholder="请输入姓名" 
							v-model="username" 
							v-validate="'required|username'">
						<span v-show="errors.has('form.username:required')" class="error">
							<strong>
								姓名不能为空
							</strong>
						</span>
						<span v-show="errors.has('form.username:username')" class="error nameError">
							<strong>
								姓名输入不符合规则
							</strong>
						</span>
					</div>
					<div class="form-group">
                					<label for="tel">手机号:</label>
					           <input type="text" class="form-control" name="tel" 
					           	placeholder="请输入手机号" 
					           	v-model="tel" 
					           	autocomplete="off" 
					           	v-validate="'required|telephone'">
					            <span v-show="errors.has('form.tel:required')" class="error">
						          <strong>
							         手机号不能为空
						          </strong>
					          </span>
				                    <span v-show="errors.has('form.tel:telephone')" class="error">
				            		<strong>
				            			请输入正确的手机号
				            		</strong>
				    	           </span>
					</div>
					<div class="form-group">
						<label for="sex">性别:</label>
						 <template>
							  <el-radio class="radio" v-model="radio" label="1">男</el-radio>
							  <el-radio class="radio" v-model="radio" label="2">女</el-radio>
						</template>

					</div>
					<div class="form-group">
                					<label for="oPassWord">旧密码:</label>
					           <input type="password" class="form-control" name="oPassWord" 
					           	placeholder="请输入密码" 
					           	:value="oPassWord.substring(0,6)" 
					           	disabled>
					</div>
					<div class="form-group">
                					<label for="pwd">新密码:</label>
					           <input type="password" class="form-control" name="pwd" 
					           	placeholder="请输入密码" 
					           	v-model="pwd" 
					           	autocomplete="off" 
					           	v-validate="'required|password'">
					           <span v-show="errors.has('form.pwd:required')" class="error">
							<strong>
							  	密码不能为空
							</strong>
						</span>
						
				                     <span v-show="errors.has('form.pwd:password')" class="error">
							<strong>
							  	请输入6-16位数字、字母或数字字母的组合
							</strong>
						</span>
						 <span v-show="equal" class="error">
							<strong>
							  	新密码和旧密码不能相同
							</strong>
						</span>
						
					</div>
					 <div class="form-group">
                					<label for="ncPassWord">确认新密码:</label>
					           <input type="password" class="form-control" name="ncPassWord" 
					           	placeholder="请输入密码" 
					           	v-model="ncPassWord" 
					           	v-validate="'required|password|confirmed:pwd'">
					             <span v-show="errors.has('form.ncPassWord:required')" class="error">
							<strong>
							  	确认密码不能为空
							</strong>
						</span>
						<span v-show="errors.has('form.ncPassWord:confirmed:pwd')" class="error">
							<strong>
							  	两次密码不相等
							</strong>
						</span>
				                    <span v-show="errors.has('form.ncPassWord:password')" class="error">
							<strong>
							  	请输入6-16位数字、字母或数字字母的组合
							</strong>
						</span>
					</div> 
					<div class="form-group">
						<button type="submit" class="btn" id="putUp">提交</button>
						<button type="button" class="btn" @click="cancel">取消</button>
					</div>
				</form>
			</el-col>
		</el-row>
	</div>
</div>
</template>
<script>
import uploadImageTool from 'Common/components/uploadImageTool.vue'
import API from 'Common/assets/js/common.js'
import Navigation from 'Common/components/Navigation'
import Qs from 'qs'
import {MD5} from 'crypto-js'
import  'Common/assets/iconFont/iconfont.css'
	export default {
		name: 'personInfo',
		components: {
                		"Navigation": Navigation,
                		'uploadImageTool': uploadImageTool,
        		},
		data () {
			return {
				src : "",
				loadImgId: 0,
				username: "",
				tel: "",
				radio: '1',
				ncPassWord : "",//确认新密码
				oPassWord: "",//旧密码
				pwd: "",//新密码
				equal : false

			}
		},
		computed:{
			
		},
		created(){
			axios.get("../../api/user/user/getUserByUserid/"+API.getCookie("userid")
                       	).then(({data}) => {
				this.src = data.headUrl;
				this.username = data.user.username;
				this.oPassWord = data.password || "";
				this.tel = data.loginname || "";
				this.loadImgId = data.user.headid || 0;
				this.radio = data.user.sex.toString();
			})
		},
		methods: {
			upload_image: function() { //点击上传封面，触发file change事件
                        		this.$refs.image.begin();
                		},
			 success_img(url, id) { //转换之后的图片url和id
                        		this.src =  url;
                        		this.loadImgId = id;
                		},
                		preview_img() { //显示加载状态
                        		//this.src = "";
               		 },
               		 authPwd(){
               		  	if ( MD5(this.pwd).toString() == this.oPassWord) {
               		 		this.equal = true;
               		 		return false;
               			}
               		 	else{
               				this.equal = false;
               		 		return true;
               		 	}
               		 		
               		 },
               		 modify(scope){
               		 	this.$validator.validateAll(scope).then(result => {
					if(result){
						if (this.authPwd()) {
							axios.put("../../api/user/user/updateOneself", Qs.stringify({
		                           				username : this.username,
		                           				telephone : this.tel,
		                           				password : MD5(this.pwd).toString(),
		                           				headid : this.loadImgId,
		                           				sex : parseInt(this.radio),
		                           				userid : API.getCookie("userid")
		                       			}))
		               		 	 	.then(({data}) => {
		               		 	 		if(data == null || data.code == '2'){
							 		return;
							 	}else {
							 		this.$message({
				                                                                message: '修改成功',
				                                                                type: 'success'
			                                                     		 });
				                                                      setTimeout(_ => {
				                                                                document.cookie = "src="+this.src	
			                    						window.location.href = "bookManage.html";
				                                                      }, 1000)
				                                                       document.cookie = 'telephone ='+this.tel;
				                                                       document.cookie = 'password ='+this.pwd;
								 }
		                    					
		               				})
						 }
		               		 	 
		                		}
		                	})
               		 },
               		 cancel(){
               		 	this.$router.go(-1)
               		 }
		           
		}
		
	}
</script>
<style scoped>
	img{
		border-radius: 100%;
	}
	.personInfo{
		padding-top: 50px;
		width: 1170px;
		margin: 0 auto;
	}
	.headImg{
		margin-top: 120px;
	}
	.headImg,.el-form {
		display: inline-block;
	}
	button{
		font-size: 14px;
		border: none;
		padding: 6px 12px;
		border-radius: 5px;
		display: block;
		margin: 0 auto;
		margin-top: 20px;
		background: #ea5947;
		color: #fff;
	}
	.btn{
		background: #ea5947;
		margin-right: 200px;
    		padding: 8px 30px;
    		color: #fff;
    		display: inline-block;
	}
	.btn:hover{
		color: #fff;
	}
	
</style>
<style type="text/css">
	.el-row{
		border: 1px dashed #ccc;
		padding: 40px 0;
	}
	label{
		width: 80px;
	}
	.form-control{
		width: 400px;
		display: inline-block;
		height: 40px;
	}
	.form-group{
		margin-bottom: 30px;
		position: relative;
	}
	.el-radio__input.is-checked .el-radio__inner{
		background: #ea5947 !important;
		border-color: #ea5947 !important;
	}
	.el-radio__inner:hover{
		border-color: #ea5947 !important;
	}
	input:-webkit-autofill {
		-webkit-box-shadow: 0 0 0px 1000px white inset;
		-webkit-background-color: #fff;
	}
	input:-webkit-focus { 
		-webkit-outline: none;
		-webkit-background-color: #fff;
	 }
	 .error{
	 	position: absolute;
		color: red;
		opacity: 0.6;
		left: 500px !important;
		top: 10px !important;
	 }
</style>