/*import axios from 'axios';
import qs from 'qs';
axios.defaults.timeout=5000;
axios.defaults.header.post['Content-Type']='application/x-www-from-urlencoded;charset=UTF-8';

axios.interceptors.request.use((config)=>{
	if(config.method ==='post'){
		config.data=qs.stringify(config.data);
	}
	return config;
},(error)=>{
	_.toast('错误的传参','fail');
	return Promise.reject(error);
});
//返回状态判断（添加响应拦截器）
axios.interceptors.response.use((res)=>{
	if(!res.data.success){
		return Promise.reject(res);
	}
	return res;
},(error)=>{
	_.toast('网络异常',''fail);
	return Promise.reject(error);
});
//返回一个Promise(发送post请求)
export function fetch(url,params){
	return new Promise((reslove,reject)=>{
		axios.post(url,params)
		.then(response=>{
			reslove(response.data);
		},err=>{
			reject(err);
		})
		.catch((error)=>{
			reject(error)
		})
	})
}*/