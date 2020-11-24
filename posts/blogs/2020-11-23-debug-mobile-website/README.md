---
sidebar: false
title: 移动端网页真机调试
author: zhaoqing
---

# 移动端网页真机调试

平时使用 Chrome 模拟移动设备开发页面，只能大致了解页面在移动设备上呈现的外观和效果，最终在真机调试的过程不可避免，比如公众号打开的网页，在微信浏览器上才能调用某些 API；嵌入到 webview 中的网页需要和客户端交互，就只能在真机上调试。

## 调试移动端网页

移动端网页不管是运行在浏览器上还是在 webview 中，调试的方式类似，嵌入到 webview 中的网页，需要先开启 debug 模式。

### Android Chrome

安卓手机可以直接链接电脑用 Chrome 调试，此方法需要满足三个条件才能使用：

1. Android 4.4+
2. 手机上开启允许 USB 连接设备进行调试
3. 客户端开启 WebView debug 模式

```java
//开启 webview 的 debug 模式
webview.setWebContentsDebuggingEnabled(true);
```

调试步骤：

1、打开手机开发者模式，勾选 USB 调试

2、使用 USB 数据线连接手机和电脑，并允许 USB 调试

<img src="https://tva1.sinaimg.cn/large/0081Kckwgy1gksjcc49xsj318c0s4gym.jpg" alt="image-20201117222403333" style="zoom:20%;" />

3、电脑打开 Chrome 浏览器，在地址栏输入：`chrome://inspect/#devices` 并勾选 `Discover USB devices` 选项

![image-20201123112512354](https://tva1.sinaimg.cn/large/0081Kckwgy1gkyy1rqnykj32a60i67eb.jpg)

4、Chrome 点击 inspect 按钮

![image-20201123112431734](https://tva1.sinaimg.cn/large/0081Kckwgy1gkyy12lwjqj32a00m0all.jpg)

> 使用 Chrome Inspect 查看页面时，Chrome 需要从 [https://chrome-devtools-frontend.appspot.com](https://chrome-devtools-frontend.appspot.com/) 加载资源，如果调试界面是一片空白，需要翻墙，加载完成后第二次进入就不需要了。

5、进入调试界面

![image-20201117215811997](https://tva1.sinaimg.cn/large/0081Kckwgy1gksilfiiomj31if0u0x0a.jpg)

### IOS Safari

用 Safari 浏览器调试和安卓类似，需要满足的条件：

1.  调试网页需要用 safari 打开
2. 如果调试 webview ，客户端必须是开发版，并开启 debug 模式

调试步骤：

1、iPhone 开启 Web 检查器（`设置` -> `Safari浏览器` -> `高级` -> `开启 Web 检查器`）

![1-1](https://tva1.sinaimg.cn/large/0081Kckwgy1gkyy7nnsicj30yk0p3gv2.jpg)

2、iPhone 打开要调试的页面

3、连接 iPhone 和 Mac，点击弹出框的信任按钮

<img src="https://tva1.sinaimg.cn/large/0081Kckwgy1gkyy9ghckfj30n81bsdqw.jpg" alt="image-20201123113232751" style="zoom:40%;" />

4、Mac 打开 Safari 浏览器调试（`菜单栏` —> `开发` -> `iPhone 设备名` -> `选择调试页面`）

![image-20201118100538563](https://tva1.sinaimg.cn/large/0081Kckwgy1gkt3mfbzbxj31l40cs43l.jpg)

如果菜单栏没有“开发”选项，可以到左上角 `Safari` -> `偏好设置` -> `高级` -> `在菜单栏中显示“开发”菜单`。

<img src="https://tva1.sinaimg.cn/large/0081Kckwgy1gkt9ty79gnj316o0my0wu.jpg" alt="image-20201118134027662" style="zoom:50%;" />

在弹出的调试窗口中，可以看到当前网页的各种信息，和 pc 网页端调试方式相同。

![image-20201118133258921](https://tva1.sinaimg.cn/large/0081Kckwgy1gkt9m5fl3ej327w0h6n31.jpg)

## 微信浏览器网页调试

### 微信开发者工具

1.x版本的开发者工具不支持移动调试。只能使用[开发者工具](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Web_Developer_Tools.html)调试[微信网页授权](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)，和在浏览器上打开网页差不多，只是在开发者工具里可以调试 JS-SDK 相关功能与权限，模拟大部分 SDK 的输入和输出。

### TBS Studio

调试微信网页也可以使用 [TBS Studio](https://x5.tencent.com/tbs/guide/debug/season1.html) , MacOs 和 Windows 均可安装，IOS 不能使用此工具来调试微信网页，因为微信 IOS 端不能启用 X5 内核。安卓手机使用步骤：

1、下载 TBS Studio

2、连接电脑，并开启 USB 调试

3、微信打开 `debugmm.qq.com/?forcex5=true`页面启用 X5 内核

4、微信打开 `http://debugx5.qq.com`页面，勾选`打开 TBS 内核 Inspector 调试功能`

<img src="https://tva1.sinaimg.cn/large/0081Kckwgy1gkyyb0ba7zj30sm1bm14o.jpg" alt="image-20201118163440869" style="zoom:45%;" />

5、启动 TBS Studio 点击 `启动检测`，检测完成后点击 `启动调试`

![image-20201123113508853](https://tva1.sinaimg.cn/large/0081Kckwgy1gkyyc4wvhgj31hm0u0wu4.jpg)

6、点击 insepct 按钮

![image-20201123113549418](https://tva1.sinaimg.cn/large/0081Kckwgy1gkyycu3lbdj32a40o84dr.jpg)

## 其他

1. [iOS WebKit Debug Proxy](https://github.com/google/ios-webkit-debug-proxy) 通过 web socket 连接，调试 IOS 真机或者模拟器上的网页或者 webview ，Windows, MacOS 和 Linux 均支持安装。如果需要在 windows 上调试 IOS 网页用这个工具比较方便。

2. [RemoteDebug iOS WebKit Adapter](https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter) 是一个协议转接器，可以通过 VS Code，Chrome DevTools，Mozilla Debugger 调试 IOS 上的 WebViews 和 Safari 网页。Windows, MacOS 和 Linux 均可安装。

3. [Inspect](https://inspect.dev/) , 声称可以跨平台调试，可以在 MacOs 和 Windows 上调试 IOS 和 Android 网页，无需数据线，还支持通过 wifi 连接。

3. [vConsole](https://github.com/Tencent/vConsole) 是一个轻量可扩展的移动端网页开发工具，可以直接引入项目中，支持自定义插件，手动执行 js 代码，不过不能打断点。

3. 微信 IOS 端调试网页可以使用 [spy-debugger](https://github.com/wuchangming/spy-debugger)。

## 总结

Android + Chrome 和 IOS + Safari 是最优解，使用最方便效果也最好。开发移动端网页，如果手机和电脑在一个局域网内，只需要将 url 改成电脑的 ip，可以让项目运行在手机上，实时预览效果，开发对宿主 APP 有依赖的网页可以提升开发效率。

