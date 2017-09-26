"use strict";

let co = require("co");

// co 支持将生成器yield表达式类型为function，promise，generator，array，object 之一的包裹成promise。

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
