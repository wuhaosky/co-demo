"use strict";

let co = require("co");

// co 支持将生成器yield表达式类型为function，promise，generator，array，object 之一的包裹成promise。

if (false) {
    // co 是一个promise
    // yield 后面表达式是promise
    co(function*() {
        var result = yield Promise.resolve(true);
        return result;
    }).then(
        function(value) {
            console.log(value);
        },
        function(err) {
            console.error(err.stack);
        }
    );

    // co.wrap 是一个函数，这个函数可以接受参数，这个函数的返回值是一个promise
    var fn = co.wrap(function*(val) {
        return yield Promise.resolve(val);
    });
    // 把generator里return的值传给promise的then回调里。    
    fn(true).then(function(val) {
        console.log(val);
    });

    // yield 后面表达式是Array
    co(function*() {
        // resolve multiple promises in parallel
        var a = Promise.resolve(1);
        var b = Promise.resolve(2);
        var c = Promise.resolve(3);
        var res = yield [a, b, c];
        console.log(res);
        // => [1, 2, 3]
    }).catch(onerror);

    // errors can be try/catched
    co(function*() {
        try {
            yield Promise.reject(new Error("boom"));
        } catch (err) {
            console.error(err.message); // "boom"
        }
    }).catch(onerror);

    function onerror(err) {
        // log any uncaught errors
        // co will not throw any errors you do not handle!!!
        // HANDLE ALL YOUR ERRORS!!!
        console.error(err.stack);
    }

    // yield 后面表达式是Objects
    co(function*() {
        var res = yield {
            1: Promise.resolve(1),
            2: Promise.resolve(2)
        };
        console.log(res); // => { 1: 1, 2: 2 }
    }).catch(onerror);


    // yield 后面表达式是function
    co(function*() {
        function test(cb){
            let val = 333 + 333;
            cb(null, val)
        }
        var res = yield test;
        console.log(res); // => 666
    }).catch(onerror);
}

// co包裹的generator里，有表达式是generator的情况
// 如果yield后面是一个generator，则前面既可以使用yield，也可以使用yield*。并且，这个generator里yield后面的表达式，必须是函数、promise、生成器、遍历器对象、数组、对象之一。
// 如果使用yield，则后面既可以是生成器函数，也可以是遍历器对象，在toPromise的环节，co会递归处理这个generator；
// 如果使用yield*，则后面跟着的只能是遍历器对象，co会把这个generator里的yield展开，拉平处理。

// 以下面的代码为例：co里面有一个generator g2
// 如果使用yield，则后面既可以是生成器函数g2，也可以是遍历器对象g2()，在toPromise的环节，co会递归处理g2；
// 如果使用yield*，则后面跟着的只能是遍历器对象g2，co会把g2里的yield展开，与当前co里的yield一起平行处理。
if (false) {
    function* g2() {
        var a = yield Promise.resolve("g2-1");
        console.log(a);
        var b = yield Promise.resolve("g2-2");
        console.log(b);
        var c = yield Promise.resolve("g2-3");
        console.log(c);
    };
    
    // 表达式是generator，前面使用yield
    co(function*() {
        // resolve multiple promises in parallel
        yield g2();
        var a = yield Promise.resolve(1);
        console.log(a);
        var b = yield Promise.resolve(a+1);
        console.log(b);
        var c = yield Promise.resolve(b+1);
        console.log(c);
    }).catch(onerror);
    
    function onerror(err) {
        // log any uncaught errors
        // co will not throw any errors you do not handle!!!
        // HANDLE ALL YOUR ERRORS!!!
        console.error(err.stack);
    }

    // 表达式是generator，前面使用yield*
    co(function*() {
        // resolve multiple promises in parallel
        yield* g2();
        var a = yield Promise.resolve(1);
        console.log(a);
        var b = yield Promise.resolve(a+1);
        console.log(b);
        var c = yield Promise.resolve(b+1);
        console.log(c);
    }).catch(onerror);
}

