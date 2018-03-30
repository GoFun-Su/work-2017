export default (vue) => {
	axios.interceptors.response.use(
		(response) => {
			if(response.data.code == '2'){
				vue.$message.error(response.data.msg)
				response.data = null
			}			
			return response
		},
		(error) => {
			if(error.response){
				switch (error.response.status) {
					case 401:
						window.location.href='/lcms/login.html';
						//window.location.href='/login.html';
						break;
					case 500:						 
						vue.$message.error('服务器发生异常');
						break;
				}
			}			
			return Promise.reject(error);
		}
	)
}