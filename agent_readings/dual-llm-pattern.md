---
date: 2026/05/30
origin:
    author: Simon Willison
    date: 2023/04/25
    link: https://simonwillison.net/2023/Apr/25/dual-llm-pattern/
---
# 防止提示词注入的双模型设计

agent总是要与外界交互：读取文件、执行指令、编辑或删除文件等。在这个过程中，文件中的信息会被包含到上下文中供模型理解。这个过程中可能会发生提示词注入（prompt injection）。攻击者刻意地在文件中编写一些不可见的提示词文本来指导模型进行恶意的操作。当模型根据用户的指令读取到这些内容的时候，攻击就发生了。

需要注意这里的提示词注入并不是篡改作为用户的我们给模型的提示词。在这个环节进行攻击显得有些过于明显且容易防范。提示词注入往往都是发生在模型对外部环境的读取、探索和理解的过程中。

> If you think you have an obvious solution to it (system prompts, escaping delimiters, using AI to detect attacks) I assure you it’s already been tried and found lacking.

提示词注入是一个无法让原有的LLM直接避免的问题，因为LLM是不可靠的。一些其余显然的方法也都不会奏效。在安全领域只要有1%的疏漏，剩余的99%就会失去意义。应该达到一种“天衣无缝”的效果才能算作是真正的安全。

## 概念引入

### 模型对工具的调用

工具调用的本质几乎都是让模型生成一个事先约定好格式的字符串，包括要调用的工具的名称、参数等内容。用来接收模型输出的框架对字符串进行解析和识别，然后调用真正的函数，以达到模型调用工具的外部效果。

提示词注入的最终目的，就是让模型生成出符合攻击者意图的恶意工具调用文本。

### Confused deputy

混淆代理程序（confused deputy）是一个信息安全领域的术语，指的是一个具有用户授予的某种权限但容易被欺骗的计算机程序。这个程序是受用户信任的，但可能会因为外界的攻击而滥用了自己的权限去执行一些恶意的操作。

我们现如今使用的agent harness正是一种混淆代理程序，其本质的工作方式是**将可信内容与不可信内容拼接在一起**。安全问题便出在这里的不可信内容上。但我们又不可避免地要依赖这些不可信的内容。目前的防御手段是在执行之前要求人类批准，但这几乎只能算是走个过场；模型确实会在执行指令之前询问你，并且将指令的具体内容交付给你判断，但你真的会愿意去判断吗？或许刚开始是如此，但久而久之就会出现dialog fatigue，你会觉得越快点Yes越好，甚至希望能够彻底摘除这个机制，让模型完全“自主”地工作。

那么是否可以列出一些allow list呢？小范围可以，但是一旦范围扩大、指令数增多以后，allow list肯定会不可避免地出现通配符，其本质没有发生改变。是否可以分级处理，预先定义一些安全的行为，从而减少确认的次数呢？可以，但也不可靠，并且往往攻击就是在这些边界的场景中着手的。

### Data exfiltration attack

*exfiltration* 是一个牛津英汉词典中没有收录的词，它应该是infiltration（渗透）的反义词，意思是“外泄”。数据外泄攻击指的是未经允许从计算机中恶意窃取数据的行为，也就是偷数据。当我们赋予agent访问我们个人资料的权限的时候，就已经暴露在这种攻击风险之下。

使用agent的过程中，我们数据泄露的途径有下面几种形式：

1. HTTP请求：这是最直接的一种数据泄露的途径。具有网络访问权限的agent可以直接被引导向外界的服务器发送其经过提示词指示加工好的内容
2. 超链接：agent生成一个看似无害的超链接引导用户去点击，URL参数中包含被泄露的数据
3. 图片：agent显示一张看似无害的图片，但请求该图片的URL本身包含被泄露的数据

虽然这三种攻击的形式在网页注入攻击中就已经很常见，但其在agent的框架下仍然是有效的。攻击者只需要想办法向其服务器发送一个基本的GET请求就可以完成数据的窃取，并可以将发送出的数据用一些秘密的形式加密使这个过程难以发现或追踪。

## 最严格的实现

如果希望一个会包含不可信内容的LLM自主工作，我们对其施加的限制是非常多的：
- 不能具备任何可能被滥用的外部操作的能力。例如任何读取操作、编辑操作、删除操作等。
- 只能调用可信的API（allow list）
- 不能生成链接、图片等。

这样一个LLM大概率也无法实现什么“智能”。我们需要另辟蹊径。

## 双LLM模式

Simon Willison在这里提出了一个基于两个LLM的协作模式来减轻这个过程的风险。这两个LLM是：
- 特权LLM（Privileged LLM, P-LLM）：用户赋予了权限的LLM，它以常见的ReAct pattern工作，具有调用工具的能力
- 隔离LLM（Quarantined LLM, Q-LLM）：不具备访问外部环境的能力，被隔离的LLM。它几乎可以看作是P-LLM的一个附属或工具

这个模式的一个约束条件是：Q-LLM的输出内容不能被直接原样送给P-LLM。如果确实需要传递，必须经过某种可靠的过滤。这种可靠的过滤必须是针对类似于分类器这样具有明确pattern/schema/可能性的实现的过滤，完全可靠，没有概率问题。

那么这种模式是如何工作的呢？还需要引入一个控制器（Controller）作为协调两者的软件框架。控制器是一个经典的程序，不具备任何LLM元素。三个部分具体的工作可见于下面这张时序图，图中的 `$VAR_1` 是变量名，`[$VAR_1]` 表示该变量中存储的值。

```mermaid
sequenceDiagram
participant User
participant Controller
participant P-LLM
participant Q-LLM

User ->> Controller: 总结邮件内容
Controller ->> P-LLM: 总结邮件内容
P-LLM -->> Controller: tool call: fetch_latest_emails(), dest: $VAR_1
Controller ->> Controller: [$VAR_1]=fetch_latest_emails()
P-LLM -->> Controller: call Q-LLM: "Summarize this $VAR_1"
Controller ->> Q-LLM: Prompt+[$VAR_1]
Q-LLM -->> Controller: 总结结果
Controller ->> Controller: [$VAR_2]=总结结果
Controller ->> P-LLM: 总结完毕，内容在 $VAR_2 中
P-LLM -->> Controller: output: "Your summary is ready: $VAR_2"
Controller -->> User: "Your summary is ready: [$VAR_2]"
```
*P-LLM、Q-LLM之间的信息交换由Controller负责，二者都可以进行“变量的赋值”。P-LLM看不到Q-LLM返回的内容，但知道存储这个内容的变量名。*

总结邮件内容是涉及到不受信任的内容的操作，因此由P-LLM交给Q-LLM进行。Q-LLM在总结的过程中，即使受到了提示词注入，但由于没有任何与外部环境交互的权限，注入的攻击无法实现。以上链路确保了Q-LLM在生成内容的过程中不会有任何多余的操作。

这个过程利用了变量名引用机制。Q-LLM返回的内容不能也不需要被包含在P-LLM的上下文中，P-LLM全程看到的都只是变量名。这就实现了P与Q之间的隔离。有了Controller的中间处理与后处理，这个过程对于用户来说看不出什么特殊之处（因为Controller中始终存有所有的数据，可以随时展示），却实现了P与Q的协作。

## 总结

> You may have noticed something about this proposed solution: it's pretty bad!

Simon Willison对于自己提出的这一模式的看法是：it's pretty bad! 原因主要有：
- 实现复杂度的大幅增加
- 用户体验的降级（其中的一些细节是可以隐藏的；可能与系统额外的复杂度有关？）
- 无法防止社会工程（social engineering, but who can?）

但我觉得这种模式在某种程度上是够用的，且其原理足够简单（引用），容易理解和实现。

2025年3月24日，Google DeepMind发表了论文[Defeating Prompt Injection by Design](https://arxiv.org/abs/2503.18813)，提出了一种基于自定义解释器的变量标签（Capabilities）的提示词注入防御方向CaMeL，并与本博文作者的双LLM模式进行了对比。见于[这篇笔记](./google-camel.md)或[原博文](https://simonwillison.net/2025/Apr/11/camel/)。