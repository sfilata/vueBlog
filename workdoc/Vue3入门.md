# 课程目标

- 对比 Vue2 对 Vue3 的新特性进行学习
- 掌握关键技术点，使用相应技术进行组件开发

# 知识要点

## 响应式实现

- Vue2 使用 Object.defineProperty 重定义 getter setter 进行拦截
  - 对数组或者深嵌套对象不支持，需要重写数组方法
  - 新增的属性会丢失响应，需要重新定义
- Vue3 使用 Proxy 代理对象来拦截兑现个属性的访问与赋值过程
  - 完美解决 Vue2 的相关问题，但兼容性需要注意，可能需要降级兼容

示例代码

```js
const initData = { value: 1 };

const data = {};

Object.keys(initData).forEach((key) => {
  Object.defineProperty(data, key, {
    get() {
      console.log(`Getting the ${key} data, the value is ${initData[key]}`);
      return initData[key];
    },
    set(value) {
      console.log(`Setting the data to ${value}, the key is ${key}`);
      initData[key] = value;
    }
  });
});

console.log(data.value);
data.value = 3;
```

```js
const initData = { value: 1 };
const proxy = new Proxy(initData, {
  get(target, key) {
    console.log(`Getting the ${key} data in ${JSON.stringify(initData)}, the value is ${target[key]}`);
    return target[key];
  },
  set(target, key, value) {
    console.log(`Setting the ${key} data to target, the new value is ${value}`);
    return Reflect.set(target, key, value);
  }
});

console.log(proxy.value);
proxy.value = 2;
```

## Vue3 新特性

### 异步组件需要使用`defineAsyncComponent`来创建

```js
// Vue2
new Vue({
  // ...
  components: {
    'async-com': () => import('./asyncComponent')
  }
});

// Vue3
const asyncCom = defineAsyncComponent(() => import('./asyncComponent'));
```

### 自定义指令更新

#### Vue2

- bind
- inserted
- update
- componentUpdated
- unbind

#### vue3

- bind -> beforeMount
- inserted -> mounted
- beforeUpdate
- update
- componentUpdated -> updated
- beforeUnmount
- unbind -> unmounted

### Teleport

可以使元素脱离父元素的限制进行渲染，但逻辑还是在父元素内。
实现弹框，全屏等业务时较为有用

### 多根节点组件、函数式组件

不再需要一个唯一的根节点，但是可能需指定数据继承

```html
<main v-bind="$attrs"></main>
```

### Vue3 中函数组件的唯一用例就是简单无状态组件，渲染性能会略微增加

```js
import { h } from 'vue';

export default function FunctionalComponent(props, context) {
  return h('div', context.attrs, props.msg);
}
```

### 组合 API [组合式 API](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)

#### setup 函数

组件的入口函数，代替了原来的 created。
Vue3 新加的组合式 API 主要使用都在这个函数中

- reactive 用于包装对象
- watch watch 的第一个参数如果是函数的话，会以函数的返回值是否变化作为回调函数执行的依据。如果是响应式的对象，则以对象的属性变化为准
- watchEffect 内部的响应式对象变化时则直接执行，回调函数需要使用属性。如没有用到的话则不会调用
- ref 用于包装基本变量，访问需要加.value
- toRefs 可以将 reactive 解构仍然具有响应式 //TODOS: Confirm
- computed 用于计算属性
- provide, inject 依赖注入，跨组件通信

setup 语法糖
取消导出和 setup 函数，只用编写 setup 函数中的内容
props, emit 使用 defineProps 和 defineEmits 函数来进行获取

# 补充知识点

- Vue2 只能创建全局的 Vue 实例`new Vue()`, 但 Vue3 可以通过 `createApp` 函数来创建多个 Vue 实例，可以使用不同的配置挂在在不同的 DOM 节点上
- Data 声明不再允许传入对象，而是要求传入函数来解决数据共享问题
- v-if 的优先级现在高于 v-for
- <templte v-for> 以及非 v-for 节点 上 key 的用法已更改
- 渲染函数不再提供 createElement 参数(h 函数), 而是需要从依赖中导入
- 标签上的属性与绑定对象上的属性有冲突时，以后出现的属性为准，不再给单独属性设置更高的优先级
- Vuex 与依赖注入形式的区别，两种方式都有什么好处
