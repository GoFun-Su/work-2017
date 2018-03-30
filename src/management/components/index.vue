<template>
	<div>
		<div class="header">
			<div class="logo"><img src="../assets/images/logo.png"/></div>
			<ul class="nav navbar-nav">
				<li style="background: #90D8D8;">
					<a href="javaScript:;">用户管理</a>
				</li>
			</ul>
			<span class="exit" @click="exit">退出</span>
		</div>
		<ul class="manageNav">
		  <li><router-link to="/addManage/-1">添加人员</router-link></li>
		  <li><a href="javaScript:;">修改人员</a></li>
		  <li><a href="javaScript:;">删除人员</a></li>
		</ul>
	   	 <table class="table table-bordered">
			<thead>
			    <tr style="background:#EEF1F6">
			      <th>姓名</th>
			      <th>手机号</th>
			      <th>角色</th>
			      <th>操作</th>
			    </tr>
			</thead>
			<tbody v-for='list in managerList'>
		        <tr>
		           <td>{{list.user.username}}</td>
		           <td>{{list.loginname}}</td>
		           <td>{{list.roleName}}</td>
			        <td>
				      	<i class="el-icon-edit" @click="modify(list.user.userid)"></i>
					    <i class="el-icon-delete" @click="delUser(list.user.userid)"></i>
				    </td>
		        </tr>
			</tbody>
		</table>
		<popup :status="status" @hidedialog="hideDialog" @submit="submit"></popup>
	</div>
</template>

<script>
import popup from '../../common/components/popup.vue'
	export default{
		name:'index',
		 components: {
            "popup": popup
        		},
		data(){
			return{
				managerList:[],
				status:{
					delDialog: false
				},
				currentLIstId : 0,
				checkedUserId : []
			}
		},
		created(){			
    		this.getList();
		},
		watch:{
			//'managerList':'getList'
		},
		methods:{
			getList(){
				this.$store.commit("get_parameter")
				var vm=this;
	    		axios.get('/user/getUserList', {
					params: {
						userid:this.$store.state.userid,
						orgid:this.$store.state.orgid,
						pagenum:1,
						pagesize:20
					}
				}).then(function(response) {
	 				var list=response.data.list;
					vm.managerList=list;
				})
			},
			delUser(id){
				this.status.delDialog = true;
				this.currentLIstId = id;
			},
			submit(){
				this.status.delDialog = false;
				axios.delete('/user/delUserByUserid/'+this.currentLIstId)
				.then((response) =>{
					if (response.status == 200) {
    					this.$message({
        					message: '删除成功',
           					type: 'success'
    					});
        		 		setTimeout(_ => {
            					this.spliceManagerList(this.currentLIstId)
        				}, 1000)
	 		  		}
	 		  	})
			},
			spliceManagerList(id) {
       		 	this.managerList.forEach((item, index, array) => {
       			 	if (item.user.userid == id) {
           				this.managerList.splice(index, 1)
    				}
				})
			},
			hideDialog(){
				this.status.delDialog = false;
			},
			modify(id){
				 this.$router.replace({
                    				name: 'addManage',
                    				params: {
                        				userid: id
                   				 }
                			})
			},
			exit(){
				axios.get("../user/user/userExit").then((response) => {
					if (response.status == '200') {
						window.location.href = "login.html";
					}
				})
				
			}
	    }	
    }

</script>

<style scoped>
	@import '../assets/common.css';
	.manageNav{
		width: 1170px;
		height: 45px;
		margin:30px auto;
	}
	.manageNav li{
		width: 150px;
		line-height: 45px;
		float: left;
		margin-left: 16%;
		text-align: center;
	}
	.table-bordered{
		width: 1170px;
		margin: 0 auto;
	}
	.table-bordered tr th,
	.table-bordered tr td{
		text-align: center;
	}
	.navbar-nav a:hover{
		background: #90D8D8;
	}
	.exit{
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
	    	cursor: pointer;
	}
</style>