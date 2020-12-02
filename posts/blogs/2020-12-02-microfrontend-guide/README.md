# 微前端框架乾坤配置记录

## 主应用

### 1. 路由包装为`history`模式

```javascript
// src/main.js
import routes from './routes';
const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
```

### 2.  引入乾坤微前端主应用配置

```javascript
// src/mico/index.js

import { registerMicroApps, addGlobalUncaughtErrorHandler, start } from 'qiankun';

import apps from './apps';

registerMicroApps(apps,
{
  beforeLoad: [
    app => {
      console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
    },
  ],
  beforeMount: [
    app => {
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
    },
  ],
  afterUnmount: [
    app => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
    },
  ],
},);

addGlobalUncaughtErrorHandler((event) => {
  console.log(event);
  const { msg } = event;
  if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
    console.log('微应用加载失败，请检查应用是否可运行');
  }
});

export default start;
```

### 3. 配置子应用列表

```javascript
// /src/micfo/apps.js

const apps = [
    {
        name: 'planResource',
        entry: '//localhost:8083',
        container: '#iframe',
        activeRule: '/plan'
    },
    {
        name: 'configration',
        entry: '//localhost:8081',
        container: '#iframe',
        activeRule: '/configure'
    }
];

export default apps;
```

### 4. 主应用实例化后启动微应用监听

```javascript
// /src/main.js
import startQiankui from './micro';

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');

startQiankui();
```

## 子应用

### 1. `Vue`应用接入

### 1.1 修改`webpack`配置

```javascript
// webpack.config.js || vue.config.js

devServer: 
	port: 8083 // 端口要写死，因为主应用中配置子应用列表时用的是写死的端口配置
	disableHostCheck: false // 关闭主机检查，保证子应用可以被主应用fetch到
	headers: {
		'Access-Control-Allow-Origin': '*', // 配置跨域请求头，解决开发环境跨域问题
	}
	publicPath: process.env.NODE_ENV === 'production' ? '/newplanning/' : '//localhost:8083',  // 开发环境设置为当前固定访问地址
}
configureWebpack： {
	 output: { 
            library: 'planResource', // 名称要和主应用中配置的子应用列表中的name字段相同
            libraryTarget: 'umd', // 把子应用打包成 umd 库格式
            jsonpFunction: `webpackJsonp_planResource` //  此处后缀也要和名称保持一致
        }
}
```

#### 1.2 增加 public-path配置文件并在入口文件引入

```javascript
//  /src/micro/public-path.js
if (window.__POWERED_BY_QIANKUN__) {
    // eslint-disable-next-line no-undef
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

//  /src/main.js

import '@micro/public-path'
```

#### 1.3  路由实例化配置

```javascript
// src/router/index.js
import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers.js';

Vue.use(Router);

export default new Router({
    base: window.__POWERED_BY_QIANKUN__ ? '/plan' : '/', // 如果作为乾坤的子应用则使用主应用中配置的路由前缀，如果是独立运行则使用根目录
    mode: 'hash', 
    routes // 路由定义数组
});
```

### 1.4  `Vue`实例化包装和生命周期钩子导出

```javascript
//  /src/main.js
import './public-path';
import router from './router';
let instance = null;

// 重新包装render方法
function render(props = {}) {
    const { container } = props;
    const renderContainer = container ？ container.querySelector('#app') : '#app'; // 如果是作为子应用渲染，则渲染到主应用中配置的DOM节点中

    instance = new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount(renderContainer);
}

// 独立运行时直接渲染
if (!window.__POWERED_BY_QIANKUN__) {
    render();
}

export async function bootstrap() {
    console.log('[vue] vue app bootstraped');
}

export async function mount(props) {
    console.log('[vue] props from main framework', props);
    render(props); // 作为子应用渲染时将主应用传入的配置作为参数去渲染
}

export async function unmount() {
    instance.$destroy();
    instance.$el.innerHTML = '';
    instance = null;
    router = null;
}
```

#### 1.5  将代理信息复制到主应用

### 2. `angularjs` 应用接入

#### 2.1  引入 `HTML entry`

```html
// index.html
<body>
  <!-- ... >
	<script src="//localhost:8080/lib/micro/entry.js" entry></script>
</body>
```

#### 2.2 入口配置

```javascript
// /src/lib/micro/entry.js

((global) => {
    global['myAngularApp'] = {
        bootstrap: () => {
            console.log('myAngularApp bootstrap');
            return Promise.resolve();
        },
        mount: (props) => {
            console.log('myAngularApp mount', props);
            return render(props);
        },
        unmount: () => {
            console.log('myAngularApp unmount');
            return Promise.resolve();
        },
    };
})(window);

/**
 * [render 渲染函数]
 *
 * @param   {[type]}  props  [props description]
 *
 * @return  {[type]}         [return description]
 */
function render(props = {}) {
    if (props && props.container) {
        console.log('乾坤渲染');
        window.myActions = {
            onGlobalStateChange: function(...args) {
                props.onGlobalStateChange(...args);
            },
            setGlobalState: function(...args) {
                props.setGlobalState(...args);
            }
        };
        window.myActions.onGlobalStateChange(state => {
            const { token } = state;
            console.log(token);
            // 未登录 - 返回主页
            if (!token) {
                console.log('未检测到登录信息！');
                window.location.href = '/';
            }
            localStorage.setItem('myAngularApp-token', token);
        }, true);
    } else {
        angular.element(document).ready(function () {
            angular.bootstrap(document, ['app']);
            return Promise.resolve();
        });
    }
}

if (!window.__POWERED_BY_QIANKUN__) { 
    render();
}

```



## 通信

### 1.主应用

#### 1.1 初始化全局跨应用通信方法

```javascript
// /src/mico/actions

import { initGlobalState } from 'qiankun';
const initState = {};

const actions = initGlobalState(initState);
  
export default actions;
```

#### 1.2 在需要设置跨应用全局状态的组件内：

```javascript
<script>
import store from '@/store'
import httpService from '@/core/httpService'
import actions from '@/micro/actions'

export default {
  name: 'App',
  created() {
    if (!store.getters.token) {
        httpService.getToken().then(data => {
            store.commit('SET_TOKEN', data.data.token);
            actions.setGlobalState({ token: data.data.token });
        });
    }
  }
}
</script>
```

###  2. 子应用

#### 2.1 全局actions定义

```javascript
//  /src/micro/actions.js

function emptyAction() {
    // 警告：提示当前使用的是空 Action
    console.warn('Current execute action is empty!');
  }
  class Actions {
    // 默认值为空 Action
    actions = {
      onGlobalStateChange: emptyAction,
      setGlobalState: emptyAction
    };
    /**
     * 设置 actions
     */
    setActions(actions) {
      this.actions = actions;
    }
    /**
     * 映射
     */
    onGlobalStateChange(...args) {
      return this.actions.onGlobalStateChange(...args);
    }
    /**
     * 映射
     */
    setGlobalState(...args) {
      return this.actions.setGlobalState(...args);
    }
  }
  const actions = new Actions();
  export default actions;

```

#### 2.2 在应用渲染前获取从主应用上的通信方法并注入到actions里

```javascript
// /src/main.js

import actions from '@/micro/actions';

function render(props = {}) {
    if (props) {
        actions.setActions(props);
        actions.onGlobalStateChange(state => {
            const { token } = state;
            console.log(token);
            // 未登录 - 返回主页
            if (!token) {
              this.$message.error('未检测到登录信息！');
              return this.$router.push('/');
            }
            store.commit('SET_TOKEN', token);
          }, true);
    }
    const { container } = props;
    const renderContainer = container ? container.querySelector('#app') : '#app';

    instance = new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount(renderContainer);
}

export async function mount(props) {
    console.log('[vue] props from main framework', props);
    // 注册应用间通信
    render(props);
}
```

