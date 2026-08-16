# 35 Promise API

## Promise.all

并行执行一组promise，返回一个promise P

- 当这组Promise全部fulfill，fulfill P
- 当这组Promise中的某一个reject，reject P

---

无论最后P是fulfilled还是rejected，这一组promise中的每个executor均会运行直到结束，Promise.all不会取消那些被忽略掉的promise。其它静态方法同理。

输入的这一组promise中也可以包含正常值，它们在处理中相当于是Promise.resolve(x)。

## Promise.allSettled

并行执行一组promise，返回一个promise P，当这组promise全部settle，fulfill P。

---

P的result是一个数组，对应传入的每一个promise的执行结果

- 如果某个promise执行后是rejected，那么执行结果为 `{status: "rejected", reason: string}`
- 如果某个promise执行后是fulfilled，那么执行结果为`{status: "fulfilled", value: any }`

## Promise.race

并行执行一组promise，返回一个promise P，当这组promise中有任意一个settle时，根据结果fulfill或者reject P，忽略其余结果。

## Promise.any

并行执行一组promise，返回一个promise P，当这组promise中有任意一个fulfill时，fulfill P，忽略其余结果。当所有promise均reject时，以一个AggregateError reject P。

---

AggregateError是一种错误对象，表示“总错误”，包含了这组promise的每一个的错误信息。

```jsx
Promise.any([
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Ouch!")), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Error!")), 2000))
]).catch(error => {
  console.log(error.constructor.name); // AggregateError
  console.log(error.errors); // 一个数组
});
```

## Promise.resolve/reject

obsolete due to async/await syntax

返回一个fulfilled或者rejected的Promise。
