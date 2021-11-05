# ES6 规范详解 & ESNext 规范
相关文章：[[ES6 项目实战]]

## 课程目标

- ECMA 的前世今生
- ES6 新增主要 API 详解
- 重难点以及面试常见问题
- babel 简介

## 知识要点

### ECMAScipt 由 Netscape 和 Sun Microsystem 创建并提交的国际标准

ES6 === ES2015

### ES6 主要 API

- Const 常量声明
- Arrow Function 箭头函数，不改变 this
- Class 类
- Deconstruction 解构赋值
- Array for of 可迭代对象操作

#### Const 标识常量

1. 不允许重复声明
   在 ES5 中使用 Object.getProperty()对 get 进行拦截，或者将 writable 改为 false.
2. 块级作用域

```js
{
  const a = '123';
}
console.log(a); // 无法访问到a
```

3. 无变量提升

```js
console.log(hello); // 无法访问到hello, 必须先声明再使用
const hello = '123';
```

4. 暂时性死区

5. let 变量 ===> let 和 const 关键字在什么时候去使用
   优先去使用 const, 我们大部分使用的变量都不会去改变。

6. 如果数据是复杂数据类型，const 关键字只能限制指针无法被更改，但指向的内容还是可以被改变的。

可以使用 Object.freeze()进行属性冻结。属性不能被修改，但不会报错。但如果属性中含有复杂数据类型(Array, Object)。其属性指向的值依然可以被改变。

代码问题：实现一个 deep 化的 freeze。不断遍历对象，检测到复杂类型的话去递归 freeze

#### Arrow_Function 箭头函数

1. 具体形式

```js
const add = function (a, b) {
  return a + b;
}; // 传统写法
const add = (a, b) => a + b; // 箭头函数
```

2. 上下文 - this

```js
const obj = {
  name: 'sfilata',
  getName() {
    return this.name;
  },
  getArrowName: () => {
    return this.name;
  }
};

obj.getName();
obj.getArrowName(); // undefined
```

箭头函数没有自己独立的 this，会去拿上一层的 this 的值。

**需要注意箭头函数 this 指向的地方**

1. Dom 操作

```js
const btn = document.getElementById('app');
btn.addEventListener('click', () => {
  this.style.height = '200px'; // 此处this会指向window
});
btn.addEventListener('click', function () {
  this.style.height = '200px'; // 此处this正常指向btn
});
```

2. 类操作

```js
function Obj(name, age) {
  this.name = name;
  this.age = age;
}

const Obj2 = (name, age) => {
  this.name = name;
  this.age = age;
};

const person = new Obj2('sfilata', 18); // 报错，箭头函数无法进行new调用

Obj.prototype.getName = function () {
  const hello = 'world';
  console.log(`My Name is ${hello}`);
};

Obj.prototype.getName = () => {
  const hello = 'world';
  console.log(`My Name is ${hello}`); // 报错，箭头函数无法构造原型方法
};
```

3. 箭头函数的参数变化
   箭头函数没有 arguments, 但可以通过解构拿到参数

```js
const getResult = () => {
  console.log(arguments);
};
getResult(1, 2); // undefined
const getResult = (...rest) => {
  console.log(resr);
};
getResult(1, 2); // [1, 2]
```

> 总结： 箭头函数在某种程度上只是方便了书写，使用的时候需要特别注意 this 指向，以防出现期望外的 Bug.

#### Class 关键字

class 本质上来说只是 function 的一种语法糖

```js
// 传统写法
function Person(name, age, gender) {
  this.name = name;
  this.age = age;
  this.gender = gender;
}

Person.prototype.getName = function () {
  return this.name;
};

const p1 = new Person('sfilata', 22, 'male');
console.log(p1.getName());

// 使用ES6 Class 关键字
class Es6Person {
  constructor(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
  }

  getName() {
    return this.name;
  }
}

const p2 = new Es6Person('sfilata', 22, 'male');
console.log(p2.getName());
```

属性定义既可以在 constructor 中直接定义，还可以通过 get, set 进行定义

```js
class Person {
  constructor(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    let _secret = 'xuuuu';
    // 闭包实现私有变量
    this.getSecret = function () {
      return _secret;
    };
  }

  get job() {
    return 'programmer'; // 可以定义只读变量
  }

  set job(val) {
    throw new Error('This is readonly');
    return;
  }
}
```

`#` -> 类私有域 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/Private_class_fields

```js
class ClassWithPrivateField {
  #privateField;

  #privateMethod() {
    return this._someValue;
  }

  static #PRIVATE_STATIC_METHOD() {}
}
```

使用用途以及意义：封装核心-适配器模式

> 底层封装好通用的 core 服务，将 core 储存起来，输出经过处理的值

静态方法。直接挂载在类上，无需进行 class 的实例化，直接可以进行调用的方法。

```js
class Test {
  static method() {
    return 'A method'; // ES6 静态方法
  }
}
```

继承相关

```js
let Child = Object.create(Parent); // 传统方法
function Parent(name) {
  this._name = name;
}

function Child(age) {
  Parent.call(this, 'Parent');
  this._age = age;
}

Child.prototype = Parent.prototype;

class Child extends Parent {
  // Es6 方法
  constructor() {
    super(); // 调用父类的初始化方法
  }
}
```

解构

```js
// Object
const obj = { name: 'sfilata', age: 18 };
const { name, age } = obj;
const { name: userName } = obj;

const name = obj.name;
const age = obj.age;
const userName = obj.name;

// Array
const arr = ['a', 'b', 'c'];
const [a, b, c] = arr;
const a = arr[0];
// ...

const course = {
  teacher: {
    name: 'aaa',
    age: 20
  },
  name: 'bbb'
};

const { name, { name: teacherName }} = course; // Duplicated Key
```

#### 解构的使用场景

- 数组传参
- 参数默认值
- 函数返回值
- 变量替换
- 变量处理
- ajax

```js
const add = ([a, b, c]) => a + b + c;

const sayHello = ({ name, date = new Date().format('yyyy-mm-dd') }) => {
  console.log(`Say Hello, ${name} on ${date}`);
  return {
    name,
    date
  };
};

let a = 1;
let b = 2;
[a, b] = [b, a];

const json = '{ "name": "sfilata" }';

const { name } = JSON.parse(json);

ajax.get(URL).then(({ data, code }) => {
  // ...logic
});
```

- Ajax

## 补充知识点

#### 面试题

- class 是什么类型

```js
// 代码接上述的Es6Person
typeof Es6Person === 'function';
```

- class 是否有 prototype 属性

```js
console.log(Es6Person.prototype); //与新建的对象prototype保持一致
```

- class 是否可以访问对象方法属性呢？

```js
console.log(Es6Person.hasOwnProperty('name')); // true
```
