# 课程目标

- 了解一些 Vue 常用的使用方法
- 实现一些简单的 Vue 解决方案

# 知识要点

## mixin

混入，将一些变量和方法预置进 Vue 组件中，但官方不建议使用，尽量通过高阶组件，组合的方式来实现代码逻辑的提取和复用。

## 生命周期与合并策略的综合利用

Vue.config.optionMergeStrategies
Vue 底层封装默认的合并策略

## 插件

```js
const plugin = {
  install(vue, options) {
    // ...some logic to init plugin
  }
};
vue.use(plugin); // Must call before the new Vue()
```

插件的目的是提供一些全局的功能。例如 Router, 工具方法等

## 实战实例

在 Vue 中使用 React 组件

1. 使用插件加入新功能
2. 插件的 install 函数中用来覆盖 Vue.config.component 的配置项，用来作为判断 React 组件的 Hook
3. 在 Vue 的 Constructor 中加入 isVue 属性作为 Vue 组件的 Flag
4. 判断非 Vue 组件默认为 React 组件
5. 编写高阶组件 ReactWrapper (Vue 组件)，将实际 React 组件作为 props, 将其他正常 Vue 属性($attrs, $listeners)处理传进 React 组件
6. 在 ReactWrapper 的 mounted 生命周期里面进行转换操作, ReactDOM.render(h())

# 补充知识点

Vue 在底层支持了很多常用的用法，没有像 React 那样许多东西需要依照基础的 JS 知识自己去实现。所以相对于 React 而言，Vue 的学习曲线相对而言较为平滑。
