<template>
	<!-- 删除弹框 -->
    <el-dialog title="提示" :visible.sync="status.delDialog" id="dialog">
        <span>
            删除后无法恢复，确定删除？
         </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
	export default{
		name:'popup',
		props:["status"],
		data(){
			return{
			}	
		},
		methods:{
			cancel(){
				this.$emit("hidedialog")
			},
			submit(){
				this.$emit("submit");
				}
	    	}	
    	}

</script>
<style type="text/css">
	 .el-dialog--small {
    	width: 30%;
	}
	.el-dialog__header {
		border: 1px solid #f2f2f2;
		padding-bottom: 10px;
	}

 	.el-dialog__footer {
    	background: #f2f2f2;
   		text-align: center;
	}

	.el-button + .el-button {
    	margin-left: 50px;
	}

	 .el-dialog__body {
	    padding-top: 40px;
	    padding-bottom: 40px;
	}
	.el-icon-more:before{
	    color: #999;
	}
	.el-tooltip__popper.is-light{
	    width: 320px;
	    font-size: 14px;
	    line-height: 18px;
	    border: 1px solid #666;
	    color: #666;
	}
	.el-button--primary,.el-button--primary:hover {
	    color: #fff;
	    background-color: #55BAB7;
	    border-color: #55BAB7;
	}
	.el-button--default:hover{
		background: #fff;
   		 border: 1px solid #c4c4c4;
    		color: #1f2d3d;
	}
</style>