# 29 Mixin

mixin（混入）：一个包含一系列完成特定功能方法的类，这个类通常不单独使用，而是向其它类添加功能。其它类无需继承该类即可获得其方法。

## Mixin的实现：Object.assign

- 在一个对象mixinObject上实现一些方法后，使用Object.assign(F.prototype, mixinObject)来将这些方法混入到F的原型上面，这就实现了无需继承而获得方法的效果。
- new F出的实例上都会自动带有mixinObject上的方法。

## mixin的继承

mixin之间的继承通过原型链来实现，方法内部可以用super来指代父mixin的方法。

```jsx
let sayMixin = {
  say(phrase) {
    alert(phrase);
  }
};

let sayHiMixin = {
  __proto__: sayMixin, // 或者用Object.setPrototypeOf

  sayHi() {
    super.say(`Hello ${this.name}`);
  },
  sayBye() {
    super.say(`Bye ${this.name}`);
  }
};

class User {
  constructor(name) {
    this.name = name;
  }
}

Object.assign(User.prototype, sayHiMixin);

new User("Dude").sayHi();
```

在这里，User.prototype上混入了sayHiMixin，sayHiMixin中的sayHi方法通过super调用了__proto__指向的sayMixin上的say方法。

sayHi是在new User实例上调用的，super根据sayHi方法上的[[HomeObject]]找到sayHiMixin，再在sayHiMixin的原型链上寻找say方法。
