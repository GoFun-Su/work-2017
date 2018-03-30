<template>
	<div>		
		<form @submit.prevent="login('form')" role="form" id="loginform" name="loginform" method="post" data-vv-scope="form">
			<div class="form-group" id="inputparent" @click.stop>
				<label for="orgname">机构：</label>
				<input type="text" 
					class="form-control" 
					name="orgname" 
					placeholder="请输入机构名字" 
					v-model="orgname" 
					@keyup="changeCompany($event)" 
					@focus="ShowComapny(true)"
					v-validate="'required'">
				<div class="inputChange" v-show="isShowComapny">
					<span v-for="item in companyList" 
						@click.stop="selectComapny(item.orgid,item.orgname,item.creatordate,item.creatorid)" 
						style="cursor: pointer">
						{{item.orgname}}
					</span>
				</div>
				<!-- <span v-show="errorCompany" class="error">
					<strong>
						机构名字不能为空
					</strong>
				</span>
				<span v-show="noContainer" class="error">
					<strong>
						选择机构必须匹配支持部门
					</strong>
				</span> -->
				<span v-show="errors.has('form.orgname:required')" class="error">
					<strong>
						机构名字不能为空
					</strong>
				</span>
				<span v-show="noContainer" class="error">
					<strong>
						选择机构必须匹配支持部门
					</strong>
				</span> 
			</div>
			
			<div class="form-group" id="usernameparent">
				<label for="username">真实姓名：</label>
				<input  type="text" 
					class="form-control" 
					name="username"
					id="username" 
					placeholder="请输入姓名" 
					v-model="username" 
					v-validate="'required|username'">
				<span v-show="errors.has('form.username:required')" class="error">
					<strong>
						名字不能为空
					</strong>
				</span>
				<span v-show="errors.has('form.username:username')" class="error nameError">
					<strong>
						名字输入不符合规则
					</strong>
				</span>
			</div>
			<div class="form-group" id="sexparent">
				<p class="sex">性别：</p>
				<label class="checkbox-inline boy">
					<input type="radio" name="sex" id="man" value="1"  v-model="selected" v-validate="'required'">男
				</label>
				<label class="checkbox-inline girl">
					<input type="radio" name="sex" id="girl" value="2" v-model="selected">女
				</label>
				 <span v-show="errors.has('form.sex:required')" class="error">
					<strong>
						性别必须选择一个
					</strong>
				</span> 
			</div>
			<div class="form-group">
				<button type="submit" class="btn subRegister" id="putUp">提交</button>
			</div>

		</form>	
	</div>	
</template>
<script>
	import {MD5} from 'crypto-js'
	import Qs from 'qs'
	export default {
		name: 'Submit',
		data () {
			return {
				password : "",
				username : "",
				orgname : "",
				orgid : "",
				creatordate : "",
				creatorid : "",
				companyList: "",
				list : "",
				orgname: "",
				isShowComapny: false,
				/*errorCompany : false,*/
				selected : "",
				noContainer : false
			}
		},
		mounted(){
			var self=this;
			self.getList();
			document.addEventListener('click', function (e) {
			        self.ShowComapny(false);
			  })
		},
		methods: {
			axios_req(url,params,success){
				axios.get(url, {
					params: params
				}).then(({
					data
				}) => {
					success(data);
				});
			},
			getList(){
				var _self=this;
				_self.axios_req("/org/getOrgList", { },
					function callback(data) {
						_self.companyList = data;
						_self.list=data;
					})
			},
			ShowComapny(flag){
				this.isShowComapny = flag;
				this.noContainer = false;
			},
			changeCompany(ev){
				var arr = [];
				var self = this;
				if(ev.keyCode == '8'){
		                            self.resetCompany();
		                            return;
		                        }
				self.ShowComapny(true);
				self.getCompanyList(self.companyList);
			},
			getCompanyList(list){
				var self=this;
				self.companyList = list.filter(element =>element.orgname.indexOf(self.orgname) > -1)
			},
			resetCompany(){
				this.companyList = this.list;
				if (this.orgname == "") {
				 	return;
		 		}else{
		 			this.getCompanyList(this.companyList);
			 	 }
			 },
			selectComapny(id,name,date,orid){
				this.orgname = name;
				this.orgname = name;
				this.orgid = id;
				this.creatordate = date;
				this.creatorid = orid;
				this.ShowComapny(false);
			},
			isContainer(){
				console.log(this.companyList)
				return this.companyList.some(element =>element.orgname.indexOf(this.orgname) > -1)
			},
			authAll(){
			 	if (this.orgname == "") {
			 		/*this.errorCompany=true;*/
			 		return false;
			 	}
			 	
			 	if (!this.isContainer()) {
			 		this.noContainer=true;
			 		return false;
			 	}else{
			 		this.noContainer=false;
			 	}
			 	return true;
			 },
			login (scope) {
				var self=this;
				var parmas={
					telephone : sessionStorage.getItem('telephone'),
					password : MD5(sessionStorage.getItem('password')).toString(),
					sex : self.selected,
					username : self.username,
					orgid : self.orgid
				}
				 parmas = Qs.stringify(parmas);
				if (self.authAll()) {
					self.$validator.validateAll(scope).then(result => {
						if(result){
							axios.post("/registerUser",parmas).then((response) => {	
								if(response.status == 200){
									self.$router.push({
										name: 'Login'
									});
								}
							});	
						}		
					 	
					});
				}
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
		opacity: 0.6;
	}
	#inputparent,#sexparent{
		position: relative;
	}
	.inputChange{
		position: absolute;
		left: 0;
		top: 85px;
		width: 100%;
		height: auto;
		border: 1px solid #ccc;
		border-radius: 5px;
		z-index: 5;
		background: #fff;
	}
	.inputChange span{
		font-size: 16px;
		display: block;
		line-height: 24px;
		padding: 0 8px;
	}
	#usernameparent span.nameError{
		position: static;
		display: block;
		margin-top: 10px;
		color: red;
		opacity: 0.6;
	}
	.sex{
		margin-bottom: 0;
	}
</style>