## 课程目标

- 复习Typescript相关的基础概念，学会基础使用
- 熟悉相关的用法, 理解泛型的使用方案和使用场景
- 在实战项目中正确地应用Typescript， 用来提高工作效率

## 知识要点

### 基础知识

JavaScript中有很多类型
基础类型: number, string, boolean, array
引用类型: object

#### 枚举
```typescript
enum ActicityStatus {
	NOT_START, // 0
	STARTED // 1
}
```

#### type, interface
```typescript
type UserInfo = {
	name: string;
	age: number;
}

interface UserInfo {
	name: string;
	age: number;
}

const person: UserInfo = { name: 'aaaa', age: 18 };
```

#### 联合类型 |，交叉类型 &
```typescript
interface Name {
	firstName: string;
	lastName: string;
}

interface ChineseName {
	firstName: string;
	familyName: string
}

type NameA = Name | ChineseName // Name or ChineseName
type NameB = Name & ChineseName // { firstName: string, lastName: string, familyName: string }
```

#### typeof, keyof
```ts
// typeof example
function connectArr(arrA: number[], arrB: number[]): number[] {
	return [...arrA, ...arrB];
}
type Func = typeof connectArr;

const addArr: Func = function (arr1, arr2) {
  return arr1.map((item, index) => item + arr2[index]);
};

// keyof example
interface Person {
	name: string;
	age: number;
}

type PersonKeys = keyof Person // 'name' | 'age'
```

#### in
用来遍历枚举值
```ts
type Keys = 'name' | 'age' | 'gender'

type Person = {
	[key in Keys]: string
}
// { name: string; age: string; gender: string; } 
```

#### extends
```ts
interface LengthAble {
  length: number;
}

function showLength<T extends LengthAble>(param: T): T {
  console.log(param.length);
  return param;
}
// 入参和返回值都必须包含{ length: number }
```

#### Partial, Required, Readonly
Partial可以把参数所有的key变为可选项, Required可以把参数所有的key变为必选项, Readonly可以把参数所有的key变为只读值
```ts
interface Person {
	name: string;
	age?: number;
	gender: 'male' | 'female'
}

type OptionPerson = Partial<Person> // { name?: string; age?: number; gender?: 'male' | 'female' }
type RequiredPerson = Partial<Person> // { name: string; age: number; gender: 'male' | 'female' }

// Readonly 类似于 const，修改时会报错
```

#### Record
将所有的属性的值转化为另一种类型
```ts
type Keys = 'name' | 'age' | 'gender'
const x: Record<Keys, string> = {
	name: 'string',
	age: 'string',
	gender: 'string',
}
```


#### Exclude
将某个类型中属于另一个类型的属性剔除掉
```ts
interface A {
	name: string;
	lastName: string;
	familyName: string;
}

interface B {
	familyName: string;
}

const Person: Exclude<keyof A, keyof B> = 'name'; 'name' | 'lastName'
```

#### Extract
将某个类型中属于另一个类型的属性取出
```ts
interface A {
	name: string;
	lastName: string;
	familyName: string;
}

interface B {
	familyName: string;
}

const Person: Extract<keyof A, keyof B> = 'familyName'; // 'familyName'
```



## 补充知识点

### 涉及到的面试题

#### 使用Typescript有什么好处?

1. 是JS的超集，在保证所有功能的同时，还添加了新的功能
2. 增加了类型限制，可以在开发过程中直接把一些比较低级的类型错误提前暴露出来
3. 包含类和接口的概念，更加靠近其他面向对象的语言
4. 因为是强类型语言，可以很直接地看到相关的类型，可读性比较强，在某种程度上相当于注释
5. 添加了很多很方便的功能。比方说可选链。
```ts
if (obj?.a?.b) {}
if (obj && obj.a && obj.a.b) {}
```

#### 在Typescript中，interface和type关键字有什么异同?

type用来描述类型，interface用来描述数据结构
相同点：
1. 都可以描述类型
2. 都可以进行继承扩展(extends), 可以互相继承
不同点：
定义联合类型，别名，元组类型只能使用type
```ts
type a = TYPEA | TYPEB
type MyArr = number[]
type Param = [string, number]
```

#### 如何从一个已有的数据类型扩展出一个大部分内容相似，但部分区别的类型
使用Pick, Omit方法进行操作
```ts
interface Person {
	name: string;
	age: number;
	gender: string
}

type PersonWithName = Pick<Person, 'name'>
type PersonWithoutName = Omit<Person, 'name'>
```

#### 什么是泛型？平时如何使用泛型？
泛型就是定义的时候不预先定义具体类型，实际类型在使用的时候依照其他类型而定
```ts
interface MyObject<T = any> {
	name: T;
	age: T;
	gender: T;
}

type ObjectWithString = MyObject<string> // { name: string; age: string; gender: string }
```

### 具体实践
- 编写一个装饰器函数，用来计算函数运行的时间
```ts
export function measure(target: any, name: string, descriptor: PropertyDescriptor) {
	const oldVal = descriptor.value
	
	descriptor.value = async function () {
		// console.time(name)
		const start = Date.now()
		const res = await oldVal.apply(this, arguments)
		// console.timeEnd(name)
		console.log(`${name} Function used ${Date.now() - start}ms`)
		return res
	}
	
	return descriptor
}

class Test{
	@measure
	handleSeach() {
		return new Promise((resolve, reject) => {
			setTimeout(() => { resolve('return result') }, 1000)
		})
	}
}
```

- 编写一个装饰器函数，实现缓存读取
```ts
const cacheMap = new Map()

export function enableCache(target: any, name: string, descriptor: PropertyDescriptor) {
	const oldVal = descriptor.value
	
	descriptor.value = async function (...args) {
		const key = name + JSON.stringify(args)
		
		if (!cacheMap.get(key)) {
			const cacheValue = Promise.resolve(val.apply(this, args)).catch(e => {
				cacheMap.set(key, null)
			})
			cacheMap.set(key, cacheValue)
		}
		return cacheMap.get(key)
	}
	
	return descriptor
}

class Test{
	@enableCache
	handleSeach() {
		// ... request when the cache not hit only
	}
}
```
- 编写一个路由跳转增强方法，可以通过typescript来检测传入的参数是否合法
```ts
enum RoutePath {
	Index = '/',
	About = '/about',
	User = '/user'
}

export type BaseRouteType = Dictionary<string>; // Dictionary<T> => { [key: string]: T }

export interface IndexParam extends BaseRouteType {
	commonInfo: string;
	commonId: string;
}

export interface AboutParam extends BaseRouteType {
	companyInfo: string;
	aboutInfo: string;
}

export interface UserParam extends BaseRouteType {
	userInfo: string;
}

export interface ParamMap {
	[RoutePath.Index]: IndexParam;
	[RoutePath.About]: AboutParam;
	[RoutePath.User]: UserParam;
}

export class RouterHelper {
	public static replace<T extends RoutePath>(routePath: T, params: ParamMap[T]) {
		Router.replace({ path: routePath, query: params })
	}
	
	public static push<T extends RoutePath>(routePath: T, params: ParamMap[T]) {
		Router.push({ path: routePath, query: params })
	}
}

// RouterHelper.push(RoutePath.About, { commonInfo: '', commonId: '' }) limit the structure for the query
```
- 实现一个基于ts和事件模式的countdown基础类
```ts
import { EventEmitter } from 'eventemitter3'
export enum CountDownEventList {
	START = 'start',
	STOP = 'stop',
	RUNNING = 'running'
}

enum CountDownStatus {
	RUNNING,
	PAUSED,
	STOPPED
}

export interface RemainTime {
	day: number;
	hour: number;
	minute: number;
	second: number;
	millisecond: number;
}

interface CountdownEventMap {
	[CountDownEventList.START]: [];
	[CountDownEventList.STOP]: [];
	[CountDownEventList.RUNNING]: [remainTime];
}

export default function fillZero(num: number) {
	return `0${num}`.slice(-2); // x -> 0x; xx -> xx
}

export class Countdown extends EventEmitter<CountdownEventMap> {
	private endTime: number
	private step: number
	private status: CountDownStatus = CountDownStatus.STOPPED
	private remainTime: number = 0
	// step: the step amount every countdown
	constructor(endTime: number, step: number = 1e3) {
		super()
		this.endTime = endTime;
		this.step = step;
	}
	
	public start() {
		this.emit(CountDownEventList.START)
		this.status = CountDownStatus.RUNNING
	}
	
	public stop() {
		this.emit(CountDownEventList.STOP)
		this.status = CountDownStatus.STOPPED
	}
	
	private countdown() {
		if (this.status === CountDownStatus.RUNNING) {
      this.remainTime = Math.max(0, this.endTime - Date.now())
      this.emit(CountDownEventList.RUNNING, this.formatRemainTime(this.remainTime))
      if (this.remainTime > 0) {
        const timer = setTimeout(() => this.countdown(), this.step)
      } else {
        this.stop()
      }
		}
	}
	
	private formatRemainTime(remainTime: number): RemainTime{
		// TODO: Format the remainTime from number to remainTime
		// use fillZero function to get normail data format
	}
}

const countdown = new Countdown(Date.now() + 10 * 60 * 1000); // countdown for ten minutes, count down every second

countdown.on('run', function(remainTime: RemainTime) {
	const { day, hour, minute, second, millisecond } = remainTime
	console.log('The countdown is running')
})
```
> 衍生题：EventEmitter 是同步的还是异步的？ 
Node库里面是同步的，事件触发时遍历回调取出callback直接执行。