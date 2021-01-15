"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APOpts = exports.ArgsPromise = void 0;
function __isPromise(obj) {
    return obj instanceof Promise ? true :
        obj instanceof ArgsPromise;
}
function __handle(val) {
    let arr = val === undefined ? [] :
        (val instanceof Array) ? val : [val];
    if (!(arr.length === 1 && __isPromise(arr[0]))) {
        return arr;
    }
    return new Promise((r, rj) => {
        arr[0].then((...args) => {
            r(args);
        }, (...args) => {
            rj(args);
        });
    });
}
class APOpts {
    constructor(promise = new Promise(() => { }), residents = []) {
        this.residents = residents;
        this.promise = promise;
    }
}
exports.APOpts = APOpts;
class ArgsPromise {
    constructor(executor) {
        this[Symbol.toStringTag] = 'ArgsPromise';
        if (executor instanceof APOpts) {
            this._residents = executor.residents;
            this._promise = executor.promise;
        }
        else if (executor instanceof Function) {
            this._residents = [];
            this._promise = new Promise((_resolve, _reject) => {
                let resident = (...residents) => {
                    this._residents = residents;
                };
                let resolve = (...args) => {
                    _resolve(__handle(args));
                };
                let reject = (...args) => {
                    _reject(args);
                };
                executor(resolve, reject, resident);
            });
        }
        else {
            throw new Error('The constructor of ArgsPromise expects an executor function as argument.');
        }
    }
    then(onfulfilled, onrejected) {
        let _onfulfilled = onfulfilled ?
            (args) => __handle(onfulfilled(...args, ...this._residents)) : undefined;
        let _onrejected = onrejected ?
            (args) => __handle(onrejected(...args, ...this._residents)) : undefined;
        return new ArgsPromise(new APOpts(this._promise.then(_onfulfilled, _onrejected), this._residents));
    }
    catch(onrejected) {
        let _onrejected = onrejected ?
            (args) => __handle(onrejected(...args, ...this._residents)) : undefined;
        return new ArgsPromise(new APOpts(this._promise.catch(_onrejected), this._residents));
    }
    finally(onfinally) {
        let _onfinally = onfinally ?
            () => __handle(onfinally(...this._residents)) : undefined;
        return new ArgsPromise(new APOpts(this._promise.finally(_onfinally), this._residents));
    }
    pack() {
        return new ArgsPromise(r => {
            this._promise.then(args => {
                r([...args, ...this._residents]);
            });
        });
    }
    to() {
        return new ArgsPromise(r => {
            this._promise.then(args => {
                r([null, [...args, ...this._residents]]);
            }).catch(args => {
                r([[...args, ...this._residents], undefined]);
            });
        });
    }
}
exports.ArgsPromise = ArgsPromise;
exports.default = ArgsPromise;
