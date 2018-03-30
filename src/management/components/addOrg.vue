<template>
    <div>
       <div class="header">
            <div class="logo"><img src="../assets/images/logo.png"/></div>
            <ul class="nav navbar-nav">
                <li style="background: #90D8D8;">
                    <a href="javaScript:;">机构管理</a>
                </li>
            </ul>
             <router-link to="/orgIndex" class="back">返回</router-link>
        </div>
        <div class="addManage">
            <ul class="manageNav">
                <li><a href="javaScript:;">添加机构</a></li>
                <li><a href="javaScript:;">修改机构</a></li>
                <li><a href="javaScript:;">删除机构</a></li>
            </ul>
            <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="机构名称" prop="getOrgname" :rules="[{ required: true, message: '机构名称不能为空'}]">
                    <el-input type="getOrgname" v-model="ruleForm.getOrgname" auto-complete="off">
                        {{ruleForm.getOrgname}}
                    </el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="getPhone" :rules="[{ required: true, message: '手机号码不能为空'}]">
                    <el-input type="phone" v-model="ruleForm.getPhone" auto-complete="off">
                        {{ruleForm.getPhone}}
                    </el-input>
                </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import qs from 'qs';
export default {
    name: 'addOrg',
    data() {
        return {
            ruleForm: {
                getOrgname: '',
                getPhone: ''
            }
        };
    },
    created() {
        this.editOrg();
    },    
    methods: {
        resetForm(formName) {            
            this.$refs[formName].resetFields();
          },
        editOrg(){
            var _this=this;
            if(this.$route.params.getOrgById!=-1){
                axios.get('/org/getOrgById/'+"?"+"getOrgById"+"="+this.$route.params.getOrgById)
                .then(function(response){
                    _this.ruleForm.getOrgname=response.data.orgname;
                })
            }
        },
        submitForm(formName) {
            var _this=this;
            if(this.$route.params.getOrgById==-1){
                 _this.$refs[formName].validate((valid) => {
                     if (valid) {
                       axios.post('/org/createOrg', qs.stringify({
                            'orgname':this.ruleForm.getOrgname,
                            'telephone':this.ruleForm.getPhone
                            })
                          )
                        .then(function(response){
                             _this.$router.push({path:'/orgIndex'});
                       })
                    }else{
                        return ;
                    }
                 })
            }
            else{
                axios.put('/org/updateOrg',qs.stringify({
                    'orgname':this.ruleForm.getOrgname,
                    'orgid':this.$route.params.getOrgById
                    })
                ).then(function(response){
                    _this.$router.push({path:'/orgIndex'});
                })
            }
        }
    }
}
</script>
<style scoped>
.manageNav {
    width: 1170px;
    height: 45px;
    margin: 30px auto;
    background: #EEF1F6;
}

.manageNav li {
    width: 150px;
    line-height: 45px;
    float: left;
    margin-left: 16%;
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
.navbar-nav a:hover{
    background: #90D8D8;
}
</style>