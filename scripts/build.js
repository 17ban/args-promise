let process = require('child_process')

let cjs = [
    'tsc -t ES6 -m commonjs -d --lib es2019 --strict --outDir ./dist ./src/ArgsPromise.ts',
    '&& terser ./dist/ArgsPromise.js -o ./dist/ArgsPromise.min.js -c -m'
]
process.exec(cjs.join(' '), function(error, stdout, stderr) {
    if(error) console.log("error:" + error)
    if(stdout) console.log("stdout:" + stdout)
    if(stderr) console.log("stderr:" + stderr)
})


let esm = [
    'tsc -t ES6 -m ES6 --lib es2019 --strict --outDir ./dist ./src/ArgsPromise.esm.ts',
    '&& terser ./dist/ArgsPromise.esm.js -o ./dist/ArgsPromise.esm.min.js -c -m'
]
process.exec(esm.join(' '), function(error, stdout, stderr) {
    if(error) console.log("error:" + error)
    if(stdout) console.log("stdout:" + stdout)
    if(stderr) console.log("stderr:" + stderr)
})

let browser = [
    'tsc -t ES5 --outDir ./dist --lib es2019 ./src/ArgsPromise.browser.ts',
    '&& terser ./dist/ArgsPromise.browser.js -o ./dist/ArgsPromise.browser.min.js -c -m'
]
process.exec(browser.join(' '), function(error, stdout, stderr) {
    if(error) console.log("error:" + error)
    if(stdout) console.log("stdout:" + stdout)
    if(stderr) console.log("stderr:" + stderr)
})