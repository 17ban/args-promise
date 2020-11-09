const process = require('child_process')
async function exec(command) {
    return new Promise(r => {
        process.exec(command, function(error, stdout, stderr) {
            if(error) console.log("error:" + error)
            if(stdout) console.log("stdout:" + stdout)
            if(stderr) console.log("stderr:" + stderr)
            r()
        })
    })
}


/**
 * build command
 */
let cjs = [
    'tsc -t ES6 -m commonjs -d --lib es2019 --strict --outDir ./dist ./src/ArgsPromise.ts',
    '&& cd ./dist',
    '&& rename ArgsPromise.js ArgsPromise.cjs.js',
    '&& terser ArgsPromise.cjs.js -o ArgsPromise.cjs.min.js -c -m'
].join(' ')

let esm = [
    'tsc -t ES6 -m ES6 --lib es2019 --strict --outDir ./dist ./src/ArgsPromise.ts',
    '&& cd ./dist',
    '&& rename ArgsPromise.js ArgsPromise.esm.js',
    '&& terser ArgsPromise.esm.js -o ArgsPromise.esm.min.js -c -m'
].join(' ')

let browser = [
    'tsc -t ES5 --outDir ./dist --lib es2019 ./src/ArgsPromise.browser.ts',
    '&& terser ./dist/ArgsPromise.browser.js -o ./dist/ArgsPromise.browser.min.js -c -m'
].join(' ');


/**
 * build
 */
(async () => {
    exec(browser)
    await exec(cjs)
    await exec(esm)
})()