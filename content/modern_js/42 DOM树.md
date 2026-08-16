# 42 DOM树

DOM树是指HTML代码经过解析、自动纠正之后，将文档中的内容表示为其对应的节点对象（Node）并按照层级嵌套关系组织成的一种树形结构。

DOM定义每一个HTML标签都对应一个object，标签内部的文本也是一个object。

```html
<!DOCTYPE HTML>
<html>
<head>
  <title>About elk</title>
</head>
<body>
  The truth about elk.
</body>
</html>
```

以上HTML描述了一个树状的结构。其中需要注意的是

- 由于历史原因，head之前的文本不算object
- 在title tag之前有一个换行和两个回车，这三个字符共同构成一个文本节点，其余的类似。
- body后面的内容会被自动移动到body内部

## 自动纠正

浏览器对于不完整的HTML有自动纠正，这包括：

- 自动闭合未闭合的标签
- 自动添加必要的标签，如html、head、body和**tbody**

## 节点类型

HTML中的一切内容都会被放入到DOM树中，包括文本、注释、以及`<!DOCTYPE...>`标记。document对象本身也算是DOM树上的一个节点。

DOM中一共有12种节点，我们一般只会接触到其中的4种：

- document（整个文档所对应的节点类型）
- 元素节点
- 文本节点
- 注释节点
