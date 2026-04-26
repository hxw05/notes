# 44 DOM检索

## document方法

- document.getElementById
    
    建议使用此方法来获取带id的元素对象的引用，而不是直接使用id对应的那个变量。
    
- document.getElementsByName(name)
    
    获取所有name属性为name的元素集合，很少用。
    

这两个方法都只存在于document对象上，且搜索范围也是全文档。

## 元素方法

- el.querySelector/All(css)，选择器中可以使用伪元素或者元素状态
    
    注意，该方法返回的集合不是动态的。
    
- el.matches(css) 判断某个元素是否符合选择器
- el.closest(css) 在元素的祖先中寻找符合css选择器的最近的那个元素，注意寻找的对象中包含自身
- el.getElementsByClassName(classname) 寻找带有指定类名的所有元素
- el.getElementsByTagName(tag) 寻找指定标签的所有元素，tag可以填*
