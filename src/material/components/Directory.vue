<!--**********左侧素材导航组件*************-->
<template>
	<div class="leftSlider">	
		<ul>
			<li v-for="nav in navList" @click="dirSelect(nav.key)" :class="{selected: isSelected == nav.key}">
				<span v-if="nav.key==-1">
					<i class="iconfont icon-res_all"></i>
				</span>
				<span v-else-if="nav.key==1">
					<i class="iconfont icon-res_file"></i>
				</span>
				<span v-else-if="nav.key==2">
					<i class="iconfont icon-res_video"></i>
				</span>
				<span v-else-if="nav.key==3">
					<i class="iconfont icon-res_pic"></i>
				</span>
				<span v-else-if="nav.key==4">
					<i class="iconfont icon-res_music"></i>
				</span>
				<span v-else-if="nav.key==5">
					<i class="iconfont icon-res_other"></i>
				</span>
				<a href="javaScript:;">{{nav.value}}</a>
			</li>
		</ul>
	</div>
</template>
<script>	
	export default {
		name: 'Directory',
		data () {
			return 	{
				isSelected:-1,
				navList:[{
					key:-1,
					value:'全部'
				},
				{
					key:1,
					value:'文档'
				},
				{
					key:2,
					value:'视频'
				},
				{
					key:3,
					value:'图片'
				},
				{
					key:4,
					value:'音频'
				},
				{
					key:5,
					value:'其他'
				}]
  			}			
		},
		methods :{
			dirSelect : function(type){
				this.isSelected=type;
				if(this.isSelected == -1){
					this.$router.push("/folder/-1");
				} else {
					this.$router.push("/type/" + type);	
				}				
			}
		}	
	}
</script>

<style scoped>
.leftSlider {
	width: 190px;
	height: auto;
	float: left;
	text-align: center;
}
.leftSlider li{
	line-height: 45px;
}
.leftSlider li:hover{
	background: #f1f3f7;
}
.leftSlider i{
	font-size: 16px;
	margin-right: 20px;
}
.selected{
	background: #f1f3f7;
}
</style>
