# 45 DOM节点属性

## DOM节点层级

不同的节点对应于不同的类，这些类之间存在继承关系，其中的每一个被继承的类提供了特定的功能。

![image.png](45%20DOM%E8%8A%82%E7%82%B9%E5%B1%9E%E6%80%A7/image.png)

```jsx
alert( document.body instanceof HTMLBodyElement ); // true
alert( document.body instanceof HTMLElement ); // true
alert( document.body instanceof Element ); // true
alert( document.body instanceof Node ); // true
alert( document.body instanceof EventTarget ); // true
```

这些节点本质上都是对象，可以使用console.dir来输出它们的“朴素”形式。

## 常用属性

- Node.nodeType
    
    是一种较老的获取节点类型的方法，返回一个表示类型的数字，由Node虚拟类提供。
    
- Node.nodeName
    
    获取节点的名称，对于HTML元素，在HTML模式下总是大写。
    
    对于其他节点，则有不同，例如文本节点的名称是 #text
    
- Element.tagName
    
    获取元素的标签名，在HTML模式下总是大写。
    
- HTMLElement.innerHTML
    
    获取某个HTML元素的内部HTML内容，以字符串的形式返回。
    
    对其的写入操作将对某个元素的内部HTML进行替换，其中，script标签不会执行，且仍然会执行自动纠正。
    
    对innerHTML的写入会对一整个元素的内容进行替换，这代表着：用户的选择会被重置，用户在input中填写的内容会被清空，其中的图片也会重新加载。+= 操作与=没有本质区别。
    
- HTMLElement.outerHTML
    
    获取某个HTML元素的完整HTML内容，包含其本身，以字符串的形式返回。
    
    对其的写入操作会对这个元素进行替换，替换为写入的文本所代表的那个元素，但是，当前保有的对原元素的引用仍然指向原元素，原元素也没有被删除；这个替换的新元素没有被任何变量存储。
    
- Node.nodeValue/Node.data
    
    这两个属性只有spec级别的差异，一般用data就可以。其代表某个节点的内容。例如文本节点的data就是文本内容。
    
    注意：在元素节点上面获取data会返回undefined。
    
- **Node**.textContent
    
    获取该节点下的纯文本内容。对于元素，将会去掉它包含的所有标签内容。
    
    该属性可以写入，写入的效果是将文本以纯文本形式写入，而不解析其中的任何。
    
- HTMLElement.hidden
    
    布尔值，效果与.style.display=’none’类似
    
- HTMLInputElement/HTMLSelectElement/…/.value
    
    其输入的值。
    
- HTMLAnchorElement.href
- …
