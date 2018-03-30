<template>
    <div>
        <Navigation/>
        <div class="book-container">
             <div class="content">
                <div class="demo-input-size">
                     <label for="bookName">名称:</label>
                      <input type="text" placeholder="请输入教材名字" id="bookName" v-model="name">
                </div>
                <div class="demo-input-size">
                    <label for="picture">封面:</label>
                        <div class="picture">
                            <div class="left"><img :src="src"></div>
                            <div class="right">
                                <button @click="upload_image">上传封面</button>
                                <p>建议尺寸800px*450px，只支持jpg、png</p>
                             </div>
                            <upload-image-tool @preview="preview_img" @success="success_img" ref="image">
                             </upload-image-tool>
                     </div>
                </div>
                <button class="save" @click="save">保存</button>
             </div>
        </div>
    </div>
</template>
<script>
import API from '../assets/js/common.js'
import uploadImageTool from 'Common/components/uploadImageTool.vue'
import Navigation from 'Common/components/Navigation'
import Qs from 'qs'
export default {
        name: "update",
        components: {
            'uploadImageTool': uploadImageTool,
            "Navigation": Navigation
        },
        data() {
            return {
             showImage: false,
             loadImgId: this.$route.params.logoId,
             object: {},
             name: "",
             src: " "
            }
        },
        mounted() {
            this.render(this.$route.params.id); //加载数据
        },
        methods: {
            render(id) { //获取数据列表
                 var vm = this;
                  API.axios_get("/bookManage/getBookManageById", {
                  userid: API.getCookie("userid"),
                  id: id,
                }, function callback(data) {
                      vm.object = data;
                      vm.name = data.bookManage.name;
                      if (data.bookManageLogoUrl != null) {
                         vm.src = 'http://leicloud.qiniudn.com/' + data.bookManageLogoUrl;
                        }
                   })
                },
                preview_img() { //请求之前
                    this.showImage = true;
                },
                success_img(url, id) { //转换之后的图片url和id
                    this.src = 'http://leicloud.qiniudn.com/' + url;
                    this.loadImgId = id;
                },
                upload_image: function() { //触发图片change事件
                    this.$refs.image.begin();
                },
                authAll() { //验证
                   if (this.name == "") {
                       this.$message.error('教材名字不能为空');
                       return false;
                    } else if (this.name.length > 100) {
                       this.$message.error('教材名字必须在100个字符以内');
                       return false;
                    }
                       return true;
                },
                save() {
                     var vm = this;
                      if (vm.authAll()) {
                          var parmas = {
                          name: vm.name,
                          textbooklogo: vm.loadImgId,
                          ISBN: "",
                          ISLI: "",
                          id: vm.$route.params.id
                        };
                        parmas = Qs.stringify(parmas);
                        API.axios_post("/bookManage/saveOrUpdateBookManage", parmas,
                             function callback(response) {
                                if (response.status == 200) {
                                    vm.$message({
                                         message: '保存成功',
                                         type: 'success'
                                        });
                                     setTimeout(_ => {
                                        vm.$router.push({
                                             name: 'Index'
                                         })
                                        }, 1000)
                                    }
                              })
                        }
                }
        }
}

</script>
<style scoped>
.update {
        width: 95%;
        margin: 30px auto;
}

.content {
        height: 800px;
        margin-top: 30px;
        width: 1170px;
        margin: 0 auto;
}

.demo-input-size {
        margin: 0 auto;
        margin-top: 20px;
}

label {
        width: 10%;
}

.demo-input-size input {
        width: 90%;
        margin-left: 20px;
}

.picture {
        margin-top: 20px;
        position: relative;
        display: inline-block;
        margin-left: 20px;
}

.save {
        background: #ea5947;
        padding: 8px 30px;
        margin: 0 auto;
        margin-top: 20px;
        display: block;
        color: #fff;
        border: none;
}

</style>

