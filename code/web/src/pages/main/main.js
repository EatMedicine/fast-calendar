import Vue from 'vue';
import "@/style/global.css";
import "@/style/global.scss";
import "./style/main.scss";
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import '@/style/theme-FFA500/index.css'
import scheduleCalendar from '@/components/scheduleCalendar.js'

Vue.component(scheduleCalendar.name, scheduleCalendar)


//引入vue组件
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

Date.prototype.Format = function(fmt)   
{  
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}


Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.config.productionTip = false

//路由
const routes = [
    // {path:"*",component:Hello},
    // {path:'/',component:Hello,name:"总览",alias: "/overview"},
]
const router = new VueRouter({
    routes:routes, // (缩写) 相当于 routes: routes
    // mode:'history'
})


import {
    api
} from '@/utils/api.js';

var vm = new Vue({
    el: '#app',
    router,
    components:{
    },
    data: {
        events: [],
        isMobile:false,
        userId:null,
        userName:null,
        isNewDialogVisible:false,
        currentDate:"",
        isListNew:false,
        tipForm:{
            Title:"",
            TipStatus:null,
            TimeRange:[],
        },
        statusList:[
            {id:1,color:"#f44336"},
            {id:2,color:"#e91e63"},
            {id:3,color:"#9c27b0"},
            {id:4,color:"#3f51b5"},
            {id:5,color:"#2196f3"},
            {id:6,color:"#00bcd4"},
            {id:7,color:"#4caf50"},
            {id:8,color:"#cddc39"},
            {id:9,color:"#ff9800"},
            {id:10,color:"#607d8b"},
        ],
        rules:{
            Title:[
                {required:true,message:"请输入内容",trigger:'blur'},
            ],
            TipStatus:[
                {required:true,message:"请选择标记颜色",trigger:'blur'}
            ],
            TimeRange:[
                {required:true,message:"请选择日期范围",trigger:'blur'}
            ]
        }
    },
    methods: {
        refreshData(){
            this.getTipData(this.userId);
        },
        getTipData(id){
            return this.$get(`${api.TipUrl}/${id}`).then(res=>{
                console.log("get Tip",res);
                let data = res.data;
                let result = [];    
                for(let tip of data){
                    result.push(this.setInputData(tip))
                }
                this.events = result;
            }).catch(err=>{
                console.log("get Tip Error",err);
            })
        },
        postTip(data){
            return this.$post(`${api.TipUrl}`,data);
        },
        postTipList(list){
            return this.$post(`${api.TipListUrl}`,list);
        },
        putTip(id){
            return this.$put(`${api.TipDisableUrl}`,{id:id}); 
        },
        deleteTip(id){
            return this.$delete(`${api.TipUrl}/${id}`);
        },
        handleSubmitNew:function(){
            this.$refs['tipForm'].validate(valid=>{
                if(valid!=true){
                    return;
                }
                if(this.isListNew==false){
                    let data = this.$deepClone(this.tipForm);

                    delete data.TimeRange;
                    data.TipDate = this.currentDate;
                    data.userId = this.userId;
                    data.IsShow = 1;
                    data.IsDisable = 0;
                    this.postTip(data).then(res=>{
                        this.$message.success("新增成功");
                        this.events.push(this.setInputData(res.data));
                    })
                }else{
                    console.log(this.tipForm);
                    let data = this.$deepClone(this.tipForm);
                    let beginDate = new Date(this.tipForm.TimeRange[0]);
                    let endDate = new Date(this.tipForm.TimeRange[1]);
                    let result = [];
                    while(beginDate<=endDate){
                        result.push({
                            Title:data.Title,
                            TipStatus:data.TipStatus,
                            userId:this.userId,
                            TipDate: beginDate.toLocaleDateString(),
                            IsShow:1,
                            IsDisable:0
                        })
                        beginDate.setDate(beginDate.getDate()+1)
                    }
                    debugger
                    this.postTipList(result).then(res=>{
                        debugger
                        this.$message.success("新增成功");
                        for(let item of res.data){
                            this.events.push(this.setInputData(item));
                        }
                    })

                }
                this.isNewDialogVisible = false;
            });
        },
        handleDialogClosed:function(){
            this.tipForm = {
                Title:"",
                TipStatus:null,
                TimeRange:[],
            }
            this.$refs['tipForm'].clearValidate();
        },
        handleNewList:function(){
            this.isListNew = true;
            this.isNewDialogVisible = true;
            this.currentDate = "";
        },
        setInputData:function(data){
            let tmp = {
                id:data.id,
                date: data.TipDate,
                text:data.Title,
                status:data.TipStatus,
                show:data.IsShow==1?true:false,
                disabled:data.IsDisable==1?true:false,
            }
            console.log("input",tmp);
            return tmp;
        },
        changeDate(e, item, date) {
            const updateIndex = this.events.findIndex(ele => ele.id === item.id)
            this.$set(this.events, updateIndex, {
                ...this.events[updateIndex],
                date
            })
        },
        onEventClick:function(event,item){
            if(item.isDisable==true){
                return;
            }
            let time = item.date.Format("yyyy-MM-dd");
            this.$confirm(`确定要完成${time}的【${item.item.text}】吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                console.log("handle disable",item);
                item.isDisable = true;
                item.item.disabled = true;
                this.putTip(item.item.id).then(res=>{
                    this.$message.success("完成成功");
                }).catch(()=>{
                    this.$message.error("完成失败");
                    item.isDisable = false;
                    item.item.disabled = false;
                })
            })
        },
        onItemDelete:function(event,item){
            let time = item.date.Format("yyyy-MM-dd");
            this.$confirm(`确定要删除${time}的【${item.item.text}】吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                console.log("handle delete",item);
                let tmp = item.item;
                this.events.splice(this.events.findIndex((item)=>tmp.id==item.id),1);
                this.deleteTip(item.item.id).then(res=>{
                    this.$message.success("删除成功");
                }).catch(()=>{
                    this.$message.error("删除失败");
                    this.events.push(tmp);
                })
            })
        },
        onDateClick:function(event,item){
            console.log("DateClick",event,item);
            this.currentDate = item;
            this.isListNew = false,
            this.isNewDialogVisible = true;
            
        }
    },
    computed: {
        
    },
    watch: {
    },
    mounted () {
        //判断是否为移动端
        let isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
        this.isMobile = isMobile;
        this.userId = getCookie("id");
        this.userName = getCookie("name");
        if(this.userId==null||this.userName==null){
            window.location.href = "login.html"
        }
        this.refreshData();
        setInterval(()=>{
            this.refreshData();
            console.log("Refresh");
        },1000*30)
        console.log("isMobile",isMobile);
    }
});
// [
//     {
//         id: 111,
//         date: '2020-05-03 00:00:00',
//         text: '老铁，扎心了',
//         status: 1,
//         show:true,
//         disabled:false,
//     },
//     {
//         id: 222,
//         date: '2020-05-03 00:00:00',
//         text: '来啊，互相伤害',
//         status: 2,
//         show:true,
//         disabled:false,
//     },
//     {
//         id: 333,
//         date: '2020-05-03 00:00:00',
//         text: '这个人好会装逼',
//         status: 3,
//         show:true,
//         disabled:false,
//     },
//     {
//         id: 444,
//         date: '2020-05-03 00:00:00',
//         text: '那你很棒哟',
//         status: 4,
//         show:true,
//         disabled:false,
//     },
//     {
//         id: 555,
//         date: '2020-05-03 00:00:00',
//         text: '我表示很无奈',
//         status: 5
//     },
//     {
//         id: 666,
//         date: '2020-05-09 00:00:00',
//         text: '老铁，扎心了',
//         status: 6,
//         show:true,
//         disabled:false,
//     },
//     {
//         id: 777,
//         date: '2020-05-09 00:00:00',
//         text: '来啊，互相伤害',
//         status: 7
//     },
//     {
//         id: 888,
//         date: '2020-05-09 00:00:00',
//         text: '这个人好会装逼',
//         status: 8,
//         show:true,
//         disabled:false,
//     },
//     {
//         id: 999,
//         date: '2020-05-09 00:00:00',
//         text: '那你很棒哟',
//         status: 9,
//         show:true,
//         disabled:false,
//     },
//     {
//         id: 1010,
//         date: '2020-05-09 00:00:00',
//         text: '我表示很无奈',
//         status: 10,
//         show:true,
//         disabled:false,
//     }
// ]