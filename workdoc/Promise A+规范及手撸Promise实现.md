## 课程目标

- 了解并熟悉A+规范
- 按照A+规范进行代码设计
- 手撸一个满足A+规范的Promise，并通过测试
- 在实现过程中记录遇到的问题以及可能延伸的面试题，记录并总结

## 知识要点

### PromiseA+规范

详细A+规范可以参考 

Promises/A+ 规范promisesaplus.com

大概内容总结如下

### 1. Status

#### Pending:

Promise的初始状态，可以进行改变，变为resolved或者rejected

#### Fulfilled:

Promise的决议状态，是Promise通过resolve方法更改的，此状态无法被更改为其他状态。此时Promise必须包含一个value值，作为Promise决议的结果。

#### Rejected:

Promise的决议状态，是Promise通过reject方法更改的，此状态无法被更改为其他状态。此时Promise必须包含一个reason值，作为Promise最终拒绝的结果。

> 注意：此处指明的决议状态指的是决议完成的最终状态，不可以进行改变。

### 2. Method

#### then: 

Promise应该提供的方法，用来访问最终的结果，可以同时访问到value 或者 reason的值。

```
promise.then(onFulfilled, onRejected);
```

包含两个参数，用来处理resolve和reject的结果，类型必须是函数，如果是其他类型则直接忽略掉。

相应的onFulfilled, onRejected根据语义分别处理fulfilled 与 rejected的情况。参数分别是value和reason。

两个参数都只被允许执行一次。

then方法可以被多次调用，每次调用返回一个全新的promise。所有的回调应该按照then的顺序依次执行。
> 注意：一个Promise可能会进行多次then调用，因此实现过程中需要一个数组来存储相应的回调调用。onFulfilled一个数组，onRejected一个数组

两个参数都应该是微任务。
> 好多实现都用setTimeout, 但这个函数是很典型的宏任务。此处应该使用queueMicrotask 实现微任务的调用

#### ResolvePromise：
```javascript
resolvePromise(promise2, x, resolve, reject)
```

1. 如果promise2与x相等，直接报错 reject TypeError
2. 如果x是一个Promise且是Pending状态。则必须等待，直到x决议。如果x是fulfilled或者rejected，直接将相应的value 或者 reason 进行下一步的透传。
3. 如果x是一个Object或者是一个Function。检测then方法是否可用，如果出错，直接reject。如果then可用，则调用此方法
```javascript
then.call(x, resolvePromise, rejectPromise)
```

resolvePromise 的参数是value, 执行resolvePromise(promise2, value, resolve, reject)。调用 then 方法的时候如果出现异常，判断 resolvePromise, rejectPromise的状态。因为两个函数只会调用一次，如果已经调用则直接忽略，如果没有则reject error

代码实现自定义 Promise
```javascript
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MPromise {
  constructor(fn) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;

    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }

  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];
  _status = PENDING;

  static resolve(value) {
    if (value instanceof MPromise) {
      return value;
    }

    return new MPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static race(promiseList) {
    return new MPromise((resolve, reject) => {
      const len = promiseList.length;

      if (len === 0) {
        return resolve();
      } else {
        for (let i = 0; i < len; i++) {
          MPromise.resolve(promiseList[i]).then(
            (value) => {
              return resolve(value);
            },
            (reason) => {
              return reject(reason);
            }
          );
        }
      }
    });
  }

  static all(promiseList) {
    return new MPromise((resolve, reject) => {
      const len = promiseList.length;
      const resultArr = [];
      let promiseCount = 0;

      if (len === 0) {
        resolve();
      } else {
        for (let i = 0; i < len; i++) {
          MPromise.resolve(promiseList[i]).then(
            (value) => {
              resultArr[i] = value;
              promiseCount++;
              if (promiseCount === len) {
                resolve(resultArr);
              }
            },
            (reason) => {
              console.log('allallal', reason);
              reject(reason);
            }
          );
        }
      }
    });
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    switch (newStatus) {
      case FULFILLED:
        this.FULFILLED_CALLBACK_LIST.forEach((callback) => {
          callback(this.value);
        });
        break;
      case REJECTED:
        this.REJECTED_CALLBACK_LIST.forEach((callback) => {
          callback(this.reason);
        });
    }
  }

  resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = FULFILLED;
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason;
      this.status = REJECTED;
    }
  }

  isFunction(param) {
    return typeof param === 'function';
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => {
          return value;
        };

    const realOnRejected = this.isFunction(onRejected)
      ? onRejected
      : (reason) => {
          throw reason;
        };

    const promise2 = new MPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };
      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };
      switch (this.status) {
        case FULFILLED:
          fulfilledMicrotask();
          break;
        case REJECTED:
          rejectedMicrotask();
          break;
        case PENDING:
          this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask);
          this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask);
      }
    });
    return promise2;
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError('The promise and the return value are the same'));
    }

    if (x instanceof MPromise) {
      queueMicrotask(() => {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject);
        });
      });
    } else if (typeof x === 'object' || this.isFunction(x)) {
      if (x === null) {
        return resolve(x);
      }

      let then = null;
      try {
        then = x.then; // 规范需求，防止get then() { throw(new Error()) }的可能性
      } catch (e) {
        return reject(e);
      }

      if (this.isFunction(then)) {
        let called = false;
        try {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              this.resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } catch (e) {
          if (called) return;
          reject(e);
        }
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

// const test = new MPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('Success')
//   }, 1000)
// }).then(console.log)

// console.log(test)

// setTimeout(() => {
//   console.log(test)
// }, 2000)

let promise1 = new MPromise(function (resolve, reject) {
  console.log('1 success');
  reject('111');
});
let promise2 = new MPromise(function (resolve, reject) {
  setTimeout(() => {
    console.log('2 fail');
    reject('Fail');
  }, 1000);
});
let promise3 = new MPromise(function (resolve) {
  setTimeout(() => {
    console.log('3 success');
    resolve(3);
  }, 2000);
});

let promiseAll = MPromise.all([promise1, promise2, promise3]);
promiseAll
  .then(
    function (res) {
      console.log('success', res);
    },
    function (err) {
      console.log('someing happended', err);
    }
  )
  .catch((e) => {
    console.log('something happened again', e);
  });
```

## 补充知识点

### 相关面试题
```javascript
const test = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('success')
	}, 1000)
}).then(res => {
	console.log('then')
});

setTimeout(() => {
	console.log(test); // 请指出此处test.value的值
}, 3000)
```
答案为 undefined。test是then返回的Promise，而在then方法中并没有显式调用return 方法。所以默认return undefined. undefined即为最后test.value的值

```javascript
const test = new Promise((resolve, reject) => {
	setTimeout(() => {
		reject('Error')
	}, 1000)
}).catch(err => {
	console.log(`An error occured: ${error}`)
	console.log(test); // 此处的输出：catch 方法返回的 new Promise
});

setTimout(() => {
	console.log(test); // 此处的输出 最终catch返回的Promise
}, 3000)
```

第一个地方的输出为Promise<Pending>, 第二处的输出为Promise<Fulfilled>。此题需要搞懂里面包含几个Promise以及相应的地方都打印的是哪个Promise。回调函数中打印的Promise为运行状态时，then返回的新的Promise。此时由于then方法还没有返回，Promise还没有决议，所以结果为Pending。3秒后打印是因为catch方法也没有显示return 默认为return undefined. catch返回新的Promise是默认的Fulfilled状态。