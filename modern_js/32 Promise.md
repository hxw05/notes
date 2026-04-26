# 32 Promise

## new Promise

使用new Promise来创建一个promise： `new Promise(executor)`

- executor是一个函数，这个函数可以接收两种回调函数resolve和reject（由JS提供，顺序固定）。promise实例创建的同时，executor会被执行。
    - resolve和reject只能调用至多一次（后续调用无效）
    - resolve和reject至多有一个参数
- 构造函数返回一个promise实例，包含下列（内部）属性
    - **state** - promise的状态（字符串），初始pending，resolve后是fulfilled，reject后是rejected。fulfilled和rejected统称为“已处理”（settled）状态。
    - **result** - promise的结果，初始undefined，最终要么是resolve(value)中的value，要么是reject(error)中的error

## then, catch

then和catch用于注册promise的消费者函数。

- then(onsuccess, onerror)可以接受至多两个参数，第一个参数是fulfill时的回调函数，传入一个参数value；第二个参数是reject时的回调函数，传入一个参数error。
- catch(onerror)的效果相当于then(null, onerror)，表示当传递到这个位置时，只对其中的错误值进行处理，如果非错误值则透传。

then和catch都会返回一个新的promise，关于其链式调用，见 [33 链式Promise](33%20%E9%93%BE%E5%BC%8FPromise%20315b76c581cf80ba8da9fe3b870e4e65.md) 。

## finally

finally用于注册一个普通的函数，可以用于清理用途。

finally注册的函数不会对promise的结果进行消费，也不会产生任何结果。如果该函数抛出了异常，那么该异常会传递到最近的catch或者then。

```jsx
new Promise(r => r()).finally(() => a.x = 1).then(null, e => console.log(e.name))
// ReferenceError
```

:::tip
当then/catch/finally附加到settled promise上时，会立即执行。
:::
