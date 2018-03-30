<!-- ******单选题组件****** -->
<template>
	<div>
		<Navigation />
		<div class="questionRadio">
			<p class="goBack">
				<i class="iconfont icon-leiappreturn"></i>
				<router-link to="/index"><span>返回</span></router-link>
				<font>创建单选题</font>
			</p>
			<radioType :question='question'/>
		</div>
	</div>

</template>
<script>
	import Navigation from 'Common/components/Navigation'
	import radioType from './radioType'
	export default{
		name:'radioQuestions',
		components: {
			'Navigation': Navigation,
			'radioType':radioType
		},
		data(){
			return{
				question:[{
				    questionModel: {
				      bookmanageid: 0,
				      code: "",
				      correctreply: "",
				      hardlevel: 1,
				      id: 0,
				      isShare: 0,
				      keyword: "",
				      orders: 0,
				      parentid: this.$store.state.currentFolder,
				      remark: "",
				      rightkey: "",
				      status: 0,
				      title: "",
				      type: 1,
				      updatetime: "",
				      userid: 0
				    },
				    choiceItemModel: [
				      {
				        id: 0,
				       	isture: 0,
				        link: "",
				        orders: 0,
				        questionid: 0,
				        title: ""
				      }, {
				        id: 1,
				       	isture: 0,
				        link: "",
				        orders: 0,
				        questionid: 0,
				        title: ""
				      },
				       {
				        id: 2,
				       	isture: 0,
				        link: "",
				        orders: 0,
				        questionid: 0,
				        title: ""
				      },
				       {
				        id: 3,
				       	isture: 0,
				        link: "",
				        orders: 0,
				        questionid: 0,
				        title: ""
				      }
				    ]
				}]
			}
		}
	}
</script>