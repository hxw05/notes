# 18 JSON

## JSON.stringify

将一个值转化为字符串，可以用来序列化一个对象。

```jsx
JSON.stringify(1) // '1'
JSON.stringify("abc") // '"abc"'
JSON.stringify(true) // 'true'
```

JSON是语言无关的规范，一些独属于JS的内容会被stringify跳过，如函数、Symbol、undefined类型（null不会）。这也是为什么JSON.parse(JSON.stringify())不能实现完整的浅拷贝。

除了第一个参数外，还有

- replacer，是key的数组或者一个函数function(key, value)
    
    如果是数组，则只序列化给定的键
    
    ```jsx
    JSON.stringify({a: 1, c: {b:1}}, ['c', 'b']) // '{"c":{"b":1}}'
    JSON.stringify({a: 1, c: {b:1}}, ['b']) // '{}'
    JSON.stringify({a: 1, c: {b:1}}, ['c']) // '{"c":{}}'
    ```
    
    如果是函数，会对遇到的每一个键值对调用一遍函数，并将其值替换为该函数的返回值（如果是undefined则没有该值）。
    
- space，表示缩进的空格数，如2

### toJSON方法

如果一个对象上有toJSON方法，JSON.stringify会优先调用。如Date对象上默认有一个toJSON方法会将其转换为RFC3339形式的字符串。

## JSON.parse

第二个参数与stringify的replacer类似，名为reviver，用于替换某个值。

```jsx
let str = '{"title":"Conference","date":"2017-11-30T12:00:00.000Z"}';

let meetup = JSON.parse(str, function(key, value) {
  if (key == 'date') return new Date(value);
  return value;
});
```
