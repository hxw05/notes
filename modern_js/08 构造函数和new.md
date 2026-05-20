# 08 构造函数和new

## 构造函数

在javascript中不需要用到class就可以表示一个构造函数。

```jsx
function User(name) {
  this.name = name;
  this.isAdmin = false;
}
```

User就是一个构造函数。构造函数的一个特点是它不能被直接调用（因为用到了this且脱离对象），但可以被new调用：

```jsx
let user = new User("Jack");
console.assert(user.name === 'Jack');
```

## new关键字

以上new所做的事情：

- 将User绑定到一个空的对象上
- 执行User，此时this指向这个新的空对象
- **返回this**

new理论上可以调用任何函数，只是通常用来调用构造函数。

### `new function() { … }`

通过new调用一个匿名函数，可以封装一个对象的复杂创建逻辑。

### 构造函数的return语句

new关键字的默认行为是最后返回this的值。构造函数通常没有返回值，而沿用这一默认行为。

如果构造函数有return语句，且返回的值是一个对象，则new关键字的行为变为返回这个对象而不是this。如果返回的值不是一个对象，例如基本类型，或者undefined，则new关键字依然遵循默认行为。

### 省略()

规范中允许在没有参数需要传入的情况下省略new后表示函数调用的括号。
