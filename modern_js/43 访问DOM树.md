# 43 访问DOM树

在浏览器中，对DOM树的访问总是起始于document对象，在它之下有一些基本的对象

- document.documentElement，对应于html标签
- document.body, document.head 对应于body，head标签
    - 需要注意的是，document.body可以为null，发生在编写于body之前的js代码中。

## 节点

- childNodes → 所有孩子节点的collection
- firstChild → 第一个孩子节点
- lastChild → 最后一个孩子节点
- previousSibling → 上一个兄弟节点
- nextSibling → 下一个兄弟节点
- parentNode → 双亲节点
- hasChildNodes → 判断是否有孩子节点

在这里返回的collection是一个动态的array-like，会随着DOM的更新而更新。可以使用for … of遍历，但不能使用数组方法。

## 元素

- children → 所有孩子元素的collection
- firstElementChild
- previousElementSibling
- parentElement
    
    并非只有元素节点能够有孩子，一些其他类型的节点，如文档节点也能有孩子，比如在html对应的document.documentElement上，获取parentNode就得到了document（文档节点），而其parentElement则是**null**。注意在DOM中用null而不是undefined表示不存在。
    
- ~~hasChildren~~
