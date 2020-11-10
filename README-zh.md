# 安装

#### npm

```
npm i -S args-promise
```

#### yarn

```
yarn add args-promise
```



#### 从CDN引入

```html
<script src="https://cdn.jsdelivr.net/npm/args-promise@1.2.1"></script>
```

如果你希望以 module 的形式引入 **ArgsPromise** ，你可以像这样引入：

```html
<script type="module">
  import ArgsPromise from 'https://cdn.jsdelivr.net/npm/args-promise@1.2.1/dist/ArgsPromise.esm.min.js'
</script>
```





# 用法

**ArgsPromise** 的用法与原生 **Promise** 类似。 

```javascript
const ArgsPromise = require('args-promise').default

new ArgsPromise((resolve, reject) => {
    resolve('foo', 'bar')
}).then((a, b) => {
    console.log(a, b)  // --> 'foo' 'bar'
})

new ArgsPromise((resolve, reject) => {
    reject('foo', 'bar')
}).then((a, b) => {
    console.log(a, b)  // no output
}).catch((a, b) => {
    console.log('catched', a, b)  // --> 'catched' 'foo' 'bar'
})
```



如果你想要传递多个参数给 `next()` 的回调函数 ，你可以像这样返回一个数组：

```javascript
new ArgsPromise(resolve => {
    resolve()
}).then(() => {
    return ['foo', 'bar']
}).then((a, b) => {
    console.log(a, b)  // --> 'foo' 'bar'
})
```



`await` 与 `Promise.allSettled()` 同样对 **ArgsPromise** 有效。

```javascript
let p1 = new ArgsPromise(resolve => {
    setTimeout(() => {
        resolve()
    }, 1000)
})
let p2 = new ArgsPromise(resolve => {
    setTimeout(() => {
        resolve()
    }, 3000)
})
Promise.allSettled([p1, p2])
    .then(() => {
        console.log('allSettled')  // print 'allSettled' after 3s
    })
```

```javascript
async function foo() {
    await new ArgsPromise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 3000)
    })
    console.log('bar')  // print 'bar' after 3s
}
foo()
```

但是存在一个问题，直接使用 `await`  和 `Promise.allSettled()` 只能取得 **ArgsPromise** 所 resolve 的第一个参数：

```javascript
let p = new ArgsPromise(resolve => {
  resolve(1, 2, 3, 4, 5)
})
Promise.allSettled([p]).then(result => {
  console.log(result[0].value)  // --> 1
})

let args = await new ArgsPromise(resolve => {
  resolve(1, 2, 3, 4, 5)
})
console.log(args)  // --> 1
```

你可以使用 `.pack()` 来取得 **ArgsPormise** 所 resolve 的所有参数：

```javascript
let p = new ArgsPromise(resolve => {
  resolve(1, 2, 3, 4, 5)
}).pack()
Promise.allSettled([p]).then(result => {
  console.log(result[0].value)  // --> [ 1, 2, 3, 4, 5 ]
})

let args = await new ArgsPromise(resolve => {
	resolve(1, 2, 3, 4, 5)
}).pack()
console.log(args)  // --> [ 1, 2, 3, 4, 5 ]
```



参考了 [await-to-js](https://www.npmjs.com/package/await-to-js) ，**ArgsPromise** 提供了 `.to()` 方法来帮助你处理简单的错误：

```javascript
let p1 = new ArgsPromise((resolve, reject) => {
	resolve('hello', 'world')
})
console.log(await p1.to())  // --> [ null, [ 'hello', 'world' ] ]

let p2 = new ArgsPromise((resolve, reject) => {
	reject('err')
})
console.log(await p2.to())  // --> [ [ 'err' ], undefined ]
```



在构造 **ArgsPromise** 时传入的函数可以接收第三个参数。这个参数是一个函数，让你可以设置一些**常驻变量**。在同一条“Promise链”中，**常驻变量**总会被传入 `then()`, `catch()` 和 `finally()` 的回调函数中。下面是一个设置与接收**常驻变量**的例子：

```javascript
new ArgsPromise((resolve, reject, resident) => {
    resident('resident-0', 'resident-1')
    resolve(1, 2, 'hello')
}).then((...args) => {
    console.log(...args)    // --> 1 2 'hello' 'resident-0' 'resident-1'
    return ['foo', 'bar']
}).then((...args) => {
    console.log(...args)    // --> 'foo' 'bar' 'resident-0' 'resident-1'
    return 123
}).then((...args) => {
    console.log(...args)    // --> 123 'resident-0' 'resident-1'
}).then((...args) => {
    console.log(...args)    // --> 'resident-0' 'resident-1'
})
```

