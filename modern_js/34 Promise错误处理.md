# 34 Promise错误处理

## catch的工作

在链中的一个catch负责处理链中在其之前所有可能出现的错误。如果catch在链的末尾，则其作为“兜底”catch，效果类似于在下面包围的一层try catch。

:::tip catch能够捕获setTimeout中的错误吗？
```jsx
new Promise(function(resolve, reject) {
  setTimeout(() => {
    throw new Error("Whoops!");
  }, 1000);
}).catch(alert);
```

不能，这里的new Promise返回的是一个永远也不会settle的promise，无论是then还是catch都不会执行（因为没有地方调用resolve, reject或者抛出**同步**的错误）。

这就好比用try catch包围以上代码，也无法捕获到setTimeout中throw出的错误；只有在setTimeout回调里面写的try catch才可以。
:::

## 重新抛出与恢复

类似于try catch，catch在遇到不属于它应该处理的错误时，可以选择重新抛出，来将错误移交给下一个catch。

当catch中没有重新抛出错误时，catch返回的是一个正常的promise，具体由catch消费者的返回值决定（注意catch本质上就是then）
