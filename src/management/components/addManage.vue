<template>
    <div>
       <div class="header">
            <div class="logo"><img src="../assets/images/logo.png"/></div>
            <ul class="nav navbar-nav">
                <li style="background: #90D8D8;">
                    <a href="javaScript:;">用户管理</a>
                </li>
            </ul>
            <router-link to="/index" class="back">返回</router-link>
        </div>
        <div class="addManage">
            <ul class="manageNav">
                <li><a href="javaScript:;">添加人员</a></li>
                <li><a href="javaScript:;">修改人员</a></li>
                <li><a href="javaScript:;">删除人员</a> </li>
            </ul>
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
               <!--<el-form-ite m label="角色">
                    <el-radio-group v-model="ruleForm.resource">
                        <el-radio label="编辑"></el-radio>
                        <el-radio label="审核"></el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item label="用户名" prop="username" :rules="[{ required: true, message: '用户名不能为空'}]">
                    <el-input type="text" v-model="ruleForm.username">
                        {{ruleForm.username}}
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass" :rules="[{ required: true, message: '密码不能为空'}]">
                    <el-input type="password" v-model="ruleForm.pass">
                        {{ruleForm.pass}}
                    </el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone" :rules="[{ required: true, message: '手机号码不能为空'}]">
                    <el-input type="phone" v-model="ruleForm.phone">
                        {{ruleForm.phone}}
                    </el-input>
                </el-form-item>
                <el-form-item label="电子邮箱" prop="mail">
                    <el-input type="mail" v-model="ruleForm.mail">
                        {{ruleForm.mail}}
                    </el-input>
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
import {MD5} from 'crypto-js'
export default {
    name: 'addManage',
    data() {
        return {
            ruleForm: {
                username: '',
                pass: '',
                phone: '',
                mail: '',
                resource: ''
            },
        };
    },
    created() {
        this.editInfo();
    },
    methods: {
        resetForm(formName) {
            this.$refs[formName].resetFields();
          },
        editInfo(){
            var _this=this;
            if(this.$route.params.userid!=-1){
                axios.get('/user/getUserByUserid/'+ this.$route.params.userid)
                .then(function(response){
                    console.log(response.data)
                  _this.ruleForm.username=response.data.user.username;
                  _this.ruleForm.mail=response.data.user.email
                })
            }
        },
        submitForm(formName) {
          var _this=this;
          if(this.$route.params.userid==-1 && this.$store.state.roleId==1){
             _this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/user/saveUser', qs.stringify({
                        'username':this.ruleForm.username,
                        'telephone':this.ruleForm.phone,
                        'password':MD5(this.ruleForm.pass).toString(),
                        'email':this.ruleForm.mail,
                        'type':2
                        })
                    )
                    .then(function(response){
                        _this.$router.push({path:'/index'});
                    })
                }else{
                    return;
                }
            })   
        }else if(this.$route.params.userid==-1 && this.$store.state.roleId==4){
             _this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/user/saveUser', qs.stringify({
                        'username':this.ruleForm.username,
                        'telephone':this.ruleForm.phone,
                        'password':MD5(this.ruleForm.pass).toString(),
                        'email':this.ruleForm.mail,
                        'type':3
                        })
                      )
                    .then(function(response){
                        _this.$router.push({path:'/index'});
                    })
                }else{
                    return;
                }
            })
        }
        else{
              axios.put('/user/updateUser', qs.stringify({
                'username':this.ruleForm.username,
                //'telephone':this.ruleForm.phone,
                //'password':this.ruleForm.pass,
                'email':this.ruleForm.mail,
                'userid':this.$route.params.userid
              })
            )
              .then(function(response){
                _this.$router.push({path:'/index'});
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