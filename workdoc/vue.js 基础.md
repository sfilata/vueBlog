# 课程目标

- 了解 Vue 的基础概念以及基础使用

# 知识要点

## Vue.js 简介

Vue 是一个响应式的前端视图层框架
可以依照官方文档进行一些简单的 Demo 编写，此处不与展示基本代码。[VueJs 官网教程](https://cn.vuejs.org/v2/guide/instance.html)

### 常见的指令列举

- v-bind
- v-model
- v-on
- v-if(v-else, v-else-if)
- v-show
- v-for(不仅可以循环数组，也可以循环对象)
- v-html
- v-text

### 计算属性

计算属性的优势在于惰性求值，如果返回一个函数，则惰性求值只会在外层函数中进行应用，所以这样使用就丧失了惰性求值的优越性

### 渲染函数

Vue 渲染可以将模版写在 html，也可以直接使用 render 函数进行渲染
在网速比较缓慢的情况，可能会出现先显示模版，再进行编译展示真实内容的过程。可能会影响 Web 体验。

### 组件 [官方实例](https://cn.vuejs.org/v2/guide/components.html)

一般命名采用中划线进行命名

#### 需要注意的组件类型

- 有状态组件与无状态组件
- 有无副作用(有意识的去分隔副作用，并将有副作用的部分提取到一个地方)

### 生命周期

![img](https://cn.vuejs.org/images/lifecycle.png)

# 补充知识点

## 库和框架的区别

库一般是提供一系列方法，主要编码方式掌握在自己手里，通过这一系列方法来提高自己的开发效率和编码方式。
而框架一般是提供一种编程模式和规范，主要按照其使用方法进行编码而达到其所能提供的一系列功能。

## 表达式和语句的区别

表达式(expression)一般指的是单独可以运行的代码，一般具有返回值。
语句(statement)一般指的是一段代码，具有上下文，一般是多个表达式的集合。
