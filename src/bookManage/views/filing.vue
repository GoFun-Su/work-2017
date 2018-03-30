<template>
    <div>
        <Navigation/>
        <div class="book-container">
            <!-- 返回列表页 -->
            <a @click="go" class="el-icon-arrow-left" style="cursor: pointer;">返回</a>
            <!-- 列表 -->
            <el-row :gutter="24" class="manContent">
                <el-col :span="8" v-for="item in list">
                    <div class="grid-content bg-purple">
                        <p v-if="item.bookManageLogoUrl != null">
                            <img :src="'http://leicloud.qiniudn.com/'+item.bookManageLogoUrl">
                        </p>
                        <p v-if="item.bookManageLogoUrl == null">
                            <img src="../assets/img/logo.jpg">
                        </p>
                        <ul class="manDetail">
                            <li>
                                <el-tooltip placement="bottom-start" effect="light">
                                    <div slot="content" style=" width:320px ;font-size:14px;line-height:18px ;">
                                    {{item.bookManage.name}}
                                    </div>
                                    <el-button>{{item.bookManage.name}}</el-button>
                                </el-tooltip>
                            </li>
                            <li>
                                <span>教材编码 :{{item.bookManage.namecode}}</span>
                            </li>
                            <li>
                                <span>
                                    <i class="iconfont icon-yonghu"></i>
                                        {{item.createName}}
                                </span>
                            </li>
                        </ul>
                        <!-- 具体操作 -->
                        <el-dropdown @command="handleCommand">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item class="clearfix" :command="[1,item.bookManage.id.toString()].join(',')">
                                取消归档
                            </el-dropdown-item>
                            <el-dropdown-item class="clearfix" :command="[0,item.bookManage.id.toString()].join(',')">
                                彻底删除
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <!-- 彻底删除提示 -->
                <el-dialog title="提示" :visible.sync="dialogVisible" id="dialog">
                    <span>删除后无法恢复，确定删除该教材？</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                         <el-button type="primary" @click="del">确 定</el-button>
                    </span>
                 </el-dialog>
            </el-col>
        </el-row>
    </div>
</div>
</template>
<script>
import API from '../assets/js/common.js'
import Navigation from 'Common/components/Navigation'
import Qs from 'qs'
export default {
        name: "filing",
        components: {
                "Navigation": Navigation
        },
        data() {
            return {
                name: "",
                src: "",
                list: [],
                loadImgId: "",
                dialogVisible: false,
                total: 0,
                pagenum: 1,
                hasNextPage: true,
                currentId: 0
            }
        },
        mounted() {
            var vm = this;
            vm.renderData(vm.pagenum); //加载数据
            if (vm.hasNextPage) {
                window.addEventListener('scroll', function() {
                    if ((API.getScrollTop() + API.getClientHeight() >= API.getScrollHeight()) && vm.pagenum > 1) {
                        vm.renderData(vm.pagenum);
                    }
                })
            }
        },
        methods: {
            renderData(pagenum) {
                var vm = this;
                API.axios_get("/bookManage/getFiledBookMange", {
                    userid: API.getCookie("userid"),
                    pagenum: pagenum,
                    pagesize: 16
                },
                function callback(data) {
                    if (data) {
                        vm.list = vm.list.concat(data.list);
                        vm.total = data.total;
                        vm.pagenum = data.nextPage;
                        vm.hasNextPage = data.hasNextPage;
                    }

                })
            },
            cancel(id) { //取消归档
                var vm = this;
                var parmas = {
                    userid: API.getCookie("userid"),
                    id: id
                };
                parmas = Qs.stringify(parmas);
                API.axios_put("/bookManage/cancelFiledBookManage", parmas,
                function callback(data) {
                    if (data) {
                        vm.$message({
                            message: '取消归档成功',
                            type: 'success'
                        });
                        setTimeout(_ => {
                            vm.spliceArr(id)
                        }, 1000)
                    }
                })
            },
            del() { //彻底删除
                var vm = this;
                vm.dialogVisible = false;
                var parmas = {
                    userid: API.getCookie("userid"),
                    id: vm.currentId
                };
                parmas = Qs.stringify(parmas)
                API.axios_put("/bookManage/deleBookManage", parmas,
                    function callback(data) {
                        if (data) {
                            vm.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            setTimeout(_ => {
                                vm.spliceArr(vm.currentId)
                            }, 1000)
                        }
                    })
            },
            handleCommand(command) {
                var vm = this;
                var flag = command.split(",");
                var status = flag[0];
                var id = flag[1];
                if (status == "1") {
                    vm.cancel(id);
                } else {
                    vm.dialogVisible = true;
                    vm.currentId = id;
                }
            },
            spliceArr(id) {
                this.list.forEach((item, index, array) => {
                    if (item.bookManage.id == id) {
                        this.list.splice(index, 1)
                    }
                })
            },
            go() {
                location.reload();
            }

        }
    }

</script>
<style scoped>
.manContent {
        margin-top: 30px;
        min-height: 500px;
}

.bg-purple p {
        width: 100%;
        background: #f1f3f7;
        height: 260px;
}

.bg-purple {
        border: 1px solid #ccc;
}

.manDetail {
        margin-top: 10px;
}

.manDetail li {
        color: #444;
        padding-left: 20px;
        line-height: 30px;
}

.manDetail li:first-child button {
        font-size: 18px;
        line-height: 18px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
        border: none;
        padding: 0;
        text-align: left;
}

.manDetail li:not(:first-child) {
        font-size: 16px;
        color: #999;
}

.content-wrap {
        position: absolute;
        width: 600px;
        height: 400px;
        top: 50%;
        margin-top: -300px;
        left: 50%;
        margin-left: -200px;
        background: #fff;
        border-radius: 20px;
}

.content {
        width: 100%;
        padding: 40px;
        box-sizing: border-box;
        height: auto;
}

.picture {
        margin-top: 20px;
        position: relative;
}

.save {
        background: #ccc;
        padding: 8px 30px;
        margin-top: 20px;
}

.el-col-8 {
        margin-bottom: 20px;
}

</style>

