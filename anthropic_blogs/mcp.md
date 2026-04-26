---
date: 2026/04/22
origin:
  link: https://claude.com/blog/what-is-model-context-protocol
  date: 2025-10-31
  title: What is Model Context Protocol? Connect AI to your world
  subtitle: Connect AI assistants to your tools without custom integrations using Model Context Protocol.
---

# 何为MCP？将AI与你的世界相连

> AI models are only as good as the context provided to them.

开头列举了没有MCP状态下，人们一般是如何使用AI来完成一些软件任务的，其大体逻辑离不开复制和粘贴：我们将需要提供给AI的参照信息从外部复制给AI并附加上自己的prompt，然后将AI产出的文件复制到我们的软件中，这其中还有一些不可避免的调整过程，不是全自动的。

## What is Model Context Protocol?

> The Model Context Protocol is an open standard that defines how LLMs communicate with external systems.

MCP是一个开放的标准，定义了大语言模型如何与外部系统进行交流。

文章在这里做了一个比喻，MCP就像LLM界的USB-C口。USBC为所有的设备提供了统一的接口。在此之前，不同的设备有自己的接口，例如安卓的MicroUSB、苹果的Lightning，照相机更是有着自己的专属接口。在MCP出现之前，自动化并非完全不存在，但是这需要每一个平台单独的按照需求编写自己的代码，这些代码之间是互不通用的。MCP在这里充当了一个单一的统一格式，帮助AI与现有的应用进行连接。

> Now, MCP provides a single, standardized format for connecting these tools to Claude and other AI applications.

## Where did MCP come from?

MCP的提出者是Anthropic的两名员工David Sorria Para和Justin Spahr-Summers。前者厌倦了在Claude Desktop和IDE之间反复复制信息，他意识到这是一个经典的**M×N**问题，可以通过添加一个中间层（协议）来降低复杂度。MCP的设计思路基于LSP（在vscode里面写代码，一些语言的语法分析就是用language server实现的，这中间便涉及到LSP）。

2024年11月，他们开源了MCP。

> Recognizing this as a classic M×N problem where multiple applications need multiple integrations, David pitched building a protocol to solve this to Justin.

:::tip M×N问题是什么？
我不知道M×N问题最初始的来源在哪里。单就这个文章来看，M×N问题指的是有M个模型（或者agent、AI应用）和N个外部操作对象（应用、文件等），要让它们建立联系，需要M×N条连线。

加了一层MCP以后，M×N问题就被转化为了M+N问题。M个模型和N个外部对象之间，只需要建立M+N条连线，其中M条是模型与MCP层建立的连线，N条是外部操作对象与MCP层建立的连线。

M×N的特点：
- 对于每一个模型，它都需要分别与每一个操作对象单独integrate
- 模型与对象一对多（或者可以看成对象与模型一对多，但这两个关系不是同时存在）

M+N的特点
- 对于每一个模型，它只需要与MCP层integrate；对于每一个操作对象，也只需要与MCP层integrate
- 模型与MCP一对一，MCP与操作对象一对一
:::

## How does MCP work?

使用客户端服务端的设计，AI/聊天机器人作为MCP客户端，被调用/操控的应用作为MCP服务端。

由于这是经典的前后端分离设计，只要一端实现了其应有的协议，就可以自然地与另一端相连接：

> By building an MCP Client, AI agents and chatbots can access thousands of MCP Servers built by the community, giving them a straightforward path to extend their capabilities. By building an MCP Server, companies and developers can make their products readily available to AI, creating a new avenue to provide value.

简单来说，构建MCP Client以后就可以与成百上千的MCP Server连接，对接他们的能力，反过来也是。

## Why is MCP important?

> MCP allows LLMs to **go beyond chat and perform real-world tasks**: reading an email thread and sending a reply, accessing a codebase and deploying an update, or reviewing a design brief and generating a first draft.

这里强调了MCP的重要作用是让LLM可以超越只作为聊天机器人的身份去做现实世界的任务。所谓现实世界的任务，指的应该就是这些应用：人类在日常生活中使用这些应用去做工作，AI有了MCP也可以操作这些应用，所以AI就跟现实世界打通了。这里可以发现MCP的作用与tool calling本质上是一样的，都是让模型除了生成对用户的答复以外，去生成一些结构化的数据，从而实现一些“可编程行为”或者“可融入编程中的行为”。二者不可避免地需要比较。

文章写道，MCP为LLM提供的这些能力实现了：
- AI的通用兼容性（universal compatibility）：文章在这里的解释与前面所提到的前后端（文中写的是“双端方案”，two-sided approach）分离带来的好处一致，因此这里的universal compatibility应该指的是一个协议（protocol）所带来的自然的好处。这本质上与许多现存的协议（如TCP、HTTP）带来的关于它们所解决问题的好处并无区别。
  - 划线句：https://claude.com/blog/what-is-model-context-protocol#:~:text=AI%20assistants%20gain,all%20AI%20connections.
- 一个开放的、AI原生的生态系统
  - 开放：MCP是开源的开放协议，所以任何人都可以基于它来做东西，从而形成生态系统，加速社区发展
  - AI原生（AI-native）：*Makes software AI-accessible by design.* 所谓AI原生，指的是一个应用在开发的过程中就考虑到与AI的兼容性以及如何让AI更好地调用该应用。MCP的提出使得应用开发的过程中不仅仅考虑面向人类的页面，还可以同时（in parallel）考虑面向AI的界面，从而让一个应用从诞生之初就是AI-accessible的
- Agent的基础协议：MCP为AI访问不同的服务和功能提供了统一的接口，这样AI通过调用不同的服务就可以推进任务。这为真正能够独立完成任务的智能体的诞生奠定了基础。

> As more applications adopt the protocol, the vision of AI agents that can independently handle complex, multi-step workflows becomes increasingly practical.

:::tip 名词解释：原生
从英语的角度理解，native这个词语可以用来表示母语（native language）。母语是不需要经过特别的系统性学习就掌握的语言，并且一个人的母语大概率是他最熟悉的语言。

换到计算机领域来看，原生通常指的是不需要额外的努力就可以实现的一些功能或特性。例如，
- 一个软件可以在ARM架构的处理器上运行而不需要从其它字节码转译，就称这个软件是原生支持ARM的软件
- 一个软件是编译型的而不是Electron套壳，也可以说这个软件是原生运行的软件，对应的开发可以叫做原生软件开发。这个时候强调的就是软件没有经过套壳

总结一下，原生可以概括为一种顺从自然的性质，这种性质往往会带来性能、效率方面的优势。

*我觉得AI-native这个词对于英语母语者来说应该不需要太多的解释？*
:::

## Who is MCP for?

### 开发者

> Building an agent that will connect to many applications? Building an application that will connect to many agents? MCP provides you with access to an ecosystem of compatible tools with streamlined integration.

只需要围绕一个标准进行开发，就可以让你的应用支持Agent调用，或者让你开发的Agent支持一些应用。

### 企业

MCP简化了AI与外部系统的连接过程，从而可以让企业内部的工具或系统更容易向AI迁移。

### 消费者

> MCP provides end-users with seamless connectivity between their favorite AI assistants and work tools

提供无缝AI完成任务的体验，减少复制和粘贴。

> In Claude, you can instantly connect to MCP Servers, known as **Connectors**. This provides you with a straightforward way to connect Claude to your favorite work apps.

**Connectors（连接器）**在这里指的是Claude里面专属的MCP Server。

## FAQ

### Only for Claude?

No

### MCP需要编程能力才能使用吗？

> Not for using connectors. Browse, install, authenticate. That's it.

这句话我不知道为何读完感觉有点搞笑。use MCP 确实有两种解读：接入MCP/MCP相关开发算是一种，使用做好的client/server也是一种。所以上面这句话回答的是use后面的这个含义。

> Building custom MCP servers requires TypeScript or Python knowledge, but the growing connector library covers most mainstream tools.

MCP也有很多轮子，不一定都要自己写。

### MCP的性能怎样？

> MCP uses efficient protocols.

这句话指的是MCP依赖的那些协议是高效的。不要奇怪为什么一个协议会依赖一个协议，如果按照计算机网络的层级来划分，MCP所属的层级应该在应用层（HTTP等所在）再往上一层。

- Stdio transport for local servers provides minimal overhead. 本地调试的时候，以标准输入输出（stdio）来交换信息的负担很小。
- Server-sent events (SSE) and Streamable HTTP for remote servers maintain persistent connections. SSE或者Streamable HTTP会维持长连接（从而避免反复建链接）。
- The protocol supports pagination, filtering, and partial responses to handle large datasets efficiently. 支持分页、过滤以及部分返回，从而处理大的数据集。
- Response streaming prevents timeouts on large data operations. 流式输出会防止在大的数据操作上的超时问题。这句话的意思应该是如果不流式输出，大的数据需要等待很久，容易触发超时。