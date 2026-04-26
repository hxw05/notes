# 46 DOM属性和HTML属性

DOM属性和HTML属性并不是一一对应的。

## DOM属性

DOM属性（DOM property）指的是DOM对象上存在的属性。DOM对象与普通的JS object无异，它上面也可以定义属性，也利用了prototype实现继承，这些属性名也是区分大小写的。

## HTML属性

HTML属性（HTML attribute）指的是写在标签上的一些额外的字段，分为标准属性和非标准属性。对于标准属性，浏览器会将其值对应到DOM对象属性上去；非标准属性则不会有这一过程，但仍然可以获取到（el.getAttribute）。标准、非标准是相对于具体的元素而言的，例如type对于input就是一个标准属性，而对于body则不是。

有这些方法可以使用：el.getAttribute/setAttribute/hasAttribute/removeAttribute

除此之外，attributes方法会返回一个Attr对象的collection，Attr对象上包含该属性的名称（name）和值（value）。这个collection中既包含标准的属性也包含不标准的属性。

HTML属性的名称是大小写不敏感的，其值则永远是一个字符串；但当其对应到DOM属性上时，首先其对应的字段名是固定的，大多数就是HTML属性名的小写（例外如for属性对应到DOM上是htmlFor），而其值则不一定是字符串，甚至不一定一定和属性的值相等。

- 例如style在对象上是一个对象
- href在对象上永远是一个完整的URL，即使html中它是一个相对路径或者hash
- checked是一个布尔值

## DOM-HTML属性同步

对于一个标准的HTML属性，当它的值发生改变的时候，DOM对象上的相应字段也会改变。当DOM对象上的字段发生改变的时候，其HTML属性*可能*发生改变（大多数）。

改变对象字段但不改变属性的例子：input.value属性，仅仅存在前一种同步（HTML → DOM object）

## dataset

为了避免非标准属性在将来被HTML规范更新所影响，建议自定义的属性使用data-开头的数据属性。这些属性会以kebab-case转camelCase的形式存储在DOM对象上的dataset字段（对象）中。这种属性依然存在同步。
