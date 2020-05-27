<template>
    <div id="shop_manage_detail">
        <el-drawer :visible.sync="isDrawerShow" :before-close="handleBeforeClose" direction="rtl" size="90%"
            :append-to-body="true">
            <div slot="title">
                <h1 style="font-size: 30px;display: inline-block;margin-right: 50px;">{{drawerTitle}}</h1>
                <span>状态：</span>
                <div style="display: inline-block;margin-right: 20px;">
                    <span v-if="shopInfoForm.status == 0" style="font-weight: bold;font-size: 12px;color:lightgreen">开启</span>
                    <span v-if="shopInfoForm.status == 1" style="font-weight: bold;font-size: 12px;color:red">禁用</span>
                    <span v-if="shopInfoForm.status == 2" style="font-weight: bold;font-size: 12px;color:yellow">申请中</span>
                </div>
                <el-switch v-if="shopInfoForm.status != 2" v-model="shopInfoForm.status" :active-value="0" :inactive-value="1"></el-switch>
            </div>
            <div id="shop_manage_detail-body">
                <el-row>
                    <el-col :span="12">
                        <div style="width: 100%;height: 100%;">
                            <el-form :model="shopInfoForm" ref="shopInfoForm">
                                <el-form-item label="店铺名字" prop="shopName">
                                    <el-input size="mini" v-if="isEdit" v-model="shopInfoForm.shopName"
                                         class="form_input"></el-input>
                                    <span v-else>{{shopInfoForm.shopName}}</span>
                                </el-form-item>
                                <el-form-item label="店铺地址" prop="shopAddress">
                                    <el-input size="mini" v-if="isEdit" v-model="shopInfoForm.shopAddress"
                                         class="form_input"></el-input>
                                    <span v-else>{{shopInfoForm.shopAddress}}</span>
                                </el-form-item>
                                <el-button type="primary" size="mini" v-if="isEdit==false" @click="isEdit=true">修改
                                </el-button>
                                <el-button type="primary" size="mini" v-if="isEdit" @click="handleFormSubmit">确定
                                </el-button>
                                <el-button size="mini" v-if="isEdit" @click="handleFormCancel">取消</el-button>

                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        这里放店铺数据
                    </el-col>
                </el-row>
            </div>
        </el-drawer>
    </div>
</template>

<script>
    export default {
        name: "shop_manage_detail",
        data() {
            return {
                shopInfoForm: {
                    shopName: "店铺名字111",
                    shopAddress: "成都市武侯区科华路xx号",
                    picAddress: "/static/head.jpg",
                    status:0,
                },
                isEdit: false, //是否是修改状态
                isDrawerShow:false,
            };
        },
        props: {
            drawerTitle: {
                type: String,
                default: "店铺管理详情"
            },
            drawerShow: {
                type: Boolean,
                default: false,
                required: true
            }
        },
        components: {},
        mounted() {
            this.isDrawerShow = this.drawerShow;
        },
        methods: {
            handleBeforeClose: function () {
                this.hide();
            },
            //处理表单确定
            handleFormSubmit: function () {
                this.isEdit = false;
            },
            //处理表单取消
            handleFormCancel: function () {
                this.isEdit = false;
            },
            //显示
            show: function () {
                this.isDrawerShow = true;
                this.$emit('updateshow', true);
            },
            //隐藏
            hide: function () {
                this.isDrawerShow = false;
                this.$emit('updateshow', false);
            }
        },
        watch: {
            drawerShow(val){
                this.isDrawerShow = val;
            },
            isDrawerShow(val){
                this.$emit('updateshow', val);
            }
        }

    }
</script>

<style lang='scss' rel="stylesheet/scss" scoped>
    #shop_manage_detail-body {
        position: relative;
        width: 100%;
        padding: 0 20px;
        height: 100%;
    }

    .form_input {
        width: 200px;
    }
</style>