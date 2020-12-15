declare class APOpts {
    residents: any[];
    promise: Promise<any[]>;
    constructor(promise?: Promise<any[]>, residents?: any[]);
}
declare class ArgsPromise {
    _residents: any[];
    _promise: Promise<any[]>;
    constructor(executor: ((resolve: (...args: any[]) => void, reject: (...args: any[]) => void, resident: (...residents: any[]) => void) => any) | APOpts);
    then(onfulfilled?: (...args: any[]) => any, onrejected?: (...args: any[]) => any): ArgsPromise;
    catch(onrejected?: (...args: any[]) => any): ArgsPromise;
    finally(onfinally?: (...args: any[]) => any): ArgsPromise;
    pack(): ArgsPromise;
    to(): ArgsPromise;
}
export default ArgsPromise;
export { ArgsPromise, APOpts };
