### [中文README](./README-zh.md)



# Installation

#### npm

```shell
npm i -S args-promise
```

#### yarn

```shell
yarn add args-promise
```



#### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/args-promise@1.2.1"></script>
```

Or you can import the ES Modules compatible build like this:

```html
<script type="module">
  import ArgsPromise from 'https://cdn.jsdelivr.net/npm/args-promise@1.2.1/dist/ArgsPromise.esm.min.js'
</script>
```





# Usage

**ArgsPromise** behaves like native **Promise**. 

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
    console.log(a, b)  // not executed
}).catch((a, b) => {
    console.log('catched', a, b)  // --> 'catched' 'foo' 'bar'
})
```



If you want to pass multiple arguments to the handle function of next `then()`, you can return an **Array** like this:

```javascript
new ArgsPromise(resolve => {
    resolve()
}).then(() => {
    return ['foo', 'bar']
}).then((a, b) => {
    console.log(a, b)  // --> 'foo' 'bar'
})
```





`await` and the methods of **Promise** (such as `Promise.allSettled()`) is also effective for **ArgsPromise**.

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
    console.log('bar')
}
foo()  // print 'bar' after 3s
```

But there is a problem that you can only get the first argument by using `Promise.allSettled()` and `await` directly like this:

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

To get all the arguments, you can use `.pack()` like this:

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



Referring to [await-to-js](https://www.npmjs.com/package/await-to-js) ，**ArgsPormise** provides `.to()` to help you to handle simple errors like this:

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



The executor function  which passed into **ArgsPromise**'s constructor receives the third parameter. It is a function that allows you to set some **resident variables**. In the same Promise Chain, **resident variables** will always be passed into the handle function of `.then()`, `.catch()` and `.finally()`.

There is example of setting and receiving **resident variables**:

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
