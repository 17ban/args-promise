function __arr(val: any) {
    return val === undefined ? [] :
        (val instanceof Array) ? val : [val]
}

class APOpts {
    residents: any[]
    promise: Promise<any[]>
    constructor(promise: Promise<any[]> = new Promise<any[]>(() => {}), residents: any[] = []) {
        this.residents = residents
        this.promise = promise
    }
}

class ArgsPromise {
    _residents: any[]
    _promise: Promise<any[]>
    
    constructor(
        executor: ((
            resolve: (...args: any[]) => void,
            reject: (...args: any[]) => void,
            resident: (...residents: any[]) => void
        ) => any) | APOpts
    ) {
        if(executor instanceof APOpts) {
            this._residents = executor.residents
            this._promise = executor.promise
        } else if(executor instanceof Function){
            this._residents = []
            this._promise = new Promise((_resolve, _reject) => {
                let resident = (...residents: any[]) => {
                    this._residents = residents
                }
                let resolve = (...args: any[]) => {
                    _resolve(args)
                }
                let reject = (...args: any[]) => {
                    _reject(args)
                }
                executor(resolve, reject, resident)
            })
        } else {
            throw new Error('The constructor of ArgsPromise expects an executor function as argument.')
        }
    }

    then(
        onfulfilled?: (...args: any[]) => any,
        onrejected?: (...args: any[]) => any
    ) {
        let _onfulfilled = onfulfilled ? 
            (args: any[]) => __arr(onfulfilled(...args, ...this._residents)) : undefined
        
        let _onrejected = onrejected ? 
            (args: any[]) => __arr(onrejected(...args, ...this._residents)) : undefined
        
        return new ArgsPromise(new APOpts(
            this._promise.then(_onfulfilled, _onrejected),
            this._residents
        ))
    }

    catch(onrejected?: (...args: any[]) => any) {
        let _onrejected = onrejected ? 
            (args: any[]) => __arr(onrejected(...args, ...this._residents)) : undefined
        
        return new ArgsPromise(new APOpts(
            this._promise.catch(_onrejected),
            this._residents
        ))
    }

    finally(onfinally?: (...args: any[]) => any) {
        let _onfinally = onfinally ? 
            () => __arr(onfinally(...this._residents)) : undefined
        
        return new ArgsPromise(new APOpts(
            this._promise.finally(_onfinally),
            this._residents
        ))
    }

    pack() {
        return new ArgsPromise(r => {
            this._promise.then(args => {
                r([...args, ...this._residents])
            })
        })
    }

    to() {
        return new ArgsPromise(r => {
            this._promise.then(args => {
                r([null, [...args, ...this._residents]])
            }).catch(args => {
                r([[...args, ...this._residents], undefined])
            })
        })
    }
}

/* -- export -- */
export default ArgsPromise
export { ArgsPromise, APOpts }