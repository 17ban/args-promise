function _arrify(val) {
    return val === undefined ? [] :
        (val instanceof Array) ? val : [val];
}
class ArgsPromiseInitOpts {
    constructor(promise = new Promise(() => { }), residents = []) {
        this.residents = residents;
        this.promise = promise;
    }
}
class ArgsPromise {
    constructor(executor) {
        if (executor instanceof ArgsPromiseInitOpts) {
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
                    _resolve(args);
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
            (args) => _arrify(onfulfilled(...args, ...this._residents)) : undefined;
        let _onrejected = onrejected ?
            (args) => _arrify(onrejected(...args, ...this._residents)) : undefined;
        return new ArgsPromise(new ArgsPromiseInitOpts(this._promise.then(_onfulfilled, _onrejected), this._residents));
    }
    catch(onrejected) {
        let _onrejected = onrejected ?
            (args) => _arrify(onrejected(...args, ...this._residents)) : undefined;
        return new ArgsPromise(new ArgsPromiseInitOpts(this._promise.catch(_onrejected), this._residents));
    }
    finally(onfinally) {
        let _onfinally = onfinally ?
            () => _arrify(onfinally(...this._residents)) : undefined;
        return new ArgsPromise(new ArgsPromiseInitOpts(this._promise.finally(_onfinally), this._residents));
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
export default ArgsPromise;
export { ArgsPromise, ArgsPromiseInitOpts };
