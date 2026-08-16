# 19 Rest参数，Spread语法

## Rest参数

- JS的函数总是能接收任意数量的参数，与规定的形参数量无关
- Rest参数可以收集这任意数量的参数
- 函数内部可以使用arguments变量获取实参的值，arguments是一个可迭代对象、类数组。箭头函数没有arguments。

## Spread语法（针对数组）

```jsx
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(1, ...arr1, 2, ...arr2, 25) ); 
```

Spread操作符可以操作任何可迭代对象，其效果与用for of遍历一致，例如

```jsx
let str = "Hello";

alert( [...str] ); // H,e,l,l,o
```

`[...str]` 这种做法，与str.split(’’)效果类似，是利用spread语法把一个可迭代对象转换为数组，数组中的每一项对应可迭代对象的每次迭代。Array.from也可以像这样将可迭代对象转换为数组。

- spread只能处理可迭代对象而无法处理类数组
- Array.from可以处理iterable和array-like
