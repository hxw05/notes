# 01 Strict Mode

## 严格模式的定义

严格模式不是js的子集，而属于对语言语义的一种改进。

严格模式：

- silent error变为throw
- 解决了导致js引擎无法优化代码的问题，使得js引擎可以优化代码。同样一段代码，在严格模式下面可能有较好的性能。
- 禁用了一些可能在将来被设计的ECMAScript语法

严格模式可以作用于整个脚本（开头use strict）或者单个函数（函数体开头use strict），但不可作用于单个块级作用域（use strict不发挥作用）。严格和非严格模式的代码可以共存（取决于use strict的位置）。

## 什么情况下不能use strict

在带有解构参数、参数默认值的函数中不可以使用use strict，会视为语法错误。

![image.png](01%20Strict%20Mode/image.png)

## 什么情况下不需要use strict

- 用到了模块语法的js代码一定是严格模式
- class**内部**的代码一定是严格模式

## 严格模式的作用

### 显化错误

js最初被设计给新手程序员使用，其中的许多错误都没有直接抛出。严格模式下， 这些错误将直接抛出并导致程序无法运行，包括：

- Reference Error: 赋值给一个未声明的变量。在sloppy下，此操作会在全局对象上创建该变量。
- Type Error: 赋值给不可赋值的对象。在sloppy下，此操作是no op（silently fail）。
    - 不可赋值对象
        - 明确设定为writable:false的property
            
            ```jsx
            const obj1 = {};
            Object.defineProperty(obj1, "x", { value: 42, writable: false });
            obj1.x = 9; 
            ```
            
        - getter
            
            ```jsx
            const obj2 = {
              get x() {
                return 17;
              },
            };
            obj2.x = 5;
            ```
            
        - 不可拓展的（non-extensible）对象
            
            ```jsx
            const fixed = {};
            Object.preventExtensions(fixed);
            fixed.newProp = "ohai";
            ```
            
        - 只读全局变量
            
            ```jsx
            undefined = 5;
            Infinity = 5;
            ```
            
- TypeError: 删除不可删除的property
    - `delete Object.prototype;`
    - `delete [].length;`
    - configurable?
- Syntax Error: 重复的函数形参名称。在sloppy下，重名的后一个形参会覆盖前一个形参，但是前一个形参依然可以通过arguments?访问。
    
    ```jsx
    function sum(a, a, c) { //...
    ```
    
- Syntax Error: 八进制数字的传统写法，以0开头，例如 `0644===420`。正确的写法应该是 `0o...`（o代表octal）。避免前一种写法的原因是有些novice程序员会将前面的0当成是用来对齐的工具，例如都是三位数，期待024+111===135。
- Type Error: 在基本类型的值上设置property。
    
    ```jsx
    false.true = ""; // TypeError
    (14).sailing = "home"; // TypeError
    "with".you = "far away"; // TypeError
    ```
    
- Syntax Error(< ES6): 重名property。ES6之前重名property是错误的，但是从ES6开始，computed property names介绍使得重名property又成为可能。

### 简化作用域的管理

sloppy下的js通常让最简单的变量名与其定义的映射难以进行，严格模式则简化了作用域的管理，使得编译器能够更好地优化代码。

- 禁用with关键字。with关键字使得其包围的块中的名称的具体指向无法推断，导致必须等到运行时才能确定，影响代码优化。
- 无泄露的eval。sloppy下的eval中创建的变量会进入到当前作用域（上层函数或全局作用域）中，而严格模式下其中的变量只服务于eval中的语句。
- 严格的块级函数定义。块级函数定义最初不包含在js语言规范中，但各个浏览器均作为拓展语法实现，这就导致其行为各异。严格模式统一了块级函数定义的行为，而sloppy下其行为依然各异。

### 简化eval和arguments

- eval和arguments被看作是关键字，不能用于其他用途。
- 形参和实参之间不再同步。在sloppy下，实参如果被改变，arguments相应下标也会改变，这就好比形参和实参之间是同步的。严格模式下，arguments将保持为调用函数时原本传入的内容，而不会跟随函数体中对实参的重新赋值而变化。

### 使JS更安全

由于JS十分灵活，通常难以检查sloppy下的JS的安全性（是否会获取用户的私人信息等）。通过严格模式的一些调整，JS变得更加安全。

- 不会替换this的值。sloppy下的函数中this永远是一个object，无论将thisArg设置为何值。如果thisArg的值是一个基本类型，this也会被装箱而成为一个object，例如
    
    ```jsx
    function fun() {
      return this;
    }
    
    console.log(fun.call(2) === 2) // false
    ```
    
    如果thisArg是undefined，那么this就会被装箱成为globalThis（浏览器中window），安全性降低。
    
    严格模式下，this不一定是一个object，而是thisArg本身。如果thisArg是一个number，那么this也是一个number。
    
- 不允许探查函数的调用栈。函数的caller和arguments属性会分别记录调用该函数的最近一个函数以及传入的实参，这就使得探查函数的调用栈成为可能，并不安全。在严格模式下，caller和arguments是不可删除的、不可读取、不可写的属性，执行任何操作都会导致Type Error。

### 额外的保留关键字

严格模式下的JS添加了额外的关键字，为未来的更改做保留。例如：implements，interface，package，yield等。
