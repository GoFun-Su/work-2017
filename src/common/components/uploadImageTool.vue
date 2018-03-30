<style scoped>
.hide {
    display: none;
}
</style>
<template>
            <div class="photoUpload">
                    <input type="file" 
                             @change="onFileChange" 
                              class="hide" 
                              ref="file" 
                              name="file" 
                              accept="image/*.png,image/*.jpg,image/*.jpeg">
            </div>
</template>
<script>
export default {
           props: [],
           components: {

           },
           data() {
                      return {
                                image_url: ''
                      }
           },
           methods: {
                      begin: function() {
                                 var vm = this;
                                $(this.$refs.file).click();
                     },
                     onFileChange: function(e) {
                                var vm = this;
                                var e = e||window.event; 
                                var target = e.srcElement || e.target;

                                 var files = target.files;
                                 if (files.length === 0) {
                                            return;
                                 }
                                 if (vm.authFile(files[0])) {
                                           vm.$emit('preview');
                                           this.createImage(files[0]);
                                }
                     },
                    authFile(file) {
                                if (!/\/(?:jpeg|png|jpg)/i.test(file.type)) {
                                            this.$message({
                                                      duration: 1000,
                                                      message: '图片格式不正确',
                                                      type: 'error'
                                           })
                                        return false;
                                } else if (file.size >= 1024 * 1024 * 10) {
                                            this.$message({
                                                    duration: 1000,
                                                    message: '图片大小不正确',
                                                    type: 'error'
                                            })
                                            return false;
                                }
                              return true;
                      },
                      createImage: function(file) {
                                 var vm = this;
                                axios.get("../../api/material/getToken/getToken", {
                                            params: {
                                                     fileName: file.name
                                            }
                                }).then(({data}) => {
                                            var fileInfo = data;
                                            vm.uploadFormData(file, fileInfo);
                                })
                      },
                      uploadFormData(file, fileInfo) {
                                var vm = this;
                                var fd = new FormData();
                                fd.append("key", fileInfo.key);
                                fd.append("token", fileInfo.uptoken);
                                fd.append("file", file);

                                var xhr = new XMLHttpRequest();
                                xhr.open("post", 'http://upload.qiniu.com/', true);
                                xhr.onload = function() {
                                        var res;
                                          if (xhr.status >= 200) {
                                                    res = JSON.parse(xhr.responseText);
                                                    vm.saveUrl(file, res.key);
                                            } else {
                                                    this.$alert(xhr.status);
                                            }
                                }
                                xhr.send(fd);
                    },
                    saveUrl(file, key) {
                                var vm = this;
                                axios.post("../../api/material/material/add/-1", {
                                        materialSize: file.size,
                                        fileType: file.name.substring(file.name.lastIndexOf("."), file.name.length),
                                        materialName: file.name,
                                        materialUrl: key
                                }).then((response) => {
                                            vm.$notify({
                                            title: '成功',
                                             message: '上传成功！',
                                            type: 'success'
                                });
                                vm.$refs.file.value = '';
                                vm.$emit('success', key, response.data.materialId);
                            })
                    }
            }
}
</script>
<style type="text/css">
.error {
    position: absolute;
    color: red;
    opacity: 0.6;
    left: 20px;
    top: 200px;
}
</style>
