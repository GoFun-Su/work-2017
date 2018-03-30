<template>
<div>
        <form role="form" id="loginform" name="loginform" data-vv-scope="form" @submit.prevent="register('form')">
            <div class="form-group telephoneParent">
                      <label for="telephone"></label>
                     <input type="text" class="form-control" name="telephone" id="telephone" placeholder="请输入手机号" v-model="telephone" v-validate="'required|telephone'" v-on:blur="TelAuth">
                     <span v-show="errors.has('form.telephone:required')" class="error">
		          <strong>
			         手机号不能为空
		          </strong>
	          </span>
                    <span v-show="errors.has('form.telephone:telephone')" class="error">
            		<strong>
            			请输入正确的手机号
            		</strong>
    	           </span>
                      <span v-show="isTelAuth" :class="{ red: isTelAuth }">
    			此号码已注册,请直接
    			<router-link to="Login">登录</router-link>
    	           </span>
                     <span v-show="noTelAuth" :class="{ red: noTelAuth }">此号码未注册</span>
            </div>
            <div class="form-group codeContent">
                      <div class="inputCode col-md-7">
                                <label for="checkcode"></label>
                                <input type="text" class="form-control" name="checkcode" id="checkcode" placeholder="请输入验证码" v-model="checkcode" v-validate="'required'" v-on:change="CodeAuth" @focus="hideError">
                                <span v-show="errors.has('form.checkcode:required')" class="error" style="opacity: 0.6;">
                                	<strong>
                                		验证码不能为空
                                	</strong>
                                </span>
                                <span v-show="errorCode" class="error" style="opacity: 0.6;">
            			<strong>
            				验证码不正确
            			</strong>
            		</span>
                    </div>
                    <div class="getCode col-md-5">
                                    <button id="code" class="btn code" type="button" @click.stop="getPicture" :disabled="codeStatus">
                                                {{codeText}}
                                    </button>
                                    <div class="makeImage" v-show="isShowImage" @click.stop>
                                                <div>
                                                        <img id="yzImage" style="-webkit-user-select: none;" :src="src" @click="changePicture">
                                                        <input type="text" id="checkAuthImage" v-model="checkAuthImage">
                                                        <div id="checkAuthImageBtn" @click="SureImage">确定</div>
                                                </div>
                                                <div>
                                                            <span class="changeImage">点击图片切换</span>
                                                            <span id="putcallback" :class="{ red: codeError}" v-show="codeError">
                            				{{text}}
                            		              </span>
                                                </div>
                                    </div>
                     </div>
          </div>
          <div class="form-group passwordParent">
                      <label for="password"></label>
                     <input type="password" class="form-control" name="password" id="password" placeholder="请输入密码" v-model="password" v-validate="'required|password'">
                     <span v-show="errors.has('form.password:required')" class="error">
			<strong>
			  	密码不能为空
			</strong>
		</span>
                     <span v-show="errors.has('form.password:password')" class="error">
			<strong>
			  	请输入6-16位数字、字母或数字字母的组合
			</strong>
		</span>
            </div>
            <div class="form-group respasswordParent">
                    <label for="respassword"></label>
                    <input type="password" class="form-control" name="respassword" id="respassword" placeholder="请输入密码" v-model="respassword" v-validate="'required|password|confirmed:password'">
                    <span v-show="errors.has('form.respassword:required')" class="error">
			<strong>
			  	确认密码不能为空
			</strong>
		</span>
                    <span v-show="errors.has('form.respassword:password')" class="error">
			<strong>
			  	请输入6-16位数字、字母或数字字母的组合
			</strong>
		</span>
                    <span v-show="errors.has('form.respassword:confirmed:password')" class="error">
			<strong>
			  	两次密码不相等
			</strong>
		</span>
         </div>
         <div class="form-group">
                       <button class="btn subRegister" id="subRegister" type="submit" :disabled="isSubRegister">        注册
                    </button>
            </div>
        </form>
    </div>
</template>
<script>
import {
    MD5
} from 'crypto-js'
export default {
            name: 'Register',
            data() {
                       return {
                                 telephone: "",
                                 password: "",
                                 checkcode: "",
                                 respassword: "",
                                 isShowImage: false,
                                 src: "",
                                 isTelAuth: false,
                                 noTelAuth: false,
                                 checkAuthImage: "",
                                 codeStatus: false,
                                 codeText: "获取验证码",
                                 time: 60,
                                 timer: null,
                                 codeError: false,
                                 isSubRegister: false,
                                 code: "",
                                 errorCode: false,
                                 text: "",
                                 checkCodeStatus: false
                                }
                     },
           mounted() {
                      var self = this;
                      document.addEventListener('click', function(e) {
                            self.isShowImage = false;
                     })
           },
          methods: {
                      axios_get(url, params, success) {
                                 axios.get(url, {
                                            params: params
                                }).then(({data}) => {
                                            success(data);
                            });
                      },
                     TelAuth() {
                                //认证手机是否注册
                                var _self = this;
                                if (_self.telephone == "") {
                                    return;
                                }
                                _self.axios_get("/checkLoginname", {
                                        cellphone: _self.telephone
                                },
                                function callback(data) {
                                        _self.isSubRegister = data;
                                        _self.isTelAuth = data;
                                        _self.noTelAuth = !data;
                                })
                     },
                    CodeAuth() {
                                var _self = this;
                                if (_self.checkcode == "") {
                                            _self.checkCodeStatus = false;
                                            return false;
                                 }
                                axios.get("/checkSMSRandomCode", {
                                            params: {
                                                    telephone: _self.telephone,
                                                    code: _self.checkcode
                                            }
                                }).then(({data}) => {
                                            if (data) {
                                                      _self.errorCode = false;
                                                      _self.checkCodeStatus = true;
                                                     return true;
                                             } else {
                                                    _self.errorCode = true;
                                                     _self.checkCodeStatus = false;
                                                     return false;
                                            }
                                })
                    },
                    hideError() {
                        this.errorCode = false;
                    },
                    getPicture() {
                        //获取验证图片
                                this.codeError = false;
                                this.src = axios.defaults.baseURL + "/AuthImage/makeImage";
                                this.isShowImage = !this.isShowImage;
                    },
                    changePicture() {
                                this.src = this.src + '?d=' + Math.random()
                    },
                    SureImage() {
                                var _self = this;
                                _self.axios_get("/AuthImage/checkAuthImage", {
                                            authImage: _self.checkAuthImage
                                },
                                function callback(data) {
                                            if (data) {
                                                    _self.isShowImage = false;
                                                    _self.src = "";
                                                    _self.checkAuthImage = "";
                                            } else {
                                                         _self.codeError = true;

                                            (_self.checkAuthImage == "") ? _self.text = "验证码不能为空": _self.text = "验证码错误"
                                            return;
                                }
                                _self.sendCode();
                            }
                        )
                    },
                    sendCode() {
                                var _self = this;
                                axios.get("/getSMSRandomCode", {
                                            params: {
                                                     telephone: _self.telephone
                                            }
                                 }).then((response) => {
                                            if (response.data) {
                                            _self.$alert('发送验证码成功');
                                             _self.setTimeOut();
                                    }}).catch((err)=> {
                                        console.log(err)
                                })
                    },
                    setTimeOut() {
                                this.codeText = "60s";
                                this.timer = this.setTime();
                    },
                    setTime() {
                                var _self = this;
                                if (_self.time == 0) {
                                            clearInterval(_self.timer)
                                            _self.codeStatus = false;
                                            _self.codeText = "获取验证码";
                                            _self.time = 60;
                                            return;
                                } else {
                                        _self.codeStatus = true;
                                        _self.codeText = _self.time + "s重发";
                                        _self.time--;
                                 }
                                setTimeout(() => {
                                         _self.setTime()
                                 }, 1000)
                    },
                    register(scope) {
                                var _self = this;
                                _self.$validator.validateAll(scope).then(result => {
                                          if (result) {
                                                    if (_self.checkCodeStatus == true) {
                                                                // sessionStorage.setItem('telephone', _self.telephone);
                                                                // sessionStorage.setItem('password', _self.password);
                                                                document.cookie = "telephone ="+_self.telephone
                                                                document.cookie = "password ="+_self.password
                                                                _self.$router.push({
                                                                            name: 'Submit'
                                                                });
                                                     } else {
                                                                _self.errorCode = true;
                                                        }

                                             }

                                 })

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

.subRegister {
    background: #ea5947;
}

.inputCode {
    margin-bottom: 0;
}

.codeContent {
    position: relative;
}

.codeContent:after {
    content: "";
    height: 0;
    visibility: hidden;
    display: block;
    clear: both;
}

.red {
    color: red;
}

#checkAuthImageBtn {
    color: #fff;
}
</style>
<style type="text/css">
.el-button--primary {
    background-color: #ea5947 !important;
    border-color: #ea5947 !important;
}
</style>
