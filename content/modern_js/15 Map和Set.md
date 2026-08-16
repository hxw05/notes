# 15 Map和Set

## Map

```jsx
let recipeMap = new Map([
  ['cucumber', 500],
  ['tomatoes', 350],
  ['onion',    50]
]);
```

Map是一个类，类似于原生的object，但提供了更强大的能力：

- 支持非字符串/Symbol的键，也就是任何类型都可以作为键来使用。
- 提供灵活的方法，set/get/has/delete(key)，clear
- 用size指示包含值的数量

不应该使用bracket notation去get和set Map的值，而只应该使用get和set方法。

Map使用SameValueZero算法来比较键，和===差不多且可以处理NaN。

Map.set调用会返回Map本身，因此可以链式调用。

### 迭代

keys, values, entries均返回可迭代对象，entries返回的形式是[key, value][]。迭代的顺序与插入的顺序相同。

### 与普通object的转换

由于Entry的表示是统一的（[key, value]），可以使用Object.entries/fromEntries完成该转换。

### WeakMap

WeakMap的键必须是对象，不能是原始值，且对象作为WeakMap的键不会避免对象被GC清除（Map会）。WeakMap不可迭代，没有size，只能进行get/set/delete/has。

- 适合键与值共存亡的情况。如记录某个用户的访问次数，当该用户开始访问时进行记录，用户退出并被清除时，访问次数也应该一起被清除，避免一直叠加。又如缓存，将某个对象的处理结果缓存下来，如果该对象一直存在则缓存也一直存在，如果对象被删除则其缓存也被删除。

## Set

Set是集合，其中不存在重复的值。Set的add对于重复的值没有额外操作。

Set适合存储一组不重复的值的场景，提供比数组更好的性能。

### 迭代

可以使用for … of 或者forEach来迭代一个Set。顺序遵循插入的顺序。

### WeakSet

WeakSet中只能存储对象，不能存储原始值。不可迭代、没有size、没有keys()。

在正常的Set中，如果存储了某个对象，只要它可达，这个对象就不会被删除。而WeakSet中存储的对象，如果对象本身被删除，那么其在WeakSet中存储的引用也会被清理。
