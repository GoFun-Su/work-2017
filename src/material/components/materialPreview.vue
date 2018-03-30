<!--**********素材预览组件*************-->
<template>
<div>
	<Navigation/>
	<div class="previewContent">
		<p class="Ptitle">
			<font v-if="previewData.materialType==1">
				<i class="iconfont icon-fujianleixingword" style="color:#F36666"></i>
			</font>
			<font v-if="previewData.materialType==2">
				<i class="iconfont icon-fujianleixingshipin" style="color:#96CFE7"></i>
			</font>
			<font v-if="previewData.materialType==3">
				<i class="iconfont icon-fujianleixingtupian" style="color:#D1469D"></i>
			</font>
			<font v-if="previewData.materialType==4">
				<i class="iconfont icon-fujianleixingyinpin" style="color:#859DD5"></i>
			</font>
			<font v-if="previewData.materialType==5">
				<i class="iconfont icon-fujianleixingqita" style="color:#ea5947"></i>
			</font>
			<span>{{previewData.materialName}}</span>
		</p>
		<ul class="comMsg clearfix">
			<li>{{author}}上传于</li>
			<li>
				{{moment(previewData.editDate).format('YYYY-DD-MM hh:mm:ss')}}
			</li>
			<li>200个浏览</li>
			<li>13个下载</li>
			<li>0个收藏</li>
			<li>
				<el-rate disabled></el-rate>
			</li>
			<li class="label">标签一</li>
			<li class="label">标签二</li>
		</ul>
		<div class="intro">
			3月17日，第十二届全国人民代表大会
			3月17日，第十二届全国人民代表大会
			3月17日，第十二届全国人民代表大会。
			3月17日，第十二届全国人民代表大会
			3月17日，第十二届全国人民代表大会
			3月17日，第十二届全国人民代表大会。
		</div>
		<div class="Ptype">
			<!--文档-->
			<span v-if='previewData.materialType==1'class="doc">
				<!-- <vueshowpdf @closepdf="closepdf" 
							v-model="isshowpdf" 
							:pdfurl="pdfurls" 
							@pdferr="pdferr" 
							:maxscale='4' 
							:minscale='0.6' 
							:scale='1.1' >
				</vueshowpdf> -->
			</span>
			<!-- 视频 -->
			<span v-if='previewData.materialType==2'class="video">
				<video-player
					ref="videoPlayer"
					:options="playerOptions"
					@ready="playerReadied"		
				/>
			</span>
			<!-- 图片 -->
			<span v-if='previewData.materialType==3' class="img">
				<img :src="url"/>
			</span>
			<!-- 音频 -->
			<span v-if='previewData.materialType==4' class="audio">
				<a-player 
					:music="{
						title:previewData.materialName,
						author:author,
						url:url,
						pic:'http://www.jitu5.com/uploads/allimg/141012/259147-14101214324780.jpg'
					}"/>				
			</span>
			<!-- 其他 -->
			<span v-if='previewData.materialType==5'class="Pother">
				<i class="iconfont icon-fujianleixingqita" style="color:#ea5947;font-size:60px;"></i>
				<br/>
				<br/>
				该资源不支持预览，请下载后查看
			</span>
		</div>	
		<ul class="Poperation">
			<li class="collection">收藏</li>
			<li class="download" @click="downLoadFile" v-if=''>下载（{{size}}）</li>
			<li>欢迎给素材评分</li>
			<li style="margin-left:15px;">
				<el-rate disabled></el-rate>
			</li>
		</ul>
	</div>
</div>
</template>

<script>

	//import vueshowpdf from 'vueshowpdf'
	import VueAplayer from 'vue-aplayer'
	import 'videojs-contrib-hls/dist/videojs-contrib-hls'
	import Navigation from 'Common/components/Navigation'
	export default{
		name:'materialPreview',
		data(){
			return{
				//pdfurls:'//cdn.mozilla.net/pdfjs/tracemonkey.pdf',
             	//isshowpdf:true,
				previewData:'',
				size:"",
				url:'',
				author:'',
				decurl:'',
				playerOptions: {					
			        bigPlayButton: true,
			        controls: true,
			        height:550
		        }
        	}
		},
		components: {
			'Navigation': Navigation,
			'a-player': VueAplayer,
			//vueshowpdf
		},
		created(){			
			this.preview();
		},
		computed: {
			player() {			  
		      return this.$refs.videoPlayer.player
		    }
		},
		methods:{
			closepdf(){
	            this.isshowpdf = false;
	        },
	        pdferr(errurl) {
	            console.log(errurl);
	        },
			playerReadied (e) {
				this.player.src({
					type: "application/x-mpegURL",
		            src:this.decurl,
		            withCredentials: false
				})
			},
			moment: function (date) {
		      return moment(date);
		    },
			preview(){
				var _this=this;
				axios.get("/material/getMaterialByID/"+this.$route.params.id)
				.then((response) => {
					 _this.previewData=response.data.material;
					if(response.data.material.materialSize<1024*1204){
						_this.size=response.data.material.materialSize/1024;
						_this.size=_this.size.toFixed(1)+'kb';
					}
					else{
						_this.size=response.data.material.materialSize/1024/1024; 
						_this.size=_this.size.toFixed(1)+'M';
					}
					 _this.author=response.data.createName;
					 _this.url='http://leicloud.ulearning.cn/'+response.data.material.materialUrl;
					 _this.decurl='http://leicloud.ulearning.cn/'+response.data.decurl;
				})
   	 	    },
   	 	    downLoadFile(){
				window.open(this.url+ "?attname=" + this.previewData.materialName);
			}
		}
	}
</script>

<style scoped>
	.previewContent{
		width: 980px;
		margin:50px auto;
	}
	.Ptitle{
		width: 100%;
		line-height: 30px;
	}
	.Ptitle i{
		font-size: 25px;
	}
	.Ptitle span{
		font-size: 22px;
		color: #444;
		margin-left: 15px;
	}
	.comMsg{
		width: 100%;
	}
	.comMsg li{
		float: left;
		color: #969696;
		margin-left:10px; 
	}
	.comMsg li:first-child{
		margin-left: 0px;
	}
	.label{
	    background: #F8DEDB;
	    border-radius: 4px;
	    padding: 5px 8px 5px 8px;
	}
	.intro{
		margin: 15px 0 15px 0;
		background: #f1f3f7;
		line-height: 22px;
		color: #444;
		font-size: 14px;
		padding: 10px;
	}
	.intro:after{
		color: #0088CC;
		cursor: pointer;
  		content:'展开>>';
  	}
  	.Ptype{
  		width: 100%;
  		margin-bottom: 30px;
  	}
  	.img,.video{
  		display: block;
  		height: 550px;
  	}
  	.doc{
  		display: block;
  		height: 800px;
  		border:1px solid #E3E3E9;
  	}
  	.Ptype img{
  		width: 100%;
  		height: 100%;
  	}
  	.Poperation{
  		padding-bottom: 100px;
  	}
  	.Poperation li{
  		float: left;
  		font-size: 14px;
  		color: #444;
  		padding-top: 5px;
  	}
  	.collection,.download{
  		cursor: pointer;
  		padding:5px 15px;
  		border-radius: 6px;
  	}
  	.collection{
  		background: #ea5947;
  		color: #fff !important;
  	}
  	.download{
  		border:1px solid #ccc;
  		margin:0 50px 0 15px;
  	}
  	.Pother,.audio{
  		display:block;
  		padding:90px; 
  		border:1px solid #E3E3E9;
  	}
  	.Pother{
  		text-align:center;
  	}
</style>

