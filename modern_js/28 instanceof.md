# 28 instanceof

instanceof操作符用于检查一个值是否是某个类或其子类的实例。这里的“类”可以是class定义的也可以是function定义的。

```jsx
function Class() {}

console.assert(new Class() instanceof Class);
```

obj instanceof Class 的工作流程

1. 如果Class实现了Symbol.hasInstance(obj)静态方法，那么直接返回这个静态方法的值（布尔值）。
2. 沿着obj的原型链进行判断，如果Class.prototype与原型链上的任意一个原型相等，则返回true。
    - obj.__proto__ === Class.prototype? → obj.__proto__即obj对应的那个F.prototype。
    - obj.__proto__.__proto__ === Class.prototype?
    - obj.__proto__.__proto__.__proto__ === Class.prototype?
    - …

## a.isPrototypeOf(b)

isPrototypeOf是object上带有的一个方法，用于判断a是否在b的原型链上存在。

- a.prototype.isPrototypeOf(b) === a instanceof b

## Object.prototype.toString

JS标准允许将Object.prototype.toString函数提取出来用于其它位置。

- 例如，Object.prototype.toString.call(null) → [object Null]

[object X] 中X位置的内容，可以由对象上的一个字段Symbol.toStringTag决定。

```jsx
let user = {
  [Symbol.toStringTag]: "User"
};
Object.prototype.toString.call(user); 
// [object User]
```

浏览器中的Window, XMLHttpRequest等对象都有自己的Symbol.toStringTag。
