# 课程目标

了解 Vue2 源码
熟悉初始化的过程，生命周期钩子调用过程
set, delete, watch, data, props 等属性方法的使用和原理
重点查看 stateMixin 中的代码，了解其实现挂载的过程

# 知识要点

## 初始化过程

### initMixin

### stateMixin

### eventsMixin

### lifeCycleMixin

### renderMixin

# 补充知识点

面试题 3 beforeCreate 和 Created 之间做了什么？二者有什么区别？

面试题 4 props 和 data 是如何把属性挂载在 vm 上的?

面试题 5 vm.$options data 为什么是函数？不返回值会报错吗？components 为什么可以使用 Object？

如果可以的话应该尽量避免使用$set 和 $nextTick?
