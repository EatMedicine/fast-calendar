import Vue from 'vue'
import "./login.scss"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import $ from 'jquery';
import axios from 'axios'
Vue.prototype.$axios= axios;
import {get,post,put,del,setCookie,getCookie,delCookie} from './../../utils/common'
Vue.prototype.$axios= axios;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$put = put;
Vue.prototype.$delete = del;
Vue.prototype.$deepClone = function(obj){
    return JSON.parse(JSON.stringify(obj));
}

Vue.use(ElementUI)

Vue.config.productionTip = false;

import {
    api
} from '@/utils/api.js';

// new Vue({
//   render: h => h(App)
// }).$mount('#app')
var vm = new Vue({
    el: '#app',
    data: {
        name:"简单日历",
        loginForm:{
            username:"",
            password:"",

        },
        regDialogForm:{
            loginName: '',
            userPwd: '',
            nickname: "",
            picAddress: "",
            businessStatus: 0,
        },
        isRegDialogVisible:false,
        isForgetDialogVisible:false,
        rules:{
            username:[
                {required:true,message:"用户名不能为空",trigger:"blur"}
            ],
            password:[
                {required:true,message:"密码不能为空",trigger:"blur"},
                {min:6,max:32,message:"密码的长度为6~32",trigger:"blur"}
            ],
        }
    },
    methods: {
        //点击 登录按钮
        handleLoginBtnClick:function(){
            this.$get(api.UserLoginCheckUrl,{UserName:this.loginForm.username,UserPassword:this.loginForm.password}).then((res)=>{
                this.$message.success("登录成功");
                setCookie("id",res.data.id,7*24*60);
                setCookie("name",res.data.UserName,7*24*60);
                window.location.href = "/main";
            }).catch(()=>{
                this.$message.error("账号或密码错误");
            })
        },
        //注册dialog 已关闭
        handleRegDialogClosed:function(){
            
        },
        //忘记密码dialog 已关闭
        handleForgetDialogClosed:function(){
            
        },
        //注册按钮点击
        handleRegister:function(){
            this.isRegDialogVisible = true;
        },
        //忘记密码按钮点击
        handleForget:function(){
            this.isForgetDialogVisible = true;
        },
        //图片上传前检查
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //处理上传成功
        handleAvatarSuccess(res, file) {
            this.regDialogForm.picAddress = res.path;
        },
        //注册提交
        handleRegDialogSubmit:function(){
            return this.$post(businessApi.businessUrl,this.$deepClone(this.regDialogForm)).then((res)=>{
                console.log("success",res)
                this.$message.success("注册成功");
                this.closeRegDialog();
            })
        },
        //忘记密码提交
        handleForgetDialogSubmit:function(){

        },
        closeRegDialog:function(){
            this.isRegDialogVisible = false;
        },
        closeForgetDialog:function(){
            this.isForgetDialogVisible = false;
        },
    },
    mounted () {
        //自动跳转
        let id = getCookie("id");
        let name = getCookie("name");
        if(id!==null&&name!==null){
            window.location.href = "/main";
        }  
    },
    computed: {
        
    },
    watch: {
        
    }
});