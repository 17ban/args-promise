const ArgsPromise = require('../../ArgsPromise').default

// async function test() {
//     let args = await new ArgsPromise(resolve => {
//         resolve(1, 2, 3, 4, 5)
//     }).pack()
//     console.log(args)  // --> [ 1, 2, 3, 4, 5 ]

//     let p = new ArgsPromise(resolve => {
//         resolve(1, 2, 3, 4, 5)
//     }).pack()  
//     Promise.allSettled([p]).then(result => {
//         console.log(result[0].value)  // --> [ 1, 2, 3, 4, 5 ]
//     })
// }
// test()

// new ArgsPromise((resolve, reject, resident) => {
//     setTimeout(() => {
//         resolve(1, 2, 'hello')
//     }, 1000)
//     resident('resident-0', 'resident-1')
// }).then((...args) => {
//     console.log(...args)    // 1 2 'hello' 'resident-0' 'resident-1'
//     return ['foo', 'bar']
// }).then((...args) => {
//     console.log(...args)    // 'foo' 'bar' 'resident-0' 'resident-1'
//     return 123
// }).catch((...args) => {
//     console.log(...args)    // 123 'resident-0' 'resident-1'
// }).then((...args) => {
//     console.log(...args)    //'resident-0' 'resident-1'
// })

// new ArgsPromise((resolve, reject) => {
//     resolve('foo', 'bar')
// }).then((a, b) => {
//     console.log(a, b)  // 'foo' 'bar'
// })

// new ArgsPromise((resolve, reject) => {
//     reject('foo', 'bar')
// }).then((a, b) => {
//     console.log(a, b)  // no output
// }).catch((a, b) => {
//     console.log('catched', a, b)  // 'catched' 'foo' 'bar'
// })

// let p1 = new ArgsPromise(resolve => {
//     setTimeout(() => {
//         resolve()
//     }, 1000)
// })
// let p2 = new ArgsPromise(resolve => {
//     setTimeout(() => {
//         resolve()
//     }, 3000)
// })
// Promise.allSettled([p1, p2])
//     .then(() => {
//         console.log('allSettled')
//     })

// async function foo() {
//     await new ArgsPromise((resolve) => {
//         setTimeout(() => {
//             resolve()
//         }, 3000)
//     })
//     console.log('bar')
// }
// foo()



async function t() {
    let p1 = new ArgsPromise((resolve, reject) => {
        resolve('hello', 'world')
    })
    console.log(await p1.to())  // --> [ null, [ 'hello', 'world' ] ]

    let p2 = new ArgsPromise((resolve, reject) => {
        reject('err')
    })
    console.log(await p2.to())  // --> [ [ 'err' ], undefined ]
}
t()