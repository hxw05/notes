# 23 Class

类是一种特殊的函数

```jsx
typeof class User {} === 'function'
```

```jsx
class User {
  constructor(name) { this.name = name; }
  sayHi() { alert(this.name); }
}

// 相当于

function User(name) {
	this.name = name;	
}

User.prototype.sayHi = function() {
	alert(this.name);
}

// User.prototype还自带一个constructor字段，指向User本身
```

- 类的函数体就是User.prototype.constructor
- 类中的方法存储在函数的**prototype**上

## class与函数的区别

对于一般的使用，class确实可以看成是函数的语法糖，但仍有不同。

- class对应的函数上有特殊标记 `[[IsClassConstructor]]: true` 。该标记可以防止函数被直接调用（必须加new）
- **类的方法**是不可枚举的，也就是prototype上方法字段的enumerable均被设置为了false。
- 类自动使用use strict

## 类表达式

与函数类似，可以用类表达式来原地定义出一个类。

```jsx
function makeClass(phrase) {
  return class {
	  // sayHi捕获环境中的phrase形成闭包
    sayHi() {
      alert(phrase);
    }
  };
}

let MyClass = makeClass('hello');
new MyClass().sayHi();
```

## getter/setter

类中的函数可以是getter或者setter，发挥其相应的作用。这与直接在prototype里面写某个属性的getter和setter效果一致。

## 字段

类的字段是直接在class块中写的赋值语句。

- 字段不存储在F.prototype上，而是存在于实例对象上
- 相当于在构造函数中写this.abc=xxx赋值

```jsx
class User {
  name = "John";

  sayHi() {
    alert(`Hello, ${this.name}!`);
  }
}

console.assert(User.prototype.name === undefined);
```

### 用字段来修复this丢失的情形

this丢失的情形发生在直接传递类的方法的时候

```jsx
class Button {
  constructor(value) {
    this.value = value;
  }

  click() {
    alert(this.value);
  }
}

let button = new Button('value');
setTimeout(button.click, 100);
// 由于是以button.click的读取访问直接将函数的值传递出去，
// 在回调时将丢失与原对象关联的信息，即丢失this
```

如果将click写成字段，就可以避免这种情况

```jsx
class Button {
  constructor(value) {
    this.value = value;
  }

  click = () => {
    alert(this.value);
  }
}
```

这里的click不同于方法，是在实例对象创建时绑定在上面的，类似于下面的过程

```jsx
function Button(value) {
	this.value = value;
	this.click = () => {
		// 此处发生了闭包捕获，this被存了下来，指向Button的实例对象
		console.log(this.value);
	}
}

let f = new Button('abc').click;
f(); // abc
```

需要注意的是，这里只能使用箭头函数来实现，因为只有箭头函数会将this.value看做平凡的值进行捕获。function关键字定义的函数需要动态绑定才能拿到this中的值，在这里不会捕获任何东西。【词法绑定vs动态绑定】
