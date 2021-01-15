const fse = require('fs-extra')
const execa = require('execa')

async function exec(file, args) {
    try {
        const { stdout } = await execa(file, args)
        console.log(stdout)
    } catch(err) {
        console.log(err)
    }
}



async function buildCjs() {
    await exec('tsc', [
        '-t', 'ES6',
        '-m', 'commonjs',
        '--lib', 'es2019',
        '--outDir', './dist',
        '--strict',
        '--removeComments',
        '-d',
        './src/ArgsPromise.ts'
    ])
    await fse.rename('./dist/ArgsPromise.js', './dist/ArgsPromise.cjs.js')
}

async function buildEsm() {
    await fse.copy('./src/ArgsPromise.ts', './src/ArgsPromise.esm.ts')
    await exec('tsc', [
        '-t', 'ES6',
        '-m', 'ES6',
        '--lib', 'es2019',
        '--outDir', './dist',
        '--strict',
        '--removeComments',
        '--moduleResolution', 'node',
        './src/ArgsPromise.esm.ts'
    ])
    await fse.remove('./src/ArgsPromise.esm.ts')
}

async function buildBrowser() {
    let src = await fse.readFile('./src/ArgsPromise.ts', { encoding: 'utf-8'})
    await fse.writeFile('./src/ArgsPromise.browser.ts', src.split('/* -- export -- */')[0])
    await exec('tsc', [
        '-t', 'ES5',
        '--lib', 'es2019',
        '--outDir', './dist',
        '--removeComments',
        './src/ArgsPromise.browser.ts'
    ])
    await fse.remove('./src/ArgsPromise.browser.ts')
}


/**
 * build
 */
(async function () {
    fse.removeSync('./dist')
    buildCjs()
    buildEsm()
    buildBrowser()
})()