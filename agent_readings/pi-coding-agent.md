---
date: 2026/05/29
origin:
    link: https://mariozechner.at/posts/2025-11-30-pi-coding-agent/
---
# 一种主观且极简 Coding Agent 的实现（Pi）

> *So what's an old guy yelling at Claudes going to do? He's going to write his own coding agent harness and give it a name that's entirely un-Google-able, so there will never be any users. Which means there will also never be any issues on the GitHub issue tracker. How hard can it be?*

Pi coding agent（以下简称pi）是一个极简的代码编辑agent。它没有如同Claude Code、Codex CLI以及类似产品那样繁多的功能和复杂的架构，而这正是其重点所在。pi强调，仅在你真正需要的情况下向agent引入额外的功能，并在引入之前思考该功能能否借助现有的框架实现。其官网上推荐借助pi自身能力去构建、拓展和定制pi，“用agent来构建agent”，将其配置为最适合你自己的样子。

pi的出发点是一个极简的agent，自带只有read、write、edit、bash四种工具。它看上去不像是一个在Anthropic/OpenAI叙事的当下能够拿来通用的C端产品，而更像是一个DIY的基座。文章提到了一些pi中不包含的功能及其原因。

> My philosophy in all of this was: if I don't need it, it won't be built. And I don't need a lot of things.

## 简化的系统提示词以及工具集

pi的预置系统提示词和工具集定义总共加起来不到1000 tokens，相比于Claude Code算是九牛一毛。我们仍然可以通过定义AGENTS.md来插入我们自己的提示词从而自定义agent的行为，或是彻底换掉整个系统提示词。

一个常见的想法是，这些模型都有可能被专门训练用于它们的原生harness，例如GPT用于Codex、Claude用于Claude Code等，所以用它们原生的提示词很合适。但根据benchmark的结果，我们或许并不需要这些长达10000+ tokens的系统提示词。

工具集定义也是一样。默认只有四种工具，如果有需要可以再加。但一般认为这四种工具就已经足够了，其中的bash是多功能的，有了bash就有了任何（系统原生）操作的可能。Bash is all you need.

## 默认绕过权限（YOLO by default）

pi是默认绕过权限的，这可能在安全性角度来考虑很令人惊讶，但我们需要认识到很多coding agent中的安全机制也都只是表面功夫。

并且“自主运行”和wait for approval是天然矛盾的：比起守在电脑前面逐一判断指令或操作的风险、选择是allow还是deny并给予意见，大多数人（包括我）更想要的是放在那里让他自己干，然后开始干别的事情，过了二三十分钟之后成品直接被端上来的效果。毕竟只有这样才能算是真正的解放了我们的（一部分）时间。不过前面这种方式存在一种让另一个LLM来担任审核的pattern。

<!-- 至于说对于前面这种方式的AI化——让另一个LLM来担任审核的pattern，似乎在[引入复杂度的同时也不怎么安全](https://simonwillison.net/2023/Apr/25/dual-llm-pattern/)。 -->

> Since we cannot solve this trifecta of capabilities (read data, execute code, network access), pi just gives in. Everybody is running in YOLO mode anyways to get any productive work done, so why not make it the default and only option?

不过我们仍然可以选择在一个容器化的环境或受限的网络环境中运行pi来从机制上确保其工作过程的安全性，只是默认不再有任何对pi运行的指令或操作的阻碍了。

## 不包含的功能及其考虑

### TODO

> In my experience, to-do lists generally confuse models more than they help. They add state that the model has to track and update, which introduces more opportunities for things to go wrong.

就我个人的体验来看，TODO没有引入很显然的问题，在一些较为复杂的场景，确实可以为模型提供任务的outline（例如列出5~8个TODO，一个一个完成）。但我不是很明白为什么模型有的时候会仅列出一个TODO。

### Plan mode

Claude Code的plan mode被称为是一种安全的代码分析（safe code analysis），其在一个只读的环境中执行，以近乎固定的（提示词指定的）结构输出，保存在本地的文件中，并可以通过对话修订。但我们不能忽略，与模型进行对话的过程本身就可以达到类似的效果，甚至可以进行更加细致的交流。如果确实需要对结果的手动修订或者审阅，也可以让模型采用类似的模式，将plan写到md文件中，后续都在此文件上做修改等。

### Background shell vs. tmux session

background shell引入了模型对外部进程的管理成本，而与此同时模型对这些进程的交互方式是极其有限的。

一个我观察到的现象是，即使在最新版的Claude Code中，DeepSeek V4 Pro也没有办法总是记得kill background shell。它有时会误解background shell的作用所在。例如在前端开发过程中，每一次调试结束之后，它有时会决定开一个dev server的shell挂在那里。但为何要将这个shell交给harness呢？tmux显然是一个更好的选择。

tmux和background bash的主要区别是：
- background bash是近乎完全交付给agent管理的、在agent框架之内的一个后台bash进程。你对于这样一个进程所能做的只有将其关闭和查看输出
- tmux是一个真正的session管理工具。agent可以与其中运行着的进程（任务）通信，你也可以。而且你们通信的方式大概率是一致的：agent通过send key等，人类通过attach以后输入指令。

> How's that for observability? The same approach works for long-running dev servers, watching log output, and similar use cases. And if you wanted to, you could hop into that LLDB session above via tmux and co-debug with the agent. Tmux also gives you a CLI argument to list all active sessions. How nice.

### Sub-agents

子agent带来的限制主要体现在可观测性上：
- 我们无法控制对sub-agent提供的上下文、指示和参数信息（由主agent来决定和提供）
- 我们看不到sub-agent的具体工作内容

> Using a sub-agent mid-session for context gathering is a sign you didn't plan ahead. If you need to gather context, do that first in its own session. [...] That artifact can be useful for the next feature too, and you get full observability and steerability, which is important during context gathering.

通常我们不会真正的需要sub-agent，而是新开一个session去并行。多个sub-agent同时实现不同的模块实际上很难可行（尤其是在agent编写的代码没有做好代码分割或封装的情况下），很容易导致冲突或大量的重复。

### MCP vs. CLI tool

pi不支持MCP的一大考虑是MCP工具往往会引入较大的上下文负担，这是一个通用性带来的问题（i.e. 一个工具为了让其适用于所有人而塞进了许许多多的功能，但每个人很可能只能用到其中的一小部分，而其余部分带来的负担却没有被摘除）。对于MCP，这一负担体现在一些完全用不到的MCP功能也会被包含在上下文中的现象。这种负担关乎上下文，进而关乎模型的具体表现。

CLI工具+README是这里提出的用于代替MCP的方法，例如用一个基于Puppeteer的CLI工具来代替Playwright MCP或Chrome DevTools MCP。其实随着日常对agent的使用，很容易想到这种“工具+文档”的模式。这种模式还可以进一步衍生出目录结构和扮演目录索引的README文件。这些实现都很像Anthropic提出的Skill，但属于更加专门的、未标准化的实现。

CLI工具相比于MCP要更为轻量，且没有上面所说的通用性带来的问题（假设这是我们自己定制的）。我们使用的时候，只需要用@mention去提及相应工具的README文件来将其导入到上下文中。这种mention的方式相比与Skill的progressive disclosure要更加可靠，后者在很多时候与模型能力有关：模型是否参考Skill，或是依靠自己的旧认知，或是幻觉认知，完全取决于模型自身，这一点的体现可见于我的[这篇记录](../agent_diary/deepseek-cant-do-liquid-glass.md)。

#### 一种形式的转变

总体来看，这更像是一种形式而非功能上的转变。MCP是允许agent与现有的软件系统（往往体现在比较复杂的那种）交互的一个标准，它只是API的一种形式。用于代替Chrome DevTools MCP的脚本，同样需要实现对浏览器的模拟和网站的操控，也就不可避免地要用到Puppeteer等库。

#### CLI 形式解决的问题

这种形式上的转变很重要，因为MCP除了上文所说的上下文负担以外，还有两个问题：
1. 可拓展性问题：拓展一个MCP的功能无异于修改其源码，需要搞清楚其原理和过程。我们很可能需要和agent共同完成此过程。
2. 可组合性问题：MCP彼此几乎无法组合，因其一端是模型（M）。MCP Server给出的结果一定要进入模型的上下文才能采取下一步的操作。

CLI相比于MCP在这些问题上的优势体现在模型已经有了许多与Bash、CLI相关的知识，因而让模型写出CLI代码和调用、组合CLI工具都很容易。

#### MCP 可以被包装为 CLI tool

MCP和CLI tool不是互斥的，因为MCP本质上只是一个遵循客户端服务端架构的协议。我们可以对MCP的调用进行[包装](https://github.com/steipete/mcporter)，相当于将客户端从agent内部移动到了外部的CLI中。

## 一种自带多LLM支持的Harness框架

除了作为一个功能简洁、可供DIY的agent外，我们还可以将pi（确切地说是pi底层的`pi-ai`）看做是一个自带多LLM支持的harness框架。在阅读这篇博文之前，我在日常使用agent的过程中并没有怎么想过如何在多个provider之间切换上下文以及这个兼容的过程具体是怎么样的。读了之后，我发现这个过程困难重重。不同的provider接口不仅是字段名不同那么简单，其思维链的表达方式、token消耗与缓存的统计结果、对图片或文件的处理等均有很大的不同。

如果要我们自己去构建一个这样的兼容层，代码量不说，需要消耗非常多的财力去做测试，并且还要面临国内网络环境所导致的服务不稳定的问题。好在`pi-ai`帮我们解决了这个问题，并提供了[直观的API](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#toc_1:~:text=I%27m%20happy%20to%20report%20that%20cross%2Dprovider%20context%20handoff%20and%20context%20serialization/deserialization%20work%20pretty%20well%20in%20pi%2Dai%3A)。

正因为pi使用的是TypeScript，其得以在构建直观API的同时保证类型上的安全，以一种规范化的方式提供拓展的接口。

> Many unified LLM APIs completely ignore providing a way to abort requests. This is entirely unacceptable if you want to integrate your LLM into any kind of production system.

`pi-ai`还支持JavaScript原生的AbortController机制，使得我们可以[方便地终止模型的响应](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#toc_1:~:text=Here%27s%20how%20it%20works%3A)。

## 参考

- https://github.com/badlogic/pi-skills
- https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/
- https://simonwillison.net/2023/Apr/25/dual-llm-pattern/
- MCP包装器：https://github.com/steipete/mcporter