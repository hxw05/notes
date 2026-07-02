# 系统原生字体 font-family

若是觉得添加了自定义的系统显得有些没有必要，又害怕不同的平台上显示的都是效果惨不忍睹的`sans-serif`，可以考虑明确指定每个系统上的默认字体。各个平台上都有其默认的字体搭配，尤其是一些市场份额较高、有明确品牌的操作系统。下面列出了常见的系统字体搭配
- macOS（或iOS）上的默认中文字体是苹方（PingFang SC）和英文Sans Francisco（SF Pro）
- 更早的macOS或iOS上的中文字体为黑体，英文字体为Helvetica，这也不失为一种搭配
- Windows上的默认字体搭配应该是Segoe UI和微软雅黑，或者纯微软雅黑（其英文部分其实也是Segoe）
- Android上最经典的字体搭配是Roboto和Noto Sans SC，英文部分还可以考虑Google*终于在2025年*开源的Google Sans字体（前身为盗版流出的Product Sans）
- Ubuntu上的英文字体可以选择Ubuntu Sans
- ...

于是我们可以写出这样的font-family定义，来让网页在不同的操作系统上都有最native（优点之一是用户最习惯）的字体搭配，这也免去了选择字体、host字体以及页面加载字体的流程。

```css
:root {
    font-family: 'SF Pro', 'Segoe UI', 'Roboto', 'Google Sans', 'Ubuntu Sans',
                 'Helvetica', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC',
                 'Heiti SC', sans-serif;
}
```

诚然我们有[ui-sans-serif](https://drafts.csswg.org/css-fonts/#ui-sans-serif-def)和[system-ui](https://drafts.csswg.org/css-fonts/#system-ui-def)这样的generic font，但明确地将具体的搭配写出来可以让字体搭配意图更明确和受控。