# 课程目标

1. 了解前端路由发展史
2. 了解原理以及表现
3. Vue Router 的使用

# 知识要点

## 路由背景知识

1. 路由由后端控制。早期 SSR(php Server code -> jquery -> frontend code)
   每个路由直接是一个单独的 html 页面 (服务端渲染的多页应用)
   缺点：维护麻烦，前后端强耦合。服务端压力大。协作流程不清晰。
   优点：SEO 效果好，所有的信息直接存在与网页中，是已经完全渲染好的页面。首屏内容时间短。
   > 现在的前端状况，是从服务端渲染的多页应用 -> 单页应用 -> SSR
2. 路由由前端控制。单页应用 SPA
   不仅在页面的交互中没有刷新页面，跳转也不存在页面刷新。(router.push 跳转)
   初次访问通过 CDN 返回最初的文件，但之后跳转从 CDN 直接返回 js 文件，不再返回 html 文件
   webpack 将 js, img, html, css 等若干文件上传到 oss(对象存储，通过 cdn 返回文件)
   如果流量过大，只打在静态文件上的话就可以只通过扩充 CDN 带宽来解决

## 前端路由的特性

1. 通过不同的 url 来渲染不同的内容
2. 不进行刷新页面

## 前端路由原理

### hash 类型路由

#### 问题

> hash 路由的改变，会在 url 上有什么表现吗？
> hash 具体是怎么实现改变路由的？html? js?
> 如果通过 js 监听 hash 路由改变的

#### 知识

url 中的 hash 值是客户端/浏览器端的一种状态，向服务端进行请求时并不会进行改变
hash 的更改并不会导致页面的刷新
hash 值的更改会在浏览器的访问历史中增加记录。可以通过浏览器的前进后退按钮来访问相应的 hash
hash 值的更改，会通过 hashChange 的事件进行触发

#### 具体的改变方式

- `<a href="/#"></a>`
- `location.hash = '#'`

```js
class BaseRouter {
  constructor() {
    this.routes = {};
    this.refresh = this.refresh.bind(this);
    window.addEventListener('load', this.refresh);
    window.addEventListener('hashChange', this.refresh);
  }

  route(path, callback) {
    this.routes[path] = callback || function () {};
  }

  refresh() {
    const path = `/${location.hash.slice(1) || ''}`;
    const cb = this.routes[path];
    cb && cb();
  }
}
```

实现简单 Hash 路由类需要注意的要点

1. 数据结构的采用 (Object, O(1)复杂度)
2. refresh bind
3. 页面首次加载的路由渲染应该怎么处理
4. hashChange 的监听

### history 类型路由

hash 路由 url 会带有 # 号，不太美观。但 history 因为其路由改变可能会找不到相应的 html 文件
部署 history 路由的时候，注意要使所有的路由都能访问到 html 文件

#### 相关的方法

- window.history.back();
- window.history.forward();
- window.history.go();
- window.history.pushState(); 根据对象新增
- window.history.replaceState(); 根据对象覆盖

#### 知识

可以通过监听 popState 事件来监听 url 变化
pushState 和 replaceState 并不会触发 PopState 时间
哪些情况会触发 popState 呢？

1. 浏览器的回退/前进按钮
2. history back forawrd go

```js
// TODOs: Complete the code
class BaseRouter {
  constructor() {
    this.routes = {};
    this.refresh = this.refresh.bind(this);
    this.init();
    window.addEventListener('load', this.refresh);
    window.addEventListener('popstate', this.refresh);
  }

  init(path) {
    window.history.replaceState({ path }, null, path);
  }

  route(path, callback) {
    this.routes[path] = callback || function () {};
  }

  refresh(e) {
    const path = e.state && e.state.path;
    const cb = this.routes[path];
    cb && cb();
  }
}
```

## Vue Router

> Vue Router 从列表浏览了一段时间，点击进了一个详情页，然后返回的时候，期望返回的时候还是停留在原来的浏览位置上，该怎么实现？

- keep-alive
- localStorage / SessionStorage + scrollTop + scrollTo
- scrollBehavior
  ```js
  scrollBehavior = (to, from, savedPosition) => {
    return savedPosition;
  };
  ```

1. router-link 的跳转，scrollBehavior 没有记住滚动条的位置
2. 通过浏览器点击前进或者返回按钮，可以记住滚动条的位置

#### 导航守卫 (Router Guard)

beforeEnter -- 一些 Route 的操作钩子
记得在函数中调用 next 进行下一步的操作，要不会停止路由

导航守卫可以是某个路由的(beforeEnter)，
也可以是全局的(beforeEach, afterEach)，
还可以是组件内部的(beforeRouteEnter, beforeRouteUpdate, beforeRouteLeave)

### router-view 是什么？

是一个动态的组件，找到当前匹配的组件并把它展示出来

1. 异步加载路由组件
   会将路由组件单独按需加载
2. 同步加载路由组件
   会将所有路由组件加载进打包文件

### 导航守卫的执行顺序

1. [组件] 前一个组件的 beforeRouteLeave
2. [全局] router.beforeEach
3. [路由参数变化] beforeRouteUpdate
4. [配置文件] beforeEnter
5. [组件] beforeRouteEnter
6. [全局] afterEach

# 补充知识点

二叉树 bfs 广度优先遍历

二叉树 dfs 深度优先遍历 回溯 简直

动态规划

贪心算法

链表

递归

滑动窗口

> 剑指 offer
> leetcode hot100
