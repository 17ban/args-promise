const process = require('child_process')
async function exec(command) {
    return new Promise(r => {
        process.exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
            if(error) console.log("error:" + error)
            // if(stdout) console.log("stdout:" + stdout)
            if(stderr) console.log("stderr:" + stderr)
            r()
        })
    })
}


/**
 * build command
 */
let delDist = [
    'del /q dist\\*'
].join(' ')

let cjs = [
    'chcp 65001',
    '&& tsc -t ES6 -m commonjs -d --lib es2019 --strict --outDir ./dist ./src/ArgsPromise.ts',
    '&& cd ./dist',
    '&& ren ArgsPromise.js ArgsPromise.cjs.js',
    '&& terser ArgsPromise.cjs.js -o ArgsPromise.cjs.min.js -c -m'
].join(' ')

let esm = [
    'chcp 65001',
    '&& tsc -t ES6 -m ES6 --lib es2019 --strict --outDir ./dist ./src/ArgsPromise.ts',
    '&& cd ./dist',
    '&& ren ArgsPromise.js ArgsPromise.esm.js',
    '&& terser ArgsPromise.esm.js -o ArgsPromise.esm.min.js -c -m'
].join(' ')

let browser = [
    'chcp 65001',
    '&& tsc -t ES5 --outDir ./dist --lib es2019 ./src/ArgsPromise.browser.ts',
    '&& terser ./dist/ArgsPromise.browser.js -o ./dist/ArgsPromise.browser.min.js -c -m'
].join(' ');


/**
 * build
 */
(async () => {
    await exec(delDist)
    exec(browser)
    await exec(cjs)
    await exec(esm)
})()