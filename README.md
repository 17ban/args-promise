# Installation

#### npm

```
npm i -S args-promise
```

#### yarn

```
yarn add args-promise
```



#### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/args-promise@1.2.1"></script>
```

If you are using native ES Modules, there is also an ES Modules compatible build:

```html
<script type="module">
  import ArgsPromise from 'https://cdn.jsdelivr.net/npm/args-promise@1.2.1/dist/ArgsPromise.esm.min.js'
</script>
```





# Usage

**ArgsPromise** behaves like native Promise. 

```javascript
const ArgsPromise = require('args-promise').default

new ArgsPromise((resolve, reject) => {
    resolve('foo', 'bar')
}).then((a, b) => {
    console.log(a, b)  // 'foo' 'bar'
})

new ArgsPromise((resolve, reject) => {
    reject('foo', 'bar')
}).then((a, b) => {
    console.log(a, b)  // no output
}).catch((a, b) => {
    console.log('catched', a, b)  // 'catched' 'foo' 'bar'
})
```

If you want to pass multiple arguments to next `then()`, you can return an Array like this:

```javascript
new ArgsPromise(resolve => {
    resolve()
}).then(() => {
    return ['foo', 'bar']
}).then((a, b) => {
    console.log(a, b)  // 'foo' 'bar'
})
```





`Promise.allSettled()` and `await` also works with **ArgsPromise**.

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

Because of the implementation of native Promise, you can only get the first argument by using `Promise.allSettled()` and `await` like this:

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

To get all the arguments, you can use `pack()`.

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





The callback function of **ArgsPromise**'s constructor receives the third argument. It is a function that allows you to set some **resident variables**. In the same promise chain, resident variables will always be passed into the callback function of `then()`, `catch()` and `finally()`.

```javascript
new ArgsPromise((resolve, reject, resident) => {
    resident('resident-0', 'resident-1')
    resolve(1, 2, 'hello')
}).then((...args) => {
    console.log(...args)    // 1 2 'hello' 'resident-0' 'resident-1'
    return ['foo', 'bar']
}).then((...args) => {
    console.log(...args)    // 'foo' 'bar' 'resident-0' 'resident-1'
    return 123
}).then((...args) => {
    console.log(...args)    // 123 'resident-0' 'resident-1'
}).then((...args) => {
    console.log(...args)    // 'resident-0' 'resident-1'
})
```
