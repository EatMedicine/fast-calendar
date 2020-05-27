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
import {get,post,put,del} from './../../utils/common'
Vue.prototype.$axios= axios;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$put = put;
Vue.prototype.$delete = del;
Vue.prototype.$deepClone = function(obj){
    return JSON.parse(JSON.stringify(obj));
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


var vm = new Vue({
    el: '#app',
    router,
    components:{

    },
    data: {
        events: [
            {
                id: 111,
                date: '2020-05-03 00:00:00',
                text: '老铁，扎心了',
                status: 1,
                show:true,
                disabled:false,
            },
            {
                id: 222,
                date: '2020-05-03 00:00:00',
                text: '来啊，互相伤害',
                status: 2,
                show:true,
                disabled:false,
            },
            {
                id: 333,
                date: '2020-05-03 00:00:00',
                text: '这个人好会装逼',
                status: 3,
                show:true,
                disabled:false,
            },
            {
                id: 444,
                date: '2020-05-03 00:00:00',
                text: '那你很棒哟',
                status: 4,
                show:true,
                disabled:false,
            },
            {
                id: 555,
                date: '2020-05-03 00:00:00',
                text: '我表示很无奈',
                status: 5
            },
            {
                id: 666,
                date: '2020-05-09 00:00:00',
                text: '老铁，扎心了',
                status: 6,
                show:true,
                disabled:false,
            },
            {
                id: 777,
                date: '2020-05-09 00:00:00',
                text: '来啊，互相伤害',
                status: 7
            },
            {
                id: 888,
                date: '2020-05-09 00:00:00',
                text: '这个人好会装逼',
                status: 8,
                show:true,
                disabled:false,
            },
            {
                id: 999,
                date: '2020-05-09 00:00:00',
                text: '那你很棒哟',
                status: 9,
                show:true,
                disabled:false,
            },
            {
                id: 1010,
                date: '2020-05-09 00:00:00',
                text: '我表示很无奈',
                status: 10,
                show:true,
                disabled:false,
            }
        ],
    },
    methods: {
        changeDate(e, item, date) {
            const updateIndex = this.events.findIndex(ele => ele.id === item.id)
            this.$set(this.events, updateIndex, {
                ...this.events[updateIndex],
                date
            })
        },
        onEventClick:function(event,item){
            console.log("EventClick",event,item);
        },
        onDateClick:function(event,item){
            console.log("DateClick",event,item);
        }
    },
    computed: {
        
    },
    watch: {
    },
    mounted () {
    },
});