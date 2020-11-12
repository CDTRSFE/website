---
sidebar: false
title: 通过axios-mock-adapter做接口模拟
author: 作者
---

## 通过axios-mock-adapter做接口模拟

对于模拟数据来说，我们尝试过多方案，比如：`easy-mock`、本地化mock等，这次要介绍的一种更近似与实际工作的工具：`axios-mock-adapter`。

> 顾名思义，该工具是与平时用到最多的 `axios` 库配套使用的，这个库可模拟基本的get、post请求、带参数的get请求、低级别的网络错误、网络超时、重定向等等功能。这个库只会拦截由 `axios` 发出的请求，并且不影响已经存在的真实接口，只拦截我们在工程中配置的接口。

由于现在是由前端团队来规定接口返回，当前端定义好接口并且与后端对接口均无异议后，后端进入开发但并未接口时，前端可以使用这个工具进行接口模拟开发，达到前后端平行开发的目的，减少等待时间，例如：

```js {5}
// 导入模块
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// 设置模拟调试器实例
var mock = new MockAdapter(axios, { onNoMatch: 'passthrough' }); // 原有接口不被影响
// 模拟任意GET请求到 /users
// reply的参数为 (status, data, headers)
mock.onGet('/media/sta.do', { method: 'getAllTypeSta' }).reply(200, {
  'msg': '获取数据成功',
  'code': '200',
  'datas': {
    'totalcount': 18, // 账号总数
    'applicationtotal': 10, // 开设账号总数
    'closetotal': 3, // 变更账号总数
    'changetotal': 5, // 关停账号总数
    'allmediasta': [
      {
        'type': 1, // 账号类型 1微信
        'name': '微信公众号',
        'application': 1, // 开设账号总数
        'change': 1, // 变更账号总数
        'close': 0 // 关停账号总数


      },
      {
        'type': 2,
        'name': '新浪微博',
        'application': 1,
        'change': 1,
        'close': 0

      }
    ]

  }
}, {});
```

这是我们定义的一个普通get请求，返回的字段与格式均与真实接口并无差异，现在我们来调用一下这个方法：

```js
getData() {
    const params = {
        method: 'testGetAllTypeSta'
    };
    this.$axios.get('/media/sta.do', { params: params }).then(data => {
        console.log(data);
    });
}
```

通过上面的调用方式可以看出，与平时我们调用真实接口的方式并无差距，当真实接口开发出来后，我们只需要修改请求的方法名即可。把 `testGetAllTypeSta` 更换为 `getAllTypeSta` 后，其他并不需要修改任何逻辑。


::: warning
存疑点：现在想到区分真实接口跟模拟接口的方式是给模拟方法加上test前缀，当真实接口部署后只要去掉前缀即可，希望后面大家有更好的方法作为区分。
:::


[原文链接](https://wiki.trscd.com.cn/pages/viewpage.action?pageId=70418532)