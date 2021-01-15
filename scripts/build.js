const process = require('child_process')
const fs = require('fs')

async function exec(command) {
    return new Promise(r => {
        process.exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
            // if(stdout) console.log("stdout:" + stdout)
            if(error) console.log("error:" + error)
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
    '&& tsc -t ES6 -m commonjs -d --lib es2019 --strict --outDir ./dist --removeComments ./src/ArgsPromise.ts',
    '&& cd ./dist',
    '&& ren ArgsPromise.js ArgsPromise.cjs.js'
].join(' ')

let esm = [
    'chcp 65001',
    '&& tsc -t ES6 -m ES6 --lib es2019 --strict --outDir ./dist --removeComments ./src/ArgsPromise.ts',
    '&& cd ./dist',
    '&& ren ArgsPromise.js ArgsPromise.esm.js'
].join(' ')

let browser = [
    'chcp 65001',
    '&& tsc -t ES5 --outDir ./dist --lib es2019 --removeComments ./src/ArgsPromise.browser.ts',
    '&& del /q src\\ArgsPromise.browser.ts'
].join(' ')


/**
 * build
 */
async function build() {
    await exec(delDist)

    const src = fs.readFileSync('./src/ArgsPromise.ts', { encoding: 'utf-8'})
    fs.writeFileSync('./src/ArgsPromise.browser.ts', src.split('/* -- export -- */')[0])
    exec(browser)

    await exec(cjs)
    await exec(esm)
}
build()