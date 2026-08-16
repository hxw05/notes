# 09 Symbol类型

- symbol类型是ES6中加入的新类型，可以代替字符串成为对象的键。

## 创建Symbol

Symbol创建时传入的字符串是其描述而不是标识符

```jsx
console.assert(Symbol('id') !== Symbol('id'));
```

## Symbol作为键

- 需要作为computed property使用
- 是隐藏的属性【不是100%隐藏，有方法可以获取】
- for … in会跳过
- Object.keys不包含
- Object.assign包含

Symbol不会被**隐式转换**为字符串，这不仅在作为对象的键时成立，在其它时候也成立；要将Symbol显示出来，最好是使用toString方法或者显示其description属性。

Symbol作为键的属性是隐藏的属性，除了持有symbol的这部分代码外，其它地方无法访问。且在for … in循环中，Symbol键会被跳过。Object.keys(…)中也不包括Symbol键。

但是，Object.assign会包含Symbol键。因此，在 [07 对象](./07 对象.md) 中列举出的几种浅拷贝方法中，for … in的方法相比Object.assign就少了一个复制Symbol键的功能。

## 全局Symbol

可以在全局注册表中使用一个字符串注册一个symbol，需要使用时取出来，可以保证是同一个Symbol。

```jsx
let id = Symbol.for("id");
let idAgain = Symbol.for("id");

alert( id === idAgain ); // true
```

Symbol.for在key不存在时会自动创建。

Symbol.for的反查是Symbol.keyFor，传入一个symbol会返回它在注册表中的键。如果不存在，则返回undefined。
