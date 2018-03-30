import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'

const telephoneValidator = (value, args) => {//手机号
	if(value.length == 11 && /^1[3|4|5|7|8|][0-9]{9}$/.test(value)){
		return true;
	}
		return false;
}

Validator.extend('telephone', telephoneValidator)

const name = (value, args) => {//姓名
	if(/^[\u4e00-\u9fa5\S]{1,50}$/.test(value)){
		return true;
	}
	return false;
}
Validator.extend('username', name)

const passWord = (value, args) => {//密码
	if(/^[0-9a-zA-Z]{6,16}$/.test(value)){
		return true;
	}
	return false;
}
Validator.extend('password', passWord)

Vue.use(VeeValidate)

// export default  {
// 	VeeValidate
// }
