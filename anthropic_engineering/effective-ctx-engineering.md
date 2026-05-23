---
date: 2026/04/25
origin:
  title: Effective context engineering for AI agents
  link: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  date: 2025/09/29
---
# 高效的AI Agent上下文工程

几年过去了，prompt engineering已经不再是讨论的重点，取而代之成为重点的是context engineering。通过大模型去构建应用的重要问题，从该如何正确地在系统提示词里遣词造句，转向了该如何正确组织上下文，从而让AI能够给出想要的结果。

> The engineering problem at hand is optimizing the **utility** of those tokens against the **inherent constraints** of LLMs in order to **consistently** achieve a **desired** outcome.

有上下文地进行思考（thinking in context） — 考虑任意时刻，LLM所能看到的外部整体情况，以及从这种状态下，LLM可能产生怎样的输出。

## Context engineering vs. prompt engineering

> At Anthropic, we view context engineering as the natural progression of prompt engineering.

从发展的角度来看，上下文工程更像是提示词工程的一种进化产物。这主要源于我们对LLM的使用方法的进化。

- 早期对LLM的使用，多为日常对话，在日常对话之外的工程中，我们会使用LLM来进行一些“智能”的输出，例如让LLM做
  - 分类
  - 情感分析
  - 风格化文本生成
  - ...
  
  LLM在这里起到的作用是一种有着多种用途的智能工具，我们传入其中的提示词是调整其行为的主要工具。这里所说的提示词，以及提示词工程的对象，往往都是系统提示词（system prompt），作为指导当前session下面大模型行为的一个基准，后续用户的输入则是对其正式的应用。

- 当下的LLM*不仅*被用作上述用途，还用来作为Agent来完成复杂的任务，例如编写代码、探索话题。这就不仅限于一次性的输出，而是一种持续进行的任务步骤，其中会有许多轮的模型输出。

  在这个过程中，上下文会不断增加，而模型的上下文不仅有限，其对上下文的注意力也会随着上下文的增大而不断衰减，因此我们必须对上下文进行组织和管理，才能让模型在长时间的执行中保持稳定和高质量的输出。

> Context engineering is the art and science of curating what will go into the limited context window from that constantly evolving universe of possible information.

## Why context engineering is important to building capable agents

研究表明，当上下文超过一定长度的时候，LLM会丧失其重点甚至出现一些不正确的理解。随着上下文的长度的增加，LLM从上下文中取出能力的信息会衰减，这种现象被称为上下文腐化（context rot）。所有的模型都有这种现象存在，只是一些能力比较强的模型可能衰减的较慢。

LLM和人类一样，其工作记忆是有限度的，称为注意力预算（attention budget）。任何输入到上下文中的token都会消耗这个预算。

这种预算根本上来自于现代模型采用的Transformer架构。在Transformer架构中，每一个token都可以参照所有的token（与之建立联系），如果有$n$个token，那么就有$n^2$个潜在的token关系对。随着上下文的增加，这种关系对的数量飞速增长，从而让上下文的长度与模型的注意力之间产生了天然的制约关系。此外，模型的训练数据中较短的模式比较长的模式更加常见，这就使模型更加“适应”短的文本，而没有太多专门的参数去应对长文本。

借助位置编码插值（position encoding interpolation）等技术，可以缓解大模型对于长文本的性能衰减问题，使得模型对于长文本仍然具备处理能力，但无论是召回精度还是推理能力都要差于短文本。

## The anatomy of effective context

> ... good context engineering means finding the **smallest** possible set of **high-signal** tokens that **maximize the likelihood** of some **desired** outcome.

这个原则实现起来比看起来要困难，主要有以下几个方面需要考虑到：

### 1. 系统提示词：at right altitude

> The right altitude is the Goldilocks zone between two common failure modes.

上下文工程里，提示词工程仍然重要。系统提示词的内容必须恰到好处，不能过于模糊，也不能太过于详细。

- Too specific：在提示词中硬编码许多逻辑（if-else）和规则，从而试图去规定Agent的行为。This approach creates fragility and increases maintenance complexity over time.
- Too vague：信息过于模糊或者笼统，或者假设一些知识模型已经知道（falsely assumes shared context），无法让模型给出希望的结果

处于一个恰到好处位置的提示词，能够高效地引导模型去完成目标，同时也不干扰模型的内驱（自我启发）。

文章建议在系统提示词中使用XML标签或者Markdown标题组织不同的部分。
> ... although the exact formatting of prompts is likely becoming less important as models become more capable.

最重要的一点是，应该尽可能使用能够表达目的的最精简提示词。精简不代表简陋，仍然需要提供足量的信息让Agent遵循。

在使用few-shot prompting的时候，我们不应该只去罗列一些边界情况然后期待大模型能够推理并完全理解这些例子，进而得出我们的完整意图。给的例子应该满足多样化（diverse）以及权威性（canonical）两个特点，这些例子能够准确地演绎大模型应该做出什么样的行为或者给出什么样的结果。可以将传给大模型的例子想象成胜千言的图片。

### 2. 工具：returning & encouraging the efficient

Tool 的设计应当遵循：
- 独立（self-contained）：不依赖外部的变量，对于相同的输入应该满足行为上的幂等性
- 鲁棒性强（robust to error）：出现错误的时候能够恢复或者给出详细的原因
- 专注其目的（extremely clear with respect to their intended use）
- 良好的参数设计
  - 清晰、有意义的参数名（descriptive, unambiguous）
  - 顺应模型所擅长的事情（play to the inherent strengths of the model）

常见的错误模式包括设计all-in-one工具或者花里胡哨的工具包，其功能过多、不够清晰，影响模型做决定。在某一特定情况下面对一组工具，我们不能指望Agent能够做出比人类更好的选择，如果连人类看了也不知道选哪一个的话，说明这是一组bad design。

## Context retrieval and agentic search

> Since we wrote that post, we’ve gravitated towards a simple definition for agents: **LLMs autonomously using tools in a loop.** ... Working alongside our customers, we’ve seen the field converging on this simple paradigm. 

至少在这里，一个对Agent一词的简单定义是：能够在执行的循环中自主地使用工具的LLM。LLM的能力越强，其自主性就越强，例如可以探查一些细节问题，或者从自己造成的错误中正确地恢复。

> Today, many AI-native applications employ some form of embedding-based pre-inference time retrieval to surface important context for the agent to reason over.

在实践中，许多应用都提前准备了一些context（在这里，可认为是背景知识、文档等供AI参考的内容），在Agent开始运行之前检索出来然后供其参考。文章这里所说的这种路径其实就是RAG，虽然其名字里面只字未提到向量，但许多人将RAG中的R默认为基于向量的检索。文章这里所说的也是这种基于向量的检索。基于向量的检索背靠的是vector DB这种类型的产品，对数据的预处理不可避免，且其检索的过程不一定是轻量的，甚至可能很耗时，所以只能发生在pre-inference时。

随着这部分技术向“更agent”的（more agentic）方向迁移，越来越多的人开始拓展到一些just-in-time策略，也就是Agent在执行的过程中可以直接调用的那些搜索手段。这与前者的不同是，这是Agent在自己操作上下文。

在这里我不禁思考，为什么RAG不能算是一种agentic方式呢？我认为，一是RAG不够原生，i.e. 其不仅需要部署，还需要对接vector DB接口，二是有一定规模的RAG是很重型的系统，用在一个需要快速迭代的agent loop中不是很合适。

使用just-in-time策略的Agent，其内部维护的检索目标只是一系列很简单的标识符，例如指向网页的链接、指向本地文件的路径以及缓存的query。这些标识符消耗的token很少，却是实实在在的对外部资源的引用，通过调用Tools，Agent可以从外部获取到指定的资源并将其包含在自己的上下文中。

> Anthropic’s agentic coding solution Claude Code uses this approach to perform complex data analysis over large databases. The model can write targeted queries, store results, and leverage Bash commands like head and tail to analyze large volumes of data without ever loading the full data objects into context.

虽然在这里提到的是Claude Code，但目前几乎所有的AI coding agent都可以做到类似的功能：使用本地的bash命令去像人一样访问文件系统中的文件，利用`head`和`tail`去截取文章的内容，还有`echo ... |`、`rg`、`sed`、`awk`、`ls`等等人类常用的命令。

> This approach mirrors human cognition: we generally don’t memorize entire corpuses of information, but rather introduce external organization and indexing systems like file systems, inboxes, and bookmarks to retrieve relevant information on demand.

到这里，Agent的设计就很像人了——使用人类会使用的bash command，以及像人一样去组织信息而不是将信息全部记下来（放到上下文中）。

让Agent自行探索还有一个好处是，它可以按需地构建对自己有用的上下文。在探索的过程中遇到的内容都是对Agent的提示，例如
- 路径中包含的信息可以让Agent知道这个目标文件属于工程文件中的哪一个模块（通过目录名称）或者哪一类数据（文件名称、格式等）
- 对于代码中的标识符，一些naming convention也能在Agent没有读取对象之前就了解到它的一些基本信息，如Go中首字母大写就可以说明是exported还是unexported，以及OOP语言中常见的getter/setter等
- 文件的大小可以直接揭示这个文件的复杂度如何
- 文件的时间戳可以让模型推知这个文件是否与当下决策有关等信息

> This self-managed context window keeps the agent focused on **relevant subsets** rather than drowning in exhaustive but potentially irrelevant information.

让Agent自行探索的trade-off在于：
- 相当于将一些检索的工作留在了运行时，这种迭代探索的过程的时间不确定，且大概率是长于一般的RAG的
- 需要有一定精心设计（opinionated and thoughtful engineering）才能让LLM拥有适合这些任务的tools以及足够的内驱

如果没有合理的引导，Agent会浪费掉上下文：错误地使用tools、不断地探索死局（chasing dead-ends）、无法辨认关键信息等。

为了平衡，一个自然的想法是混合策略，将pre-inference的召回和agentic search联系起来，其中前者是考虑了一定的先验以后，用于加速Agent获取完整上下文而提前注入的内容，后者是让Agent根据自己的需要再去灵活地补充额外内容。后者的比例越大，Agent的自主性就越强，至于应该是什么样的比例和强度，需要根据具体的任务来判断。

文章在这里提到了Claude Code是怎么使用这种hybrid strategy的。CLAUDE.md这个文件会被直接放入到上下文中作为基础，Agent在运行的过程中再去glob和grep。大多数coding agent也应该能完成类似的功能。

> Claude Code is an agent that employs this hybrid model: CLAUDE.md files are naively dropped into context up front, while primitives like glob and grep allow it to navigate its environment and retrieve files just-in-time, effectively bypassing the issues of stale indexing and complex syntax trees.

:::tip What is glob / grep?
grep是shell下的一个常用的指令，用于根据内容去搜索文件或者输出的内容。这是一个非常契合当下coding agent需求的工具，它已经存在了五十多年。

glob是一个术语，在这里指的是在命令行中使用通配符的行为。在命令行中，使用`*`、`**`、`?`三个通配符可以用来指代文件名的一些部分，进而搭配指令完成批量的操作。需要注意这些符号与其在更加熟知的正则表达式中的含义不相同，glob比正则表达式要更简单。
:::

这种混合的策略一般适用于一些内容不经常变动的领域，例如法律和金融。随着模型的能力越来越强，在以后或许这种混合策略中的人工干预的需求会更好，agent的自主性会不断增强。团队在这里给出的建议是：“do the simplest thing that works.”

## Context engineering for long-horizon tasks

> For tasks that span tens of minutes to multiple hours of continuous work, like large codebase migrations or comprehensive research projects, agents require specialized techniques to work around the context window size limitation.

在一个长程任务中，虽然上下文会满，但Agent仍然需要在多轮操作以后保持连贯性、目标以及关键信息不变。这就需要解决上下文窗口带来限制的方法。

一个最简单的方法就是等模型的上下文变大，然后去用上下文窗口更大的模型。但是，上下文污染以及信息相关性等问题并不是因为上下文窗口的增大而被消除。我们仍然需要方法去克服这些问题，而不仅仅是考虑上下文的长度。

### 1. 上下文压缩（Compaction）

上下文压缩是指，将上下文窗口限制附近的一串对话（a conversation nearing the context window limit）提出来，总结成一段精练的文本以后放入一个新的上下文窗口中重新开始。压缩的过程十分看重原本内容的含义（in a high-fidelity manner），其目的是让Agent能够保持连贯的同时，有着最小的性能衰减。

在Claude Code中，压缩是通过将对话记录传给模型进行总结，提炼出最关键的细节。工具调用的输出是多余的，在这个过程会被移除。

> The model preserves **architectural decisions, unresolved bugs, and implementation details** while discarding redundant tool outputs or messages. The agent can then continue with this compressed context plus the five most recently accessed files.

压缩的精髓在于选择删掉什么，留下什么。过于激进的压缩会导致一些细微但是仍然重要的细节的丢失，这些细节可能对于后续的决定仍然至关重要。文章建议在复杂的Agent流程中去验证和调整用于总结的prompt，从包含所有相关信息从而提高召回率（recall）开始，再慢慢地剔除一些冗余信息来提高精度（precision）。

最明显的可以被提出的冗余信息就是工具调用的输出，这也是最安全、最轻量化的compaction方法——直接去掉工具调用的输出算作一次compaction。

### 2. 结构化笔记（Structured note-taking）

结构化笔记又称Agent记忆（agentic memory），是指模型会定期地对当前情况进行记录，然后将存储这些记忆的文件放在上下文窗口之外的地方（比如本地），等到需要的时候再放入到上下文中。我观察到GitHub Copilot在plan的时候就有对这种memory file的读取和写入。plan在底层可能是特殊的提示词以及强制生成一个memory file供参考的设计。

> This strategy provides persistent memory with minimal overhead.

这种方法相当于将一些信息存储在了上下文窗口外部，构建一个属于agent自己的知识库，用于按需取回（似乎这里又引入了召回的问题，但这里的召回肯定倾向于简单且agentic的方式）。这种方法还有一个优势是，当笔记做的够多够详细时，上下文可以在新开的窗口中复现。这也是这种方法的底层逻辑所在。

### 3. 子Agent架构（Sub-agent architectures）

在这种架构下面，一个主agent（main agent）可以发起几个子agent去独立完成工作，每一个子agent都有完全互不干扰、全新的上下文，从而避免了信息集中于main agent的单个上下文。

子agent完成任务后，其返回给主agent的是非常精练的总结，对于英文大概是1K-2K tokens。主agent在这个过程中主要起到调度、分配任务、组合和分析任务结果的作用。

子agent的另一个好处是可以并行进行，提高效率。

### 总结

基于任务的特征，我们选择不同的方法用于应对超越上下文的长程任务。

|任务特点|方法|
|:-:|:-:|
|需要反复来回迭代|Compaction|
|具有清晰的目标，迭代开发|Note-taking|
|复杂的调研，适合并行|Multi-agent|

## Conclusion

> As models become more capable, the challenge isn't just crafting the perfect prompt—it's thoughtfully curating what information enters the model's limited attention budget at each step.

随着模型的能力逐渐提升，我们要考虑的就不仅仅是如何设计一个简单的提示词，而是如何组织每一步进入到模型有限注意力中的那些信息，这是在LLM在加上了应用框架成为Agent之后的一个必然需求。无论使用哪种方法，context engineering的一个根本目的不会改变：“find the smallest set of high-signal tokens that maximize the likelihood of your desired outcome.”

## Maybe, simplicity is the key

读完这篇文章以后，我注意到许多词眼被反复提及：simple, minimal, smallest...这些词语有些常常与maximize, desired output等搭配。我们希望用最简单的可能（simplest possible）输入，换得最完美的输出。简单不代表简陋、投入少，重点在于possible这个词语，究竟其限度在哪里，这个探索的过程没有那么简单。

有的时候，简约比复杂更难。