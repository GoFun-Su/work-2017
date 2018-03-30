<template>
	<div>
		<div class="header">
			<div class="logo"><img src="../assets/images/logo.png"/></div>
			<ul class="nav navbar-nav">
				<li style="background: #90D8D8;">
					<a href="javaScript:;">机构管理</a>
				</li>
			</ul>
		</div>
		<ul class="manageNav">
		  <li><router-link to="/addOrg/-1">添加机构</router-link></li>
		  <li><a href="javaScript:;">修改机构</a></li>
		  <li><a href="javaScript:;">删除机构</a></li>
		</ul>
	   	 <table class="table table-bordered">
			<thead>
			    <tr style="background:#EEF1F6">
			      <th>机构名称</th>
			      <th>机构ID</th>
			      <th>操作</th>
			    </tr>
			</thead>
			<tbody v-for="list in orgList">
		        <tr class="orgList">
		           <td @click="orgDetail(list.orgname)">{{list.orgname}}</td>
		           <td>{{list.orgid}}</td>
			        <td>
				      	<i class="el-icon-edit" @click="modifyOrg(list.orgid)"></i>
					    <i class="el-icon-delete" @click="delOrg(list.orgid)"></i>
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
		name:'orgIndex',
		 components: {
            "popup": popup
        },
		data(){
			return{
				orgList:[],
				status:{
					delDialog: false
				},
				currentLIstId : 0
			}	
		},
		created(){
    		this.getList();
		},
		methods:{
			getList(){
				var _this=this;
				axios.get('/org/getOrgList')
				.then(function(response){
					_this.orgList=response.data;
				})
			},
			submit(){
				this.status.delDialog = false;
				axios.delete('/org/deleOrg/'+"?"+"orgid"+"="+this.currentLIstId)
				.then((response) =>{
					if (response.status == 200) {
    					this.$message({
        					message: '删除成功',
           					type: 'success'
    					});
        		 		setTimeout(_ => {
            					this.spliceOrgList(this.currentLIstId)
        				}, 1000)
	 		  		}
	 		  	})
			},
			delOrg(id){
				this.status.delDialog = true;
				this.currentLIstId = id;
			},
			spliceOrgList(id) {
       		 	this.orgList.forEach((item, index, array) => {
       			 	if (item.orgid == id) {
           				this.orgList.splice(index, 1)
    				}
				})
			},
			hideDialog(){
				this.status.delDialog = false;
			},
			modifyOrg(id){
				 this.$router.replace({
                    name: 'addOrg',
                    params: {
                        getOrgById: id
                    }
                })
			},
			orgDetail(orgname){
				this.$router.replace({
                    name: 'orgDetail',
                    params: {
                        orgname: orgname
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
		background: #EEF1F6;
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
	.orgList td{
		cursor: pointer;
	}
	.navbar-nav a:hover{
		background: #90D8D8;
	}
</style>