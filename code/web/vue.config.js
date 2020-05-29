/*
 * @Descripttion: 
 * @Author: CY
 * @Date: 2020-05-27 18:02:53
 * @LastEditTime: 2020-05-29 10:57:51
 */ 
let glob = require('glob');
const webpack = require('webpack');
let urlConfig = require('./public/static/config.js')
// import {apiUrl} from './public/static/config.js';
console.log("apiUrl",urlConfig);

// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development';

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

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
            filename: tmp[1]+".html" //  以文件夹名称.html作为访问地址
        };

    });
    entries["index"].filename = "index.html"
    console.log(entries)
    return entries;
}
let htmls = getEntry('./src/pages/**/*.', "main.html");
module.exports = {
    // publicPath:  process.env.NODE_ENV === 'production' ? '/rili/' : './',
    publicPath:  './',
    outputDir: 'dist', //构建输出目录
    assetsDir: 'assets', //静态资源目录(js,css,img,fonts)
    productionSourceMap:false,
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
    css:{
        sourceMap:process.env.NODE_ENV === 'production' ? false:true,
    },
    pages: htmls,
    runtimeCompiler: true, //运行时编译
    configureWebpack: config => {
        // 生产环境相关配置
        if (isProduction) {
            //gzip压缩
            const productionGzipExtensions = ['html', 'js', 'css']
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp(
                        '\\.(' + productionGzipExtensions.join('|') + ')$'
                    ),
                    threshold: 10240, // 只有大小大于该值的资源会被处理 10240
                    minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                    deleteOriginalAssets: false // 删除原文件
                })
            )
        }
        config.plugins.push(
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        )
    },
    // configureWebpack: { //引入jquery
    //     plugins: [
    //         new webpack.ProvidePlugin({
    //             $: "jquery",
    //             jQuery: "jquery",
    //             "windows.jQuery": "jquery"
    //         })
    //     ]
    // },
};