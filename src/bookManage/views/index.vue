<template>
<div>
    <Navigation/>
    <div class="book-container">
        <!-- 跳转归档 -->
        <router-link tag="a" to="/Filing" class="go"> 归档(<span>{{fileTotal}}</span>)</router-link>
        <!-- 列表 -->
        <el-row :gutter="24" class="manContent">
            <!-- 创建教材 -->
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <div class="creat" @click="showMask(true)" @click.stop>
                            <span><i class="el-icon-plus"></i>创建教材</span>
                    </div>
                </div>
            </el-col>
            <el-col :span="8" v-for="item in list">
                <!-- 列表属性 -->
                <div class="grid-content bg-purple" @click="goBook(item.bookManage.id,item.bookManage.name,$event)" style="cursor:pointer;">
                    <p v-if="item.bookManageLogoUrl != null">
                            <img :src="'http://leicloud.qiniudn.com/'+item.bookManageLogoUrl">
                    </p>
                    <p v-if="item.bookManageLogoUrl ==null">
                            <img src="../assets/img/logo.jpg">
                    </p>
                    <ul class="manDetail">
                        <li>
                            <el-tooltip placement="bottom-start" effect="light">
                                <div slot="content">
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
                                <!-- <span class="el-dropdown-link" style="margin-left: 10px;">
                                <i class="iconfont icon-yonghu2"></i>
                             1人
                            </span> -->
                        </li>
                    </ul>
                    <!-- 具体操作 -->
                    <el-dropdown @command="handleCommand" @click.stop>
                        <span class="el-dropdown-link">
                            <i class="el-icon-more"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item class="clearfix" :command="JSON.stringify({flag:0,json:item})">
                                            教材信息
                            </el-dropdown-item>
                            <el-dropdown-item class="clearfix" :command="JSON.stringify({flag:1,json:item})">
                                            归档
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>
    </div>
    <!-- 弹窗 -->
    <div class="mask" v-show="mask">
        <div class="content-wrap">
            <i class="el-icon-close" @click="showMask(false)"></i>
            <div class="content">
                <div class="demo-input-size">
                    <input type="text" name="name" placeholder="请输入教材名字" v-model="name">
                </div>
                <!-- 上传图片 -->
                <div class="picture">
                    <div class="left" v-loading="showImage" element-loading-text="正在加载中">
                    <img :src="src">
                    </div>
                    <div class="right">
                        <button @click="upload_image">上传封面</button>
                        <p>
                            建议尺寸800px*450px，只支持jpg、png
                        </p>
                    </div>
                    <!-- 上传图片组件 -->
                    <upload-image-tool @preview="preview_img" @success="success_img" ref="image">
                    </upload-image-tool>
                    <button @click="save" class="save">创建教材</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import API from '../assets/js/common.js'
import uploadImageTool from 'Common/components/uploadImageTool.vue'
import Navigation from 'Common/components/Navigation'
import '../assets/css/common.css'
import Qs from 'qs'
export default {
        name: "index",
        components: {
                'uploadImageTool': uploadImageTool,
                "Navigation": Navigation
        },
        data() {
                return {
                    name: "",
                    showImage: false,
                    src: "",
                    mask: false,
                    list: [],
                    loadImgId: 0,
                    name: "",
                    total: 0,
                    pagenum: 1,
                    fileList: [],
                    fileTotal: 0,
                    hasNextPage: true
                }
        },
        mounted() {
                var vm = this;
                vm.renderData(vm.pagenum); //加载数据
                vm.getFIieData(); //获取归档总数据
                if (vm.hasNextPage) { //滚动加载
                    window.addEventListener('scroll', function() {
                        if ((API.getScrollTop() + API.getClientHeight() >= API.getScrollHeight()) && vm.pagenum > 1) {
                                vm.renderData(vm.pagenum);
                        }
                    })
                }
        },
        methods: {
                renderData(pagenum) { //加载数据
                    var vm = this;
                    API.axios_get("/bookManage/getBookMange", {
                        //userid: API.getCookie("userid"),
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
                getFIieData() { //加载归档数据
                        var vm = this;
                        API.axios_get("/bookManage/getFiledBookMange", {
                            userid: API.getCookie("userid"),
                            pagenum: 1,
                            pagesize: 16
                    },
                    function callback(data) {
                        if (data) {
                                vm.fileTotal = data.total;
                        }

                    })
                },
                showMask(falg) { 
                     this.mask = falg;
                },
                upload_image: function() {
                    this.$refs.image.begin();
                },
                preview_img() { 
                    this.showImage = true;
                    this.src = "";
                },
                success_img(url, id) { //转换之后的图片url和id
                    this.src = 'http://leicloud.qiniudn.com/' + url;
                    this.loadImgId = id;
                    this.showImage = false;
                },
                authAll() { //验证
                    if (this.name == "") {
                        this.$message({
                            duration: 1000,
                            message: '教材名字不能为空',
                            type: 'error'
                        })
                        return false;
                    } else if (this.name.length > 100) {
                        this.$message({
                            duration: 1000,
                            message: '教材名字必须在100个字符以内',
                            type: 'error'
                        })
                        return false;
                    }
                    return true;
                },
                save() {
                        var vm = this;
                        if (vm.authAll()) {
                            this.mask = false;
                            var parmas = {
                                name: vm.name,
                                textbooklogo: vm.loadImgId,
                                ISBN: "",
                                ISLI: ""
                        }
                        parmas = Qs.stringify(parmas)
                        API.axios_post("/bookManage/saveOrUpdateBookManage", parmas,
                        function callback(response) {
                            if (response.status == 200) {
                                vm.$message({
                                        message: '创建成功',
                                        type: 'success'
                                });
                                setTimeout(_ => {
                                        location.reload();
                                }, 1000)
                            } else {
                                vm.$message.error('创建失败');
                            }
                        })
                    }
                },
                handleCommand(command) { //不同的操作类型
                    var vm = this,
                        object = JSON.parse(command),
                        status = object.flag,
                        items = object.json,
                        id = items.bookManage.id;
                    var parmas = {
                        userid: API.getCookie("userid"),
                        id: id
                    };
                    parmas = Qs.stringify(parmas);
                        if (status == "1") {
                            API.axios_put("/bookManage/filedBookManage", parmas,
                                function callback(response) {
                                    if (response.status == 200) {
                                        vm.$message({
                                            message: '归档成功',
                                            type: 'success'
                                    });
                                    setTimeout(_ => {
                                        location.reload();
                                    }, 1000)
                                    } else {
                                        vm.$message.error('归档失败');
                                    }
                                })
                        } else {
                            vm.goDetail(id, items.bookManageLogoUrl, items.bookManage.textbooklogo);
                        }
                },
                goDetail(id, src, textbooklogo) { //跳转到详情页
                    this.$router.push({
                        name: 'Update',
                        params: {
                            id: id,
                            logo: src,
                            logoId: textbooklogo
                        }
                    })
                },
                goBook(id,name,e) {
                    if (e.target.className === "el-icon-more") {
                        return false;
                    }
                    window.location.href = "/lcms/bookmaker.html?bookID=" + id+"&name="+name;
                    //window.location.href = "/bookmaker.html?bookID=" + id+"&name="+name;
                }
        }
}

</script>
<style scoped>
.manContent {
        margin-top: 30px;
        min-height: 600px;
}

.bg-purple p {
        width: 100%;
        background: #f1f3f7;
        height: 260px;
}

.bg-purple {
        border: 1px solid #ccc;
        padding-bottom: 10px;
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

.manDetail li:first-child button span {
        width: 100%;
        display: block;
}

.manDetail li:not(:first-child) {
        font-size: 16px;
        color: #999;
}

.creat {
        width: 100%;
        height: 100%;
        line-height: 360px;
        text-align: center;
        cursor: pointer;
        color: #999;
}

.creat span {
        position: relative;
}

.el-icon-plus {
        position: absolute;
        top: -20px;
        left: 20px;
}

.content-wrap {
        position: absolute;
        width: 600px;
        height: 420px;
        top: 50%;
        margin-top: -300px;
        left: 50%;
        margin-left: -210px;
        background: #fff;
        border-radius: 20px;
}

.content {
        width: 100%;
        padding: 50px;
        box-sizing: border-box;
        height: auto;
}

.picture {
        margin-top: 20px;
        position: relative;
}

.save {
        background: #ea5947;
        padding: 10px 30px;
        margin-top: 30px;
        line-height: 20px;
        border: none;
        color: #fff;
}

.el-icon-close {
        color: #999;
        right: 20px;
        position: absolute;
        top: 20px;
}

.el-col.el-col-8 {
        cursor: pointer;
}

.go {
        text-align: right;
        cursor: pointer;
        display: block;
        margin-bottom: 10px;
}

.demo-input-size {
        position: relative;
        line-height: 40px;
}

</style>

