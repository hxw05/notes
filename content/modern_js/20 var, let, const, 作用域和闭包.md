# 20 var, let, const, 作用域和闭包

## let, const作用域

作用域是块级的。一个最简单的块就可以形成一个作用域，for/while/function等类似。

```jsx
{
  let message = "Hello";
  alert(message); // Hello
}

alert(message); // Error: message is not defined
```

## 闭包

### 词法环境

js中的每一个作用域上都有一个名为【词法环境】的内部对象，最基本地，整个脚本有一个全局词法环境。词法环境包含两个部分：

- 环境的记录（Records），例如作用域内的变量等
- 指向外部词法环境的指针outer

进入一个作用域时，词法环境被创建，此时作用域内的函数声明会立即被解析，因而会变得立即可用。

当一个作用域中的代码要访问某个量时，会先搜索当前词法环境中的量，如果找不到，就在outer中搜索，以此类推，一直到全局词法环境。如果找不到这个变量，严格模式下就会报错，sloppy下会在全局作用域中创建这个变量。

```jsx
let name = "John";

function sayHi() {
  alert("Hi, " + name);
}

name = "Pete";

sayHi(); // 会显示什么："John" 还是 "Pete"？
```

以上例子的结果是Pete，因为在函数执行的时候，搜索到的name就是Pete——name并没有被固定在sayHi里面。

### 闭包原理

```jsx
function makeCounter() {
  let count = 0;

  return function() {
    return count++;
  };
}

let counter = makeCounter();
```

函数在创建时，总会记住它所处的那个词法环境，记作func.[[Environment]]，可以认为是一个指针。该词法环境也是该函数词法环境的outer。

调用了makeCounter后，创建的函数的[[Environment]]就是makeCounter函数体中的那个环境，其中有变量count。当函数在函数体内找不到count时，就会到outer也就是[[Environment]]中去找，于是找到了count。因此，可以说makeCounter下的那个词法环境被完整地保存了起来，函数后续可以直接使用。

**注意：**每次调用makeCounter时，所产生的对于嵌套函数的外部词法环境是不同的。因此makeCounter总是产生新的计数器，count并不会共用。

### 词法环境的清除

只要词法环境是可达的，就不会被删除。例如上面创建了counter以后，包含count变量的环境就是可达的。如果counter被设置为null，该环境变得不可达，就会被清除。

### 调试的异常行为：V8引擎优化考虑

```jsx
let value = "Surprise!";

function f() {
  let value = "the closest value";

  function g() {
    debugger; // 在 console 中：输入 alert(value); Surprise!
  }

  return g;
}

let g = f();
g();
```

在调试的时候，由于引擎的主动优化行为，会导致一些预期之外的效果。例如，g中调用debugger暂停时，我们看到的value并不是其保存的词法环境中的value，而是全局value。

## var

- var只有全局作用域和函数作用域的区分，没有块级作用域的区分。这代表var会穿透代码块，如for/while等。
- var可以重复声明
- 作用域开始的时候，可以直接使用var声明过的函数，而不是等到var语句之后。

```jsx
function sayHi() {
  phrase = "Hello"; // (*)

  if (false) {
    var phrase; // 跟写在开头是一样的效果
  }

  alert(phrase);
}
sayHi();
```
