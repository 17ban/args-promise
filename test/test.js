const ArgsPromise = require('../../ArgsPromise').default

test('resolve and resident', () => {
    new ArgsPromise((r, rj, rd) => {
        rd('rd1', 'rd2')
        r('foo', 'bar')
    }).then((...args) => {
        expect(args).toEqual(['foo', 'bar', 'rd1', 'rd2'])
    }).then((...args) => {
        expect(args).toEqual(['rd1', 'rd2'])
    })
})

test('reject', () => {
    let a = 0
    new ArgsPromise((r, rj) => {
        rj('foo', 'bar')
    }).then(() => {
        a++
    }).then(() => {
        a++
    }).catch((...args) => {
        expect(args).toEqual(['foo', 'bar'])
        expect(a).toBe(0)
    })
})

test('then', () => {
    new ArgsPromise(r => {
        r()
    }).then(() => {
        return 123
    }).then(arg => {
        expect(arg).toBe(123)
        return ['foo', 'bar', null, 22]
    }).then((...args) => {
        expect(args).toEqual(['foo', 'bar', null, 22])
    })
})

test('finally', async () => {
    let a = 0
    await new ArgsPromise(r => {
        r()
    }).finally(() => {
        a++
    })

    await new ArgsPromise((r, rj) => {
        rj()
    })
    .catch(() => {})
    .finally(() => {
        a++
    })
    
    expect(a).toBe(2)
})

test('pack', async () => {
    let args = await new ArgsPromise(r => {
        r('a', 'b', 123)
    }).pack()
    expect(args).toEqual(['a', 'b', 123])
})

test('to', async () => {
    let args = await new ArgsPromise(r => {
        r('a', 'b', 123)
    }).to()
    expect(args).toEqual([null, ['a', 'b', 123]])

    args = await new ArgsPromise((r, rj) => {
        rj('reason', 123)
    }).to()
    expect(args).toEqual([['reason', 123], undefined])
})

test('resolve a Promise', async () => {
    await new ArgsPromise(r => {
        r(new ArgsPromise(_r => {
            setTimeout(() => {
                _r('foo1', 'bar1')
            }, 1)
        }))
    }).then((...args) => {
        expect(args).toEqual(['foo1', 'bar1'])
        return new Promise(_r => {
            setTimeout(() => {
                _r('foo2')
            }, 1)
        })
    }).then(args => {
        expect(args).toBe('foo2')
        return new ArgsPromise((_r, _rj) => {
            setTimeout(() => {
                _rj('foo3', 'bar3')
            }, 1)
        })
    }).catch((...args) => {
        expect(args).toEqual(['foo3', 'bar3'])
    })
})