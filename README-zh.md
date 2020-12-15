# 安装

#### npm

```bash
npm i -S args-promise
```

#### yarn

```bash
yarn add args-promise
```



#### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/args-promise@1.2.1"></script>
```

或者你可以像这样引入 ES Modules 版本的 **ArgsPromise** ：

```html
<script type="module">
  import ArgsPromise from 'https://cdn.jsdelivr.net/npm/args-promise@1.2.2/dist/ArgsPromise.esm.min.js'
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
    console.log(a, b)  // 没被执行
}).catch((a, b) => {
    console.log('catched', a, b)  // --> 'catched' 'foo' 'bar'
})
```



如果你想要传递多个参数给下一个 `then()` 的处理函数 ，你可以像这样返回一个数组（**Array**）：

```javascript
new ArgsPromise(resolve => {
    resolve()
}).then(() => {
    return ['foo', 'bar']
}).then((a, b) => {
    console.log(a, b)  // --> 'foo' 'bar'
})
```



`await` 以及像 `Promise.allSettled()` 这类适用于 **Promise** 的方法也同样适用于 **ArgsPromise**。

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
        console.log('allSettled')  // 3s后打印了'allSettled'
    })
```

```javascript
async function foo() {
    await new ArgsPromise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 3000)
    })
    console.log('bar')
}
foo()  // 3s后打印了'allSettled'
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
let [err1, values1] = await p1.to()
if(err1) {
	console.log(err1)
} else {
	console.log(values1)  // --> [ 'hello', 'world' ]
}


let p2 = new ArgsPromise((resolve, reject) => {
	reject('err')
})
let [err2, values2] = await p2.to()
if(err2) {
	console.log(err2)  // --> [ 'err' ]
} else {
	console.log(values2)
}
```



构造 **ArgsPromise** 时所传入的执行函数可以接收第三个参数。这个参数是一个函数，让你可以设置一些**常驻变量**。在同一条 “Promise链” 中，**常驻变量**总会被传入 `.then()`, `.catch()` 和 `.finally()` 的处理函数中。

下面是一个设置与接收**常驻变量**的例子：

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

