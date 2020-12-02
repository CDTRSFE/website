# npm cli工具调试
## 准备工具
1. Node
2. chrome浏览器
## cli工具开发简单描述
1. 创建一个package.json文件，添加bin对象，指定各个内部命令对应的入口文件的位置
```json
   {
      "bin": {
         "trs": "./bin/cmd"
      }
   }
```
2. 在入口文件首行添加代码`#!/usr/bin/env node`，用来告诉操作系统使用node运行这个文件
3. 常用开发组件：
   - commander CLI常用开发框架
   - chalk 终端文字加颜色js组件
   - log-symbols 为各种日志级别提供着色的
   - ora 加载动画效果
   - download-git-repo git下载
   - inquirer 提供用户界面和查询会话流
## npm link 软连接
`npm link`可以将全局模块和开发模块建立一个符号链接，这样本地修改的代码可以同步到全局模块中。同时可以再项目目录中通过指定模块名将本地模块和全局模块链接。通过`npm unlink`可以解除链接。
![](https://raw.githubusercontent.com/2446505739/pic_git/master/img/20201202135728.jpg)
## inspect简介
当使用该命令开关符启动检查器时，一个Node.js进程开始侦听调试客户端。可以在基于Chromium内核的浏览器下打开chrome://inspect调试源代码。
## cli工具调试
1. 在项目工程里的package.json中scripts添加脚本`node --inspect-brk cli工具入口文件地址 cli工具命令`(需要写成npm脚本，因为需要将cli命令以参数的形式传入)
```json
   {
      "scripts": {
         "debug": "node --inspect-brk ../trs-page-cli/dist/main.js d"
      }
   }
```
1. 在命令行窗口中执行该脚本![](https://raw.githubusercontent.com/2446505739/pic_git/master/img/20201202135727.jpg)
2. 在命令行中执行该脚本
3. 在chrome浏览器中打开[chrome://inspect](chrome://inspect)，点击地址旁的inspect即可打开调试界面![](https://raw.githubusercontent.com/2446505739/pic_git/master/img/20201202172817.jpg)