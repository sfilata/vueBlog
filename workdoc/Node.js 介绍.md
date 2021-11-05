# Node.js 介绍
相关文章: [[Node.js 原理详解]] [[网络]]

## 课程目标

- 熟悉 Node.js 相关概念，掌握其使用方法
- 了解相关基于 Node 的工具库以及使用方法

## 知识要点

#### 概念

Node.js 是一种服务端的 js 的运行环境，类比于浏览器。其封装了一些服务端的运行对象，可以进行一些与操作系统的交互。

#### 安装

可以通过二进制文件的编译进行安装，也可以去官网直接下载可执行程序来直接进行安装

Node 版本的切换 (n / nvm)
nvm (node version manager)

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v.0.35.3/install.sh | bash
```

**npm** -- Node.js 的包管理工具
npm 随 node 一起安装，是 node 自带的包管理工具。只要是符合 node.js 标准的模块，都可以通过其进行安装和发布，有助于共建整个 node 的生态。

> npx 命令
> npx 是 npm@5 之后新增的命令，它的主要作用，是可以在不安装模块到当前环境的前提下，直接运行一些 cli 的功能。
> 不会污染全局环境

#### node.js 的底层依赖

node.js 的主要依赖子模块主要有下面模块

- V8 引擎：用于解析 javascript 语法。相应的可以使用别的库来解析别的语言的语法(Python, C)
- libuv: C 语言实现的一个高性能异步非阻塞 IO 库，用来实现 node 的事件循环
- http-parser/lihttp: 底层处理 http 请求，处理报文，解析请求包等内容
- openssl: 处理加密算法，比较广泛的应用于其他框架
- zlib: 处理压缩等内容

#### node.js 常见内置模块

使用 commonJs 实现的常见的模块

- fs: 文件系统。提供向当前系统环境进行读写的能力
- path: 路径处理模块。能够处理路径相关的逻辑
- crypto: 加密相关模块。提供对内容进行标准加解密的能力
- dns: 处理 dns 相关逻辑。（设置 dns 服务器）
- http: 设置 http 服务器，有发送请求，监听相应等能力
- readline: 按照行的方式读取 stdin 的标准输入内容。可以进行读取，增加，删除命令行内容
- os: 操作系统层面 API。可以用来查询操作系统相关的参数
- vm: 用来处理沙箱环境的虚拟机模块，底层通过调用 V8 引擎的相关 API 进行代码解析

代码示例

```js
const path = require('path');

const resolvePath = path.resolve('a', 'b', 'c'); // /Users/neil/code/a/b/c
const joinPath = path.join('a', 'b', 'c'); // a/b/c

console.log(__dirname); // /Users/neil/code
console.log(__filename); // /Users/neil/code/test.js
```

### CommonJS 相关概念以及代码实现

示例:

```js
const vm = require('vm');
const path = require('path');
const fs = require('fs');

function myRequire(filename) {
  const filePath = path.resolve(__dirname, filename);
  const content = fs.readFileSync(filePath, 'utf-8');

  const wrappedArr = ['(function(myRequire, module, exports, customValue)) {', content, '})'];

  // Init the vm environment, make the string to the executable code.
  const script = new vm.Script(wrappedArr.join(''), {
    filename: 'index.js'
  });

  const module = {
    exports: {}
  };

  // Run the script in the script context
  // Result is the function for wrappered function return
  const result = script.runInThisContext();

  result(myRequire, module, module.exports, 'sfilata');
  return modules.exports;
}

global.myRequire = myRequire;
```

## 补充知识点
