<template>
<div class="radioCon">
	<p class="title">单选题</p>
    <div class="form-group" v-for="(subject, subjectIndex) in question">
	    <textarea class="form-control questionTitle" rows="3" 
	    		  placeholder="请输入题目" 
	    		  name="title"
	    		  v-model="subject.questionModel.title" 
	    		  v-validate="'required'">
	    		  {{subject.questionModel.title}}
	    </textarea>
	    <span class="error" v-show="errors.has('title')">试题题干不能为空</span>
	    <!-- 添加选项 -->
		    <div  v-for='(opdt,opdtIndex) in subject.choiceItemModel'>
		    	<ul>
				    <li class="selectNum">
					    <input type="button" class="btn selectList btn-sm" :value='String.fromCharCode(64 + (opdtIndex + 1))'/>
					    <textarea class="form-control selectCon" rows="2"  
					    		  placeholder="请输入选项内容" 
					    		  v-model="opdt.title" 
					    		  :name="'answer' + opdtIndex" 
					    		  v-validate="'required'" >
					    		  {{opdt.title}}
					    </textarea>
					    <i class="glyphicon glyphicon-trash" @click='deleteOptionsFun(subjectIndex, opdtIndex)'></i>
				   	</li>
				   	<li>
				   	<span class="error" style="margin-left:100px;line-height:20px;" 
				   		  v-show="errors.has('answer' + opdtIndex)">
				   		  试题选项不能为空
				    </span>
				   	</li>					 
			   	</ul>
			   	 <div class="addOptions" v-if='opdtIndex==subject.choiceItemModel.length-1'>
				    <button type="button" class="btn selectList btn-sm" @click="addOptions(subjectIndex,opdtIndex)">+</button>
				    <span @click="addOptions(subjectIndex,opdtIndex)">添加选项</span>   
			   	</div>
		   	</div>
	   <!-- 选项答案 -->			   
	   	<div class="answer">
			<ul>
				<li style="background:#FBE3B9;padding:0 10px 0 10px;border-radius:14px;">答案</li>
				<li v-for="(opdt,opdtIndex) in subject.choiceItemModel">
					<label class="checkbox-inline"> 
						<input type="radio" name="optionsRadios" v-model="rightIndex" :value="opdtIndex"  v-validate="'required'"/>
						{{String.fromCharCode(64 + (opdtIndex + 1))}}
					</label>
				</li>
				<li>
					<span class="error" v-show="errors.has('optionsRadios')">请选择正确答案</span>
				</li>
			</ul>
		</div>
		<div class="analysis">
			<span>解析</span>				
			<textarea class="form-control answerAnalysis" rows="2" 
					  placeholder="请输入答案解析"
					  v-model="subject.questionModel.correctreply">
					  {{subject.questionModel.correctreply}}
			</textarea>					
		</div>
		<div class="difGrade">
			<div style="width:100%;float:left;">
				<div style="float:left;margin-top:20px;">
					<span>难度</span>
					<el-select v-model="subject.questionModel.hardlevel" placeholder="中等">
					    <el-option
					      v-for="item in difGrades"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</div>
				<div class="label">
					<p>标签</p>
					<input type="text" placeholder="10个字以内，回车确认，最多5个" 
						class="tag" 
						   v-model="keyword" 
						   @keyup.enter="tagPrompt" 
						   maxlength="10"/>
					<ul class="keyword">
					 	<li v-for="(key, index) in keywordArr">{{key}} 
						 	<i class="iconfont icon-lei_guanbi" 
						 	   v-show="iconShow" 
						 	   @click="deleteKeyWord(index)">
						 	</i>
					 	</li>
					 </ul>
				</div>
			</div>					
			<button class="submit" @click="saveQuestionFun">保存</button>
		</div>		
  	</div>
</div>
</template>

<script>
	export default{
		name:'radioType',
		props:['question'],
		data() {
			return{
				iconShow:false,
				rightIndex: -1,
				keywordArr: [],
				keyword: '',
				difGrades: [{
			        value: 1,
			        label: '容易'
			      }, {
			        value: 2,
			        label: '一般'
			      }, {
			        value: 3,
			        label: '中等'
			      }, {
			      	value: 4,
			      	label: '较难'
			      }, {
			      	value: 5,
			      	label: '困难'
			      }]
				}
			},
			created(){
				this.editQuestion();
			},
			watch: {
				rightIndex (newIndex, oldIndex) {
					var newRightChoice = this.question[0].choiceItemModel[newIndex];
					if(typeof(newRightChoice) != 'undefined'){
						newRightChoice.isture = 1;	
					}					
					var oldRightChoice = this.question[0].choiceItemModel[oldIndex];
					if(typeof(oldRightChoice) != 'undefined'){
						oldRightChoice.isture = 0;
					}
				}
			},
			methods:{
				// 新增选项
				addOptions : function(subjectIndex, opdtIndex) {
					var optionsDataMes = {
						id: 0,
				       	isture: 0,
				        link: "",
				        orders: 0,
				        questionid: this.question[0].questionModel.id,
				        title: ""
					};
					var subjectDataMes = this.question[subjectIndex].choiceItemModel;
					subjectDataMes.push(optionsDataMes);
				},
				// 删除选项
				deleteOptionsFun : function(subjectIndex, opdtIndex) {
					var subjectDataMes = this.question[subjectIndex].choiceItemModel;
					if(subjectDataMes[opdtIndex].isture==1){
						subjectDataMes[opdtIndex].isture=0;
					}
					subjectDataMes.splice(opdtIndex, 1);
				},
				//保存试题
				saveQuestionFun (){
					this.$validator.validateAll().then(result => {	
						if(result){
							this.question[0].questionModel.keyword = this.keywordArr.join(";");
							var _self = this;
							if(this.question[0].questionModel.id==0){
								axios.post("/quesion/saveQuestion", this.question)
								.then(function(){
									_self.$router.push('/index');
								});
							}else{
								axios.put("/quesion/updateQuestion",this.question[0])
								.then(function(){
									_self.$router.push('/index');
								});
							}
						}
						else{
							return;
						}
					});		         
				},
				tagPrompt (){
					 if(this.keyword.length > 10 || this.keywordArr.length >=5){
						this.$message.warning('10个字以内，最多5个标签！');
						return;
					}else if(this.keyword.length ==0){
						this.$message.warning("请输入标签内容！");
						return;
					}
					for(var i=0;i<=this.keywordArr.length;i++){
						if(this.keyword==this.keywordArr[i]){
							this.$message.warning("输入标签内容不能重复！")
							return;
						}
					}
					this.keywordArr.push(this.keyword);
					this.keyword = '';
					this.iconShow=true;
				},
				deleteKeyWord (index) {
					this.keywordArr.splice(index, 1);
				},
				editQuestion(){
					if(this.$route.params.id != -1){
						axios.get("/quesion/getQuestionById/"+ this.$route.params.id)
						.then((response) => {							
							this.keywordArr=response.data.questionModel.keyword.split(';');
							if(this.keywordArr[0]==''){
								this.keywordArr.splice(0,1);
							}
							if(this.keywordArr!=''){
								this.iconShow=true;
								
							} else {
								this.iconShow=false;
							}
							this.question.splice(0, 1, response.data);
							for(var i=0;i<response.data.choiceItemModel.length;i++){
								if(response.data.choiceItemModel[i].isture==1){
									this.rightIndex=i;
								}
							}
						})
					}
	   	 	    }
	   	 	   
			}
	    }
</script>
<style scoped>
	@import '../assets/css/radioQuestions.css';
</style>
