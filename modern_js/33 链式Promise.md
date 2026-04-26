# 33 链式Promise

## 附加vs链式

一个promise对象的then方法用于向这个promise附加回调函数，并且会返回一个新的promise。

- 忽略这个新的promise，仅作为附加消费者的方式：
    
    ```jsx
    fetch('https://google.com').then(r => console.log(r));
    
    // or
    
    const promise = fetch('https://google.com');
    promise.then(consumer1);
    promise.then(consumer2);
    promise.then(consumer3);
    // 这样promise上面就同时有三个消费者consumer1/2/3
    ```
    
- 链式调用（解决了回调地狱）
    
    ```jsx
    loadScript('a.js') // 返回一个Promise
    .then(() => loadScript('b.js')) // 返回一个Promise
    .then(() => loadScript('c.js')) // 返回一个Promise
    .then(() => loadScript('d.js')) // 返回一个Promise（被忽略）
    ```
    

## then方法的返回值

链式调用的实现主要基于then函数总是返回一个新promise。

- 如果是一般的返回值，那么包装成一个resolved promise，这样下一个then会立即执行。
- 如果是一个Promise，那么不会包装，下一个then就在这个返回的Promise上调用。
同样适用于Thenable对象（带有then方法的对象，Promise-like）
- 如果没有返回值，那么返回一个resolved promise，其result是undefined。
- 如果消费者回调中出现错误或者抛出错误，那么返回一个rejected promise。

:::tip `promise.then(f1).catch(f2)` 和 `promise.then(f1, f2) `的效果一样吗？
否，但是对于promise来说效果是一样的。区别在于前者当f1中发生错误时，它会返回一个rejected promise，从而f2也会执行。后者当f1发生错误时，由于f2和f1是选择关系，只会导致then返回一个unhandled rejected promise。
:::
