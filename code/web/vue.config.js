/*
 * @Descripttion: 
 * @Author: CY
 * @Date: 2020-05-27 18:02:53
 * @LastEditTime: 2020-05-28 15:02:00
 */ 
let glob = require('glob');
const webpack = require('webpack');
let urlConfig = require('./public/static/config.js')
// import {apiUrl} from './public/static/config.js';
console.log("apiUrl",urlConfig);

let server = urlConfig.apiUrl;
//配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath, defaultName) {
    let entries = {},
        tmp, htmls = {};

    // 读取src/pages/**/底下所有的html文件
    glob.sync(globPath + 'html').forEach(function (entry) {
        tmp = entry.split('/').splice(-3);
        htmls[tmp[1]] = entry
    })

    // 读取src/pages/**/底下所有的js文件
    glob.sync(globPath + 'js').forEach(function (entry) {
        tmp = entry.split('/').splice(-3);
        entries[tmp[1]] = {
            entry: entry,
            template: htmls[tmp[1]] ? htmls[tmp[1]] : 'index.html', //  当前目录没有有html则以共用的public/index.html作为模板
            filename: tmp[1] //  以文件夹名称.html作为访问地址
        };

    });
    entries["index"].filename = "index.html"
    console.log(entries)
    return entries;
}
let htmls = getEntry('./src/pages/**/*.', "main");
module.exports = {
    publicPath: "./",
    outputDir: 'dist', //构建输出目录
    assetsDir: 'assets', //静态资源目录(js,css,img,fonts)
    // assetsPublicPath: '/',
    // assetsSubDirectory: 'static',
    devServer: {
        port: 8999,
        host: '0.0.0.0',
        https: false,
        open: true,
        disableHostCheck: true,
        proxy:{
            '/api/':{
                target:server,
                changeOrigin:true,
                pathRewrite:{
                    '^/api':'/api'
                }
            },
            '/file/':{
                target:server,
                changeOrigin:true,
                pathRewrite:{
                    '^/api':'/api'
                }
            }
        }
    },
    pages: htmls,
    runtimeCompiler: true, //运行时编译
    configureWebpack: { //引入jquery
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
};