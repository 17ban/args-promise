var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
function __isPromise(obj) {
    return obj instanceof Promise ? true :
        obj instanceof ArgsPromise;
}
function __handle(val) {
    var arr = val === undefined ? [] :
        (val instanceof Array) ? val : [val];
    if (!(arr.length === 1 && __isPromise(arr[0]))) {
        return arr;
    }
    return new Promise(function (r, rj) {
        arr[0].then(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            r(args);
        }, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            rj(args);
        });
    });
}
var APOpts = (function () {
    function APOpts(promise, residents) {
        if (promise === void 0) { promise = new Promise(function () { }); }
        if (residents === void 0) { residents = []; }
        this.residents = residents;
        this.promise = promise;
    }
    return APOpts;
}());
var ArgsPromise = (function () {
    function ArgsPromise(executor) {
        var _this = this;
        this[Symbol.toStringTag] = 'ArgsPromise';
        if (executor instanceof APOpts) {
            this._residents = executor.residents;
            this._promise = executor.promise;
        }
        else if (executor instanceof Function) {
            this._residents = [];
            this._promise = new Promise(function (_resolve, _reject) {
                var resident = function () {
                    var residents = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        residents[_i] = arguments[_i];
                    }
                    _this._residents = residents;
                };
                var resolve = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    _resolve(__handle(args));
                };
                var reject = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    _reject(args);
                };
                executor(resolve, reject, resident);
            });
        }
        else {
            throw new Error('The constructor of ArgsPromise expects an executor function as argument.');
        }
    }
    ArgsPromise.prototype.then = function (onfulfilled, onrejected) {
        var _this = this;
        var _onfulfilled = onfulfilled ?
            function (args) { return __handle(onfulfilled.apply(void 0, __spreadArrays(args, _this._residents))); } : undefined;
        var _onrejected = onrejected ?
            function (args) { return __handle(onrejected.apply(void 0, __spreadArrays(args, _this._residents))); } : undefined;
        return new ArgsPromise(new APOpts(this._promise.then(_onfulfilled, _onrejected), this._residents));
    };
    ArgsPromise.prototype.catch = function (onrejected) {
        var _this = this;
        var _onrejected = onrejected ?
            function (args) { return __handle(onrejected.apply(void 0, __spreadArrays(args, _this._residents))); } : undefined;
        return new ArgsPromise(new APOpts(this._promise.catch(_onrejected), this._residents));
    };
    ArgsPromise.prototype.finally = function (onfinally) {
        var _this = this;
        var _onfinally = onfinally ?
            function () { return __handle(onfinally.apply(void 0, _this._residents)); } : undefined;
        return new ArgsPromise(new APOpts(this._promise.finally(_onfinally), this._residents));
    };
    ArgsPromise.prototype.pack = function () {
        var _this = this;
        return new ArgsPromise(function (r) {
            _this._promise.then(function (args) {
                r(__spreadArrays(args, _this._residents));
            });
        });
    };
    ArgsPromise.prototype.to = function () {
        var _this = this;
        return new ArgsPromise(function (r) {
            _this._promise.then(function (args) {
                r([null, __spreadArrays(args, _this._residents)]);
            }).catch(function (args) {
                r([__spreadArrays(args, _this._residents), undefined]);
            });
        });
    };
    return ArgsPromise;
}());
