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
        pageName:"calendar",
        userId:null,
        userName:null,
        isNewDialogVisible:false,
        isToDoDialogVisible:false,
        currentDate:"",
        lastCheckDate:Date.now(),
        isListNew:false,
        tipForm:{
            Title:"",
            TipStatus:null,
            TimeRange:[],
        },
        toDoForm:{
            Title:"",
            IsShow:0,
            DoDate:null,
        },
        todoList:[
            {id:1,Title:"233333",IsDisable:false,DoDate:"2020-06-03T00:00:00"},
            {id:2,Title:"23333323",IsDisable:false,DoDate:"2020-06-03T00:00:00"},
            {id:3,Title:"23333314",IsDisable:false,DoDate:"2020-06-03T00:00:00"},
            {id:4,Title:"2333335243",IsDisable:true,DoDate:"2020-06-03T00:00:00"},
            {id:5,Title:"233345633",IsDisable:false,DoDate:"2020-06-03T00:00:00"},
            {id:6,Title:"23543333",IsDisable:false,DoDate:"2020-06-03T00:00:00"},
        ],
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
            ],
            DoDate:[
                {required:true,message:"请选择时间",trigger:'blur'}

            ]
        }
    },
    methods: {
        refreshData(){
            this.getTipData(this.userId);
            this.getToDoList(this.userId);
        },
        getTipData(id){
            return this.$get(`${api.TipUrl}/${id}`).then(res=>{
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
        getToDoList(id){
            return this.$get(`${api.ToDoListUrl}/${id}`).then(res=>{
                this.todoList =res.data;
            }).catch(err=>{
                console.log("get ToDoList Error",err);
            })
        },
        postTip(data){
            return this.$post(`${api.TipUrl}`,data);
        },
        postToDo(data){
            return this.$post(`${api.ToDoListUrl}`,data)
        },
        postTipList(list){
            return this.$post(`${api.TipListUrl}`,list);
        },
        putTip(id){
            return this.$put(`${api.TipDisableUrl}`,{id:id}); 
        },
        putToDoList(id){
            return this.$put(`${api.ToDoDisableUrl}`,{id:id});
        },
        changeTipDate(tip){
            return this.$put(`${api.TipChangeDateUrl}`,tip);
        },
        deleteTip(id){
            return this.$delete(`${api.TipUrl}/${id}`);
        },
        deleteToDo(id){
            return this.$delete(`${api.ToDoListUrl}/${id}`);
        },
        handleTagDelete:function(tag){
            let index = this.todoList.findIndex(item=>{
                return item.id == tag.id;
            })
            if(index==-1){
                return;
            }
            this.todoList.splice(index,1);
            this.deleteToDo(tag.id).then((res)=>{
                this.$message.success("删除成功");
                this.$forceUpdate();
            }).catch(err=>{
                this.$message.error("删除失败");
                this.todoList.splice(index,0,tag);
                this.$forceUpdate();
            })
            
        },
        handleTagClick:function(tag){
            if(tag.IsShow==0){
                this.$message("该日程不提醒");
                return;
            }
            this.$message("提醒【"+tag.Title+"】时间："+tag.DoDate)
        },
        handleNewToDo:function(){
            this.isToDoDialogVisible = true;
        },
        handleChangeTodoList:function(){
            this.pageName = 'todolist';
            Notification.requestPermission((status)=>{
                if(status!=='granted'){
                    console.log("未开启通知权限！！！！");
                }
            })
            this.$forceUpdate();
        },
        handleChangeCalendar:function(){
            this.pageName = 'calendar';
            this.$forceUpdate();
        },
        handleTest:function(){
            Notification.requestPermission((result)=>{
            })
            let notice = new Notification("title",{
                body:"内容",
                tag:'notice1'
            });
            let notice1 = new Notification("title1",{
                body:"内容1",
                tag:'notice1'
            });
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
                    this.postTipList(result).then(res=>{
                        this.$message.success("新增成功");
                        for(let item of res.data){
                            this.events.push(this.setInputData(item));
                        }
                    })

                }
                this.isNewDialogVisible = false;
            });
        },
        handleSubmitNewToDo:function(){
            this.$refs['toDoForm'].validate(valid=>{
                if(valid){
                    let data = this.$deepClone(this.toDoForm);
                    data.userId = this.userId;
                    data.IsDisable = 0;
                    data.DoStatus = 0;
                    data.DoDate = new Date(data.DoDate);
                    this.postToDo(data).then(res=>{
                        this.$message.success("添加成功");
                        this.refreshData();
                    })
                    this.isToDoDialogVisible = false;
                }
            })
        },
        handleDialogClosed:function(){
            this.tipForm = {
                Title:"",
                TipStatus:null,
                TimeRange:[],
            }
            this.$refs['tipForm'].clearValidate();
        },
        handleToDoDialogClosed:function(){
            this.toDoForm = {
                Title:"",
                IsShow:0,
                DoDate:"",
            }
            this.$refs['toDoForm'].clearValidate();
        },
        handleNewList:function(){
            this.isListNew = true;
            this.isNewDialogVisible = true;
            this.currentDate = "";
        },
        handleLogout:function(){
            delCookie("id");
            delCookie("name");
            window.location.href = "login.html";
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
            return tmp;
        },
        setOutputData:function(data){
            let tmp = {
                id:data.id,
                TipDate:data.date,
                Title:data.text,
                TipStatus:data.status,
                IsShow:data.show?1:0,
                IsDisable:data.disabled?1:0,
            }
            return tmp;
        },
        changeDate(e, item, date) {
            if(item==null||date==null||item.date == date){
                return;
            }
            let updateIndex = this.events.findIndex(ele => ele.id === item.id)
            let orginDate = item.date;
            this.$set(this.events, updateIndex, {
                ...this.events[updateIndex],
                date
            })
            item.date = date;
            let tmp = this.setOutputData(item);
            this.changeTipDate(tmp).then((res)=>{
                this.$message.success("修改日期成功");
            }).catch(()=>{
                this.$message.error("修改日期失败");
                updateIndex = this.events.findIndex(ele => ele.id === item.id)
                this.$set(this.events, updateIndex, {
                    ...this.events[updateIndex],
                    orginDate
                })
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
        Notification.requestPermission((status)=>{
            if(status!=='granted'){
                console.log("未开启通知权限！！！！");
            }
        })
        setInterval(()=>{
            let lastTime = this.lastCheckDate;
            let nowTime = Date.now();
            for(let tag of this.todoList){
                if(tag.IsShow==0){
                    continue;
                }
                let tagTime = new Date(tag.DoDate);
                if(lastTime<tagTime&&tagTime<=nowTime){
                    new Notification("简易日历提醒",{
                        body:tag.Title,
                        tag:"简易日历"+tag.id
                    })
                }
            }
            this.lastCheckDate = nowTime;
        },1000*31)
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