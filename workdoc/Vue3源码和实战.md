# 课程目标

分析 Vue3 源码
使用 Vue3 进行简单列表的开发

# 知识要点

## 响应式源码

## Proxy 对象

只能代理对象，不能代理简单值。
在 Proxy 的 handle 中在取值和赋值的方法中分别插入劫持的方法，依赖的追踪以及副作用的触发(track, trigger)

- track 收集依赖
- trigger 触发副作用
- effect 副作用函数
- reactive/ref 基于普通对象创建代理对象的方法
- watch, computed

重点查看 Ref, Reactive 赋予响应式的源码
reactivity.esm-browser.js

#### Ref

trackRefValue
triggerRefValue

```js
function ref(value) {
  return createRef(value, false);
}
```

ref 中使用类的`get value() {} set value(value) {}` 进行响应式拦截
reactive 中使用了 new Proxy 进行代理

baseHandlers collectionHandlers

## effect

trackEffects

## 虚拟 DOM

vue.esm-browser.js

diff patch 算法

patchUnkeyedChildren
patchKeyedChildren

## 实战

# 补充知识点

Map 和 WeakMap
Map 是强引用，WeakMap 是弱引用，而且 key 值只能是一个对象
