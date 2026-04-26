# 30 try … catch

- try…catch只能捕获运行时错误（而非语法错误）
- try…catch只能捕获同步错误
- catch不一定要捕获Error对象

## Error对象

catch捕获到的变量是一个Error对象，字段包括

- name是错误的名称，例如ReferenceError
- message是错误信息描述

还可能有一些非标准字段

- stack展示完整的调用栈

## throw

throw后面可以跟任意类型的值，建议跟Error对象。

- Error
- SyntaxError
- ReferenceError
- TypeError
- …

例如，new SyntaxError("abc")中，SyntaxError对应Error对象的name，abc对应Error对象的message。

## 重新抛出

JS中的try … catch会捕获任意类型的错误。如果只需要处理其中一种或几种错误，应当加上判断（instanceof）后，将其余未处理错误重新抛出。

```jsx
try {
  user = { /*...*/ };
} catch (err) {
  if (err instanceof ReferenceError) {
    alert('ReferenceError'); // "ReferenceError" for accessing an undefined variable
  }
}
```

## finally

finally块

- 在try块正常结束后执行，或者
- 在catch块结束后执行

finally块**一定**会执行。

- 123在return后输出

```jsx
try {
	return 1;
} catch (e) {
	// ...
} finally {
	console.log(123);
}
```

- 123在throw后输出

```jsx
try {
    a()
} catch (e) {
    throw e;
} finally {
    console.log(123);
}
```
