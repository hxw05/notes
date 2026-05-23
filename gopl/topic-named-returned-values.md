# 具名返回值的探索

在阅读Ch3的过程中注意到`utf8.RuneCountInString`函数的源码（<https://cs.opensource.google/go/go/+/go1.26.2:src/unicode/utf8/utf8.go;l=447>）是

```go
// RuneCountInString is like [RuneCount] but its input is a string.
func RuneCountInString(s string) (n int) {
	for range s {
		n++
	}
	return n
}
```

这里的`n`是从哪里来的？不难猜到`n`来自于返回值列表，并且被赋予零值，而零值正是这里我们所需要的，无需再写一句 `n := 0`。在看到这个源码之前，我一直以为项目中遇到的类似写法只是为了可读性。现在来看，这样写有助于让代码更加简洁。这应该也算是Go中零值的应用之一。

在我自己编写项目的过程中有遇到下面的需求：

```go
var supportedFileSuffix = [...]string{"json", "yml", "yaml"}
var supportedFileHandlers map[string]func([]byte) (map[string]any, error)

func init() {
	jsonHandler := func(data []byte) (map[string]any, error) {
        var result map[string]any
		err := json.Unmarshal(data, &result)
		return result, err
	}

	yamlHandler := func(data []byte) (map[string]any, error) {
        var result map[string]any
		err := yaml.Unmarshal(data, &result)
		return result, err
	}

	supportedFileHandlers = map[string]func([]byte) (map[string]any, error){
		"json": jsonHandler,
		"yaml": yamlHandler,
		"yml":  yamlHandler,
	}
}
```

如果不使用命名的返回值的话，`jsonHandler`和`yamlHandler`都要明确定义出两个变量才能完成unmarshal。使用命名的返回值以后代码简洁了许多，可读性也提升了。

```go
jsonHandler := func(data []byte) (result map[string]any, err error) {
    err = json.Unmarshal(data, &result)
    return result, err
}
```

### 并未结束

就在准备结束这篇笔记的时候，我去问了一下AI我的笔记有没有什么问题，然后它告诉我还可以更加简洁——使用裸返回！

```go
jsonHandler := func(data []byte) (result map[string]any, err error) {
    err = json.Unmarshal(data, &result)
    return
}
```

是啊，既然返回值又有名字，其顺序和个数又是确定的，直接一个`return`就能结束函数的执行并返回一个固定的返回值列表。

我居然遇到了一个完美贴合这种写法的需求例子。

### 潜在的坑

```go
func BadExample() (n int) {
    n = 10
    if n, err := someFunc(); err != nil { 
        return
    }
    return 
}
```

上面的代码中if块内部的裸返回返回的是10，而不是`someFunc`的结果。

在if语句里面定义的那个n遮蔽了外部的n值（具名返回值），这个block内部读到的n不再是10，但这不影响return语句的行为。return语句总是返回该函数最顶层的那个n。