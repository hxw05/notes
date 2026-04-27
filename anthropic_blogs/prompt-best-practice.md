---
date: 2026/04/23
origin:
  link: https://claude.com/blog/best-practices-for-prompt-engineering
  title: Best practices for prompt engineering
  subtitle: Get better AI results with prompt engineering techniques from the team behind Claude.
  date: 2025-11-10
---
# 提示词工程最佳实践

:::warning 本文可能中英文混杂
原文是英文，而一些内容可能保留为英文更好理解，所以就懒得翻译了，请知悉。
:::

> Prompt engineering is the craft of structuring instructions to get better outputs from AI models. It's how you phrase queries, specify style, provide context, and guide the model's behavior to achieve your goals.

即使在上下文工程乃至驾驭工程流行的今天，提示词工程的作用仍然不容小觑，它是与AI交流的基础构建（essential building blocks）。

提示词工程可以用来泛指对提示词的优化步骤，其目的均是从模型那里得到更好的输出——一个契合我们目的的输出。一个模糊不清的提示词和一个清晰的提示词之间最直观的差别，就是前者往往需要来回询问多次才能得到答案。这个过程还有副作用：多次对同一个问题的询问成为了一种变相的讨论，这会导致模型向上下文注入许多本不需要的冗余信息（部分来自于AI习惯性的顺从、过度解答带来的冗余）。

这篇文章主要介绍了Claude团队在提示词工程方面的最佳实践。

## How to use prompt engineering

最最基础的提示词工程发生在你向LLM传递的那一段话里面，简单来说就是不断对发给AI的话进行修改，但具体要修改哪些内容，该如何修改，是这里的重点。下面几条是这里的核心（core techniques）：

### 1. 确切且清晰（Be explicit and clear）

> Modern AI models respond exceptionally well to clear, explicit instructions. Don't assume the model will infer what you want—state it directly. Use simple language that states exactly what you want without ambiguity.

一个清晰的提示词更适合当下的AI模型去解读。当你的脑袋里有一个具体的目的时，不要假设模型能够猜出这个目的，直接在提示词里面描述出来会更好。这里的一个原则是**把你想要的结果长什么样子（what you want to see）告诉模型**。

例子：让模型帮你写一个显示数据的后台页面。
- 不清晰的提示词：Create an analytics dashboard
- 清晰的提示词：Create an analytics dashboard. Include as many relevant features and interactions as possible. Go beyond the basics to create a fully-featured implementation.

相比起来，后者确实更加清晰，但是从开发者的角度来看，这样做并不一定能够达到目的。

面对一个具体的页面，需要考虑的细节太多太多，而这里所写的第二个提示词没有涉及细节，只相当于限制模型的想象空间以及为模型提出一个确切的验收要求，而不是让模型自己决定去做到怎样的程度。不过对于非技术人员来说，这样来演示优化的方向也已经足够了。总之，其实这里最根本的一个原则是，你向模型提供的这些内容*大概率*属于某种需要模型遵守的不变量（大模型的性质决定了不是绝对不变，因此还需要更多手段去维持这些规则的稳定性），而没有提供却会涉及到的部分则完全交给模型自行想象。它想象的依据可能是它被告诫的常识或原则，也有可能是它的奇妙函数回路。如果这部分想象空间太大，往往会超出你的预料。当想象空间过于大时，这个过程就退化成了抽卡。

文章在这里列出了一些写提示词的建议：
1. 以动词开头，如创建、分析、生成等
2. 开门见山（意思大概是不要向模型说你好，一些不必要的背景信息也可以不加）
3. 不要只说要干什么，还要包括最后想要什么样的结果
4. 尤其关注对于质量以及程度（深度）方面的要求，要说出来

我不知道他们对这些建议做了多少定量的实验以及得出了怎样的结论，但出于他们是Claude团队，作为一个参考应该还算不错。

### 2. 提供完整的上下文以及你为什么要这么做（Provide context and motivation）

在提示词里面解释你为什么想让模型这么做，可以让模型更好的理解你的目标，产生更加贴合目标的结果，这对于一些具有推理能力的模型更加有效。

> This is particularly effective with newer models that can reason about your underlying objectives.

例如，我们希望大模型的输出不要太有AI味，不要附加那么多Markdown格式，导致复制到哪里都是一眼AI，同时也不是很容易阅读。拿无序列表（bulleted list）来说，我们要让大模型输出的时候不要去列这个表，该怎样表达？

- 不太有效的提示词是：禁止列表（NEVER use bullet points）
- 更有效的提示词是：I prefer responses in natural paragraph form rather than bullet points because I find flowing prose easier to read and more conversational. Bullet points feel too formal and list-like for my casual learning style.（解释原因，喜欢自然段是因为我觉得更易读、更像是在谈话，而无序列表让人感觉太过于正式了）

给出你的理由之后，模型就能够做出更好的选择。

随时考虑以下场景来为你的提示词添加上下文：
- 可以解释你想让模型输出的内容的受众以及要拿来做什么
- 解释一下为什么你要添加这条规则/限制条件
- 描述一下结果最终是如何投入使用的
- 指明你想要解决什么问题

### 3. 具体（Be specific）

让提示词更具体，靠的是在提示词里面附加一些明确的指导性和要求性的内容。
> The more specific you are about what you want, the better the results.

- 模糊的提示词：帮我创建一份地中海饮食的食谱
- 清晰：Design a Mediterranean diet meal plan for **pre-diabetic management**. **1,800 calories** daily, emphasis on **low glycemic** foods. List **breakfast, lunch, dinner, and one snack** with **complete nutritional breakdowns**.

下面的这个提示词就要具体非常多，加粗的部分都是模糊提示词中不具有的信息，虽然都表达了同一个目的：我需要一份地中海饮食的食谱。这些你附加的具体细节还是要根据具体需求进行添加，能够写出这些具体细节的前提是你需要有一个非常明确的目的，**你知道自己想要什么**。例如，你应该明确
- 每天吃1800卡路里，这个数字来自于你（无论是你自己知道，还是搜索，还是其他，比如问AI？）
- 你想要低升糖指数（low glycemic）的食物
- 除了三餐，你还有一顿小吃
- 你想要完整的营养素信息（complete nutritional breakdowns）
- ...

那么如果以上什么都不知道呢？也想让AI给你一个这样的食谱怎么办呢？这里的考虑和第1条里提到的很像——只要是你没有提供的，就是AI的想象空间。如果连最起码的性别、BMI等等与个人食谱紧密相关的信息也没有提供，一旦遇上不具备反问能力的AI（当前国内大多数），它给出的内容大概率对你毫无意义。

要让一个提示词更加具体，考虑添加
- 清晰的限制条件，如字数、格式、时间线
- 相关背景信息，如受众、目标
- 希望的输出格式，如段落、列表、表格
- 要求以及限制，如预算、技术细节

### 4. 举例（Use examples）

> Examples aren't always necessary, but they shine when explaining concepts or demonstrating specific formats. ... examples show rather than tell, clarifying subtle requirements that are difficult to express through description alone. ...

对于一些细节，有的时候我们把它描述出来可能会很费力气甚至不可能，即使描述出来，可能对于模型来说也不是很好理解。在这里自然想到的一个解决办法是给模型举例子，这和我们与其他人沟通新概念时候的方法很类似。

这个地方有一个名称需要了解：*-shot prompt（X样本提示词）。上面没有涉及到例子的提示词都属于零样本提示词（zero-shot prompt）。单样本提示词（one-shot prompt）就是提供了一个例子的提示词，小样本提示词（few-shot prompt）就是提供了一个或多个例子的提示词。

*文章在这里指出了一个注意事项，Claude 4.x系列的高级模型非常注重提示词提供的例子中的细节，所以需要确保这个例子确实是我们想要的那种，并且尽量在例子中不要包含一些我们不希望产生的模式。*

假如我们想让模型帮忙总结一篇文章，零样本提示词就直接是：帮我总结这篇文章。这个时候输出的格式就是五花八门，虽然都是在总结文章。如果我们想要某种特定的格式，最好举一个例子：

```
下面是我想要的内容总结的格式：

文章：[一篇关于AI合规文章的链接]
总结：欧盟通过一项针对高风险系统的综合性人工智能法案。主要条款包括透明度要求和人工监督机制。该法案将于2026年生效。

请你相同的格式总结这篇文章：[指向当前文章的链接]
```

下面的情况适合举例子：
- 举例子比描述起来更容易
- 需要某种确切的语调或者文风的时候（相当于上一条）
- 涉及到一些微妙的模式或习惯
- 不举例子无法产生一致的结果

> **Pro tip:** Start with one example (one-shot). Only add more examples (few-shot) if the output still doesn't match your needs.

文章在这里指出，从one-shot开始，根据输出质量缓慢增加。

### 5. 允许模型表达自己的不确定性（Give permission to Claude to express uncertainty）

这一条的标题里面写的是Claude，所以我怀疑这一条并不通用，需要模型有**准确表达**自己的真实的不确定性的能力（而不是生成不确定性、刻意提出）。

在提示词里面告诉AI，要表达自己的不确定性而不能猜（express uncertainty rather than guessing），这样能够减弱模型的幻觉。

- 例子：Analyze this financial data and identify trends. **If the data is insufficient to draw conclusions, say so rather than speculating.**

## Advanced prompt engineering techniques

> Advanced prompt engineering techniques shine when you're building agentic solutions, working with complex data structures, or need to break down multi-stage problems.

一般情况下以上五条已经足够用了，但在面临复杂的数据结构或者构建Agent的时候，就需要考虑一些更加高级（sophisticated）的方法。下列方法不分先后，且它们之间往往没有直接关系，一般根据具体需要单独拿出来使用。

### 预填充response（Prefill the AI's response）

如果希望AI能够输出结构化的数据、不需要AI给出对话性的答复、维持AI的某种语气、让AI以某个固定的开头开始回复等等，可以对AI的response进行预填充，AI会从这个填充的位置开始生成。

```python
messages=[
    {"role": "user", "content": "Extract the name and price from this product description into JSON."},
    {"role": "assistant", "content": "{"}
]
```

如果不进行这种限制，虽然同样能给出JSON的结果，AI可能会附加一些对话性答复，例如“这是我为你生成的JSON：”，或者将JSON包围在代码块中。

如果不涉及到AI的编程访问，而仅限于在对话窗口中输入，可以在提示词里面包含“只输出合法的JSON，不附加导言，请以一个左花括号开始回答”或者类似的话语去引导模型这样做，但不如直接预填充response可靠。实操中，通常两个结合起来。我记得阿里云百炼在结构化输出文档中提到不仅要有相关配置，提示词中的引导也是必要的。

### 思维链（Chain of thought prompting）

> Chain of thought (CoT) prompting involves requesting step-by-step reasoning before answering. This technique helps with complex analytical tasks that benefit from structured thinking.

所谓引入思维链，最基本的就是在提示词里面加上这么一句话：一步一步地思考。文章指出Claude自带对拓展思考（extended thinking）的支持，这个过程是自动进行的，且比手动引入思维链更好，但在免费方案中并不适用😅。

何时需要引入思维链？
- 模型不支持extended thinking
- 你希望看到思考过程
- 任务需要多步分析来完成
- 你想要确保AI考虑到了一些因素

在提示词中引入思维链的几种类型
- 最基本的，带上一句“分步思考”的指示：Think step-by-step before you write the email.
- 引导性思维链（guided CoT）：让模型分步思考的同时，描述每一步要思考什么
  - Think before you write the email.
    - First, think through **what messaging might appeal to** this donor given their donation history.
    - Then, **consider which aspects of** the Care for Kids program would resonate with them.
    - Finally, **write** the personalized donor email using your analysis.
- 结构化思维链（structured CoT）：借助标签，让模型将思考的内容和输出的内容分离，类似于引导性，但多了标签这部分
  - Think before you write the email in **&lt;thinking&gt; tags**. First, analyze what messaging would appeal to this donor. Then, identify relevant program aspects. Finally, write the personalized donor email in **&lt;email&gt; tags**, using your analysis.

在提示词中引入CoT与模型的extended thinking能力不是互斥的，而是相辅相成的。

### 输出格式的控制（Control the output format）

> For *modern AI models*, there are several effective ways to control response formatting:

考虑到Claude的能力，这里的modern AI models很耐人寻味...

1. 告诉模型该做什么，而不是不该做什么

这一点我觉得在和模型写提示词的过程，做workflow的过程中或多或少能感受到。模型很容易听话——前提是这个“话”是正向的。一些复杂的提示词中对模型的一套套限制可能根本不管用。

- BAD: 不要用Markdown回复
- GOOD: Your response should be composed of **smoothly flowing prose paragraphs**

2. 让你的提示词和你预期的输出保持一致（AKA 以身作则）

比如，如果你不希望模型使用Markdown给你回复，那么你写提示词的时候最好也别用Markdown（例如用`**...**`去强调某个部分等等），否则模型依然可能有样学样。

3. 准确地说出你在格式上的那些要求

在这里文章给出了一个提示词，这个提示词的作用是让模型的输出不要大规模的使用Markdown，而只保留最基本的标题、代码，只在最有必要的时候列表。

```
When writing reports or analyses, write in clear, flowing prose using complete paragraphs. Use standard paragraph breaks for organization. Reserve markdown primarily for inline code, code blocks, and simple headings.

DO NOT use ordered lists or unordered lists unless you're presenting truly discrete items where a list format is the best option, or the user explicitly requests a list.

Instead of listing items with bullets, incorporate them naturally into sentences. Your goal is readable, flowing text that guides the reader naturally through ideas.
```

```
撰写报告或分析时，请使用清晰流畅的散文形式，并使用完整的段落。不同主题的内容的组织以段落与段落之间的隔断来表示。Markdown 只用于行内代码、代码块和简单的标题。

除非你要提供的内容确实最适合用列表来呈现，或者用户明确要求使用列表，否则不要使用有序或无序列表。

你应该首先考虑将列表项目自然地融入到句子中，而不是将它们用列表格式列出来。你的目标是编写易读流畅的文本，引导读者自然地理解文章内容。
```

我觉得这个提示词的目的很符合实际需求，其实还可以考虑加入禁止AI使用Emoji、粗体，甚至避免在数字、英文与中文之间加空格这个行为。我自己在生成一些文档内容的时候，一般用到的提示词比上面的提示词要简单，类似于下面这段话（`...`表示省略的内容）：

```
基本要求：请使用大段文字的形式呈现，中文与数字、英文之间不要带空格。
---
标题1
...
标题1.1
// 这里写一段话，要求 ...
...
标题n.n
// 这里写两段话，要求 ...
```

我觉得这段提示词的核心在于“大段文字”，这样AI就倾向于生成更多的内容，而不是抱着罗列、演示的目的去列一堆表和加一堆表情符号，让输出的内容只适合你自己看。实际生成出来的内容直接粘贴到Word里面，稍微修改一下内容和段落就可以用了。注意以上提示词没有包含对语气的定制。

### 链式提示词（Prompt chaining）

链式提示词或者提示词链注定不能在单个提示词里面实现，其基本步骤是将一个复杂的任务分解为多个单步，各个步骤按顺序执行，步骤的输出可以作为下一个步骤的输入（根据实际需要）。提示词链是一种trade-off，它延长了完成一个任务所需要的时间（和操作），换来的是更加精确和符合要求的产出。

> This approach trades latency for higher accuracy by making each individual task easier. 

对于这种模式，我有过一些零星的使用经历，所以在这里就不举文章中的例子了。PS：这是面对一个特定任务而自然想出来的方案，在此之前我没有参照这篇文章。

例如，我希望让AI帮我编写一次实验报告，这个实验报告必须以老师提供的实验指导书为基准，因为实验指导书确定了本次实验的具体内容。但是老师给出的实验指导书并不简单，甚至指导书里面全是图片/链接，此时我就觉得如果直接让AI根据这个指导书生成实验报告并不可靠。所以我将这个任务拆解成了三步：
1. 根据指导书的内容（图片、链接），整理出这次实验的完整内容
2. 以一个大学生的视角，模拟出进行本次实验的完整过程，以有序列表形式列出来，每一步的要求 ...
3. 根据以上实验过程，编写实验报告，实验报告要求 ...

将其拆解成三步，比起一步，生成的实验报告的优点是更加契合实际且覆盖了实验的完整内容，这样省去了很多修改的步骤。

在实际使用中，这种提示词链一般是通过编程或者workflow来实现的，不过正如我上面举的例子，在聊天框里面也可以手动实现。

> Each stage adds refinement through focused instruction.

提示词链的使用场景：
- 你有一个复杂任务必须分成多个步骤来完成。这里判断一个复杂任务需要分步是一个很重要的过程，并且如何分步也是一个问题。例如上面的例子中，我考虑到需要分步是因为老师提供的实验指导书的内容比较复杂（因为带有链接和图片，可以认为它是树状的），而将其分成这三步则是模拟了在现实中如果我要做这个任务，需要经历哪些必须的步骤。
- 你需要迭代优化（iterative refinement）结果
- 你正在进行多阶段的分析（multi-stage analysis）
- 中间的过程会添加参数
- 单一的提示词会导致不一致的结果（注意，这几乎对于任何复杂任务都是成立的）

## Techniques you might have heard about

> Some prompt engineering techniques that were popular with earlier AI models are less necessary with models like Claude. However, you may still encounter them in older documentation or find them useful in specific situations.

文章这里介绍的是一些“比较老”的prompt engineering方法，有了Claude它们就没什么需要了。果然，他们博客写的内容或多或少还是Claude本位的😄。

### 使用XML标签来表达结构（XML tags for structure）

在早期（多早？），XML标签被用来在提示词中添加结构，并且提升提示词的清晰度。如果你不知道什么是XML标签，可以理解为形如`<tag>...</tag>`这样包围的块，其中`tag`的位置填入的是一个英语单词，用来表示这一块的具体含义，例如我想表达这一块都是运动员信息，`tag`处就填入`athelete_information`，一定要是英文。

```
<athlete_information>
- Height: 6'2"
- Weight: 180 lbs
- Goal: Build muscle
- Dietary restrictions: Vegetarian
</athlete_information>

Generate a meal plan based on the athlete information above.
```

在以下情况使用XML标签：
- 你的提示词特别复杂，其中包含了很多种不同结构的数据
- 你需要百分百确定提示词中不同类型内容的边界
- 你在使用一些旧的模型

文章强调，对于现代模型来说，大多数情况下使用清晰的Markdown标题、空格以及明确的语言指示就已经足够，其带来的负担还比XML小。

### 分配角色（Role prompting）

在提示词里面告诉模型扮演一个什么样的角色，为这个模型提供了一个人格样板（通常是一个XX专家）。但现代模型已经足够先进了，这种方式显得没有必要。

eg. You are a financial advisor. Analyze this investment portfolio... 这里让模型扮演一个财务顾问

:::warning Important caveat

不要过度地约束这个角色。
- GOOD: You're a helpful assistant
- BAD: You are a world-renowned expert who only speaks in technical jargon and never makes mistakes.（你是一个全球闻名的专家，只谈论专业的技术且从不犯错）

过度约束会适得其反，导致模型可能没那么有用了。
:::

在以下场景中使用role prompting：
- 需要输出的语气一致
- 你的应用里面AI确实需要进行角色扮演
- You want domain expertise framing for complex topics（一些复杂的专业主题）

对于现代的模型，优化提示词的其他方面比说服模型扮演一个角色更重要，例如上面的提示词中，比起让模型扮演一个财务顾问，不如直接提出你想要从哪些方面分析问题。当然这就要求使用者具有这一领域的一定知识（i.e. 不一定要会分析，但要知道从哪里开始）。

- persona: You are a financial advisor. Analyze this investment portfolio...
- modern: Analyze this investment portfolio, focusing on risk tolerance and long-term growth potential

## Putting it all together

所有的方法都可以相互结合使用，达到相辅相成的效果。

> The art of prompt engineering isn't using every technique available—it's selecting the right combination for your specific need.

下面的提示词让模型从季度报告中提取出关键的财务数据，然后以JSON格式输出。其提示词设计用到了下列方法
- 具体的指示：我要到底要提取什么样的内容？关键的财务数据。
- 为什么我一定要JSON输出（上下文、理由）：因为我需要拿来做自动化，自动化就是代码，代码需要结构化的数据。
- 提供示例：JSON应该是什么格式，包含哪些字段，每个字段的内容如何

这里实际中还有一个数据类型的考虑。这里将字段类型直接全部写成了字符串。按照我个人的使用经验来看，我比较倾向于这种字符串加后处理的模式，而不是直接让模型生成一个特定的数据类型，除非这个字段的含义和这个数据类型的对应关系非常明确（尤其是对于布尔值字段，建议复杂的布尔值字段尽量后期推出来，而不是让模型直接给），否则会徒增复杂度但达不到准确的效果。

- 允许模型表达不确定性：如果报告里面不包含某部分数据，填null
- 格式控制：让模型以左花括号开始回复

```
Extract key financial metrics from this quarterly report and present them in JSON format.

I need this data for automated processing, so it's critical that your response contains ONLY valid JSON with no preamble or explanation.

Use this structure:
{
  "revenue": "value with units",
  "profit_margin": "percentage",
  "growth_rate": "percentage"
}

If any metric is not clearly stated in the report, use null rather than guessing.

Begin your response with an opening brace: {
```

## Choosing the right techniques

一个好的提示词不一定要用上以上所有方法，需求与对应的方法如下表
|需求|推荐的方法|
|:-:|:-:|
|简单任务|核心：清晰、具体、带有理由的提示词|
|特定输出格式|few-shot, response prefilling（如有条件）, 具体的格式提示词|
|复杂任务|分步，提示词链|
|推理|extended thinking, CoT|
|看到推理的过程（transparent reasoning）|结构化CoT|
|减少幻觉|允许模型说不知道|

## Troubleshooting common prompt issues

即使提示词经过精心设计，仍有可能产生预料之外的结果。一些常见的输出问题以及解决方法如下表

|输出存在的问题|解决办法|
|:-:|:-:|
|过于泛泛而谈（generic）|让提示词更加具体，附加一些示例，或者直接让模型给出更具体、全面的回答。告诉AI要go beyond the basics|
|脱离主题|让提示词更具体，提供上下文或理由|
|结果格式不一致|few-shot prompt（添加例子）和prefilling|
|结果不可靠|往往是问题太复杂导致的，需要分步，使用提示词链，且每一步的提示词都应该正确地完成其步骤|
|包含不必要的开头语|prefilling或者直接告诉模型不要添加这些话（Skip the preamble and get straight to the answer.）|
|编造事实|允许模型说不知道|
|为你提供建议而不是直接实施|让提示词更准确，表达你想要实施，而不是问AI这个怎么办/怎么解决之类的问题。不要让AI推断你想要实现的意图|

原则：
- 精简启动：最开始不要设计的太复杂
- 如无必要，勿增步骤
- 步步测试：每添加一项优化，就要验证是不是真的有用，否则引入额外复杂度的同时并没有起到作用，相当于倒退

## Common mistakes to avoid

下面列出了一些很容易犯的错误。

|误区|解释|
|:-:|:-:|
|用力过猛（over-engineer）|并不是所有任务都需要很长很复杂的提示词，且提示词越长、越复杂，其效果**不一定**就越好|
|不重视基础|基础不牢地动山摇的道理在这里仍然适用，最基本的清晰、具体要先做到，后续的高级方法才能起作用|
|认为AI有读心术|你想要什么，就告诉AI。如果留给AI的空间太大，AI很可能会有错误的理解|
|每次都用上全部的方法|应该选择性地使用那些真正能解决你问题的方法|
|不迭代|第一版提示词一般都难以达到目标，应该逐步测试并优化|
|依赖过时的方法|XML标签、大幅度的role prompting在现代模型上的作用较小，应该将重点放在清晰准确的指示上面|

## Prompt engineering considerations

### 长内容相关考虑

提示词工程往往倾向于向提示词中引入更多信息，无论是示例内容，还是多轮提示词，还是详细的提示词等，都会向上下文中引入信息，添加上下文负担（context overhead）并且消耗实在的token。这个时候就需要考虑对上下文进行管理。对上下文的管理也是一项专门的技能，更详细的牵涉到[Context Engineering](../anthropic_engineering/effective-ctx-engineering.md)。

为了避免无限制地引入信息，我们应该记住只有在这些方法真的有作用且适合这种场景时，才应该去使用它。

> **Context awareness improvements:** Modern AI models, including Claude 4.x, have significantly improved context awareness capabilities that help address historical "lost-in-the-middle" issues where models struggled to attend equally to all parts of long contexts.

这里所提到的lost-in-the-middle是一个经典现象，表示LLM总是对上下文中处于开头和末尾的信息更敏感，而难以去获取和利用处于中间的信息。这里提到*现代*的AI模型都大大提升了上下文理解能力（context awareness capabilities），大幅缓解了这个问题。

虽然有了这种提升，但是分解任务仍然重要，因为对任务的分解可以让LLM一步一个脚印，其每一步完成的任务都有一个专一的目标和明确的边界（a focused task with clear boundaries），这样能够产生质量更好的结果。反过来，一步登天，即精心调整一个prompt使得LLM一次性完成一个复杂的任务，往往生成质量不如分步。

### 一个好的提示词长什么样

提示词工程是一项专门的技能，在掌握之前需要一定的尝试。判断它有没有用的唯一方法就是去测试。

> The only way to know if you're doing it right is to test it and see. The first step is to just try it yourself. You'll see right away the differences between queries with and without the prompting techniques we covered here.

一些判定的维度：
- 结果是否符合要求
- 用这个提示词，可以一步到位还是需要多轮迭代
- 多个输出的格式是否一致
- 是否避免了上文列出的常见误区

## Final words of advice

文章在这里给出了对提示词工程的一个总结：

> Prompt engineering is ultimately about communication: speaking the language that helps AI most clearly understand your intent.

最好的提示词可以借助最少的方法来获取可靠结果以及达到你想要的目标。

> Remember: the best prompt isn't the longest or most complex. It's the one that achieves your goals reliably with the **minimum necessary structure**. As you practice, you'll develop an intuition for which techniques suit which situations.

对context engineering的转向并不代表着提示词工程就不重要了。提示词工程是上下文工程的基础。

> The shift toward context engineering doesn't diminish prompt engineering's importance. In fact, prompt engineering is a fundamental building block within context engineering.

## 个人阅读总结

第一次听说prompt engineering感觉已经是很久以前，似乎这个词语刚刚出现的时候就已经能够在网上看到有人在讨论。

起初我认为提出prompt engineering肯定是对software engineering、hardware engineering这类很成熟的学问名称的拙劣模仿——为什么写提示词也能成一门“工程”？但渐渐地，我开始承认或许不是必须要足够庞大才能叫一门engineering，以及提示词工程也是有壁垒的：只有开发模型的专业团队才有方法知道（他们的）模型该喂什么样的输入才更有效。

但我仍然不知道一个团队是如何给出所有模型的结论的，这之间有没有什么定量的实验或者成型的逻辑可供考察，以及所谓的现代模型（modern AI model）该如何定义，这是读完本文我主要的疑问。但都是AI领域了，就和大家一样，不要在意这些细节。

在没有读这篇文章之前，我有过一些编写提示词完成任务的经验，这些经验大都集中在让模型给出结构化的JSON输出上。我编写提示词的大致逻辑是，使用Markdown从头到尾编写内容和要求，用标题（`#`）去划分各个部分，可能包括背景介绍，名词定义，然后跟上模型的任务，就如同在和人类交流一样。最后然后告诉模型输出的JSON应该有哪些字段，叫什么名字，有什么含义，数据类型是什么。

我参考了当时无意间不知在哪里瞥见的一些practice，例如role prompting，也在开头加上了role prompting，而且也确实很自然地就over role prompting了，其实我自己心里也清楚这样没有什么作用。使用Markdown是因为觉得模型对Markdown的理解没有壁垒，毕竟模型就是“说”Markdown的。

例如下面这个我编写的系统提示词，是让模型根据给它的结构化数据进行判断，相当于一个判题助手：

```markdown
你是一个主观题评判专家，可以根据参考答案与题干内容，对考生答案做出正确的评判和详尽的解析。

# 用户输入
用户输入一定有以下几条：
1. 题干内容，描述了这道题的问题是什么。
2. 参考答案内容，描述了这道题的正确答案内容。
3. 考生答案内容，这是考生自主作答的结果，也是你所要分析的主要内容。

# 你的职责
你的任务是综合题干内容和参考答案内容，判断考生答案内容是否正确，并给出输出。

# 关于评判标准
考生答案是否正确，取决于答案叙述是否与题目有关，以及内容是否与正确答案相贴合。
如果答案与题意无关，但内容在客观上是正确的，仍然需要认定为错误答案。
认定一个答案正确，表明该考生可以获取这道题的全部分数，最终将体现在成绩上。

# 输出内容
必须以一个JSON对象的形式输出，输出必须以前花括号（{）开头。该对象的TypeScript定义如下
interface Output {
    is_correct: boolean; // 表示考生的答案是否正确。
    reason: string; // 给出正确或错误判断的理由。
}

# 字段说明
is_correct字段名称必须使用snake case，不得采用任何其他命名方式。其内容为一个布尔值，指示考生答案是否正确，如果是，就填true，否则填写false。
reason字段中，需要给出做出该正确或错误判断的理由。如果答案正确，理由叙述尽量简略一些。如果答案错误，请根据考生提供的答案、题意要求以及参考答案的叙述，给出考生答案为什么不正确的详细解析，以便考生日后改正。
reason字段中的语句，必须以客观视角展开叙述，不特指考生、教师或其他角色，只需论述事实即可。
```

综合本篇博文来看，这个提示词犯了包括但不仅限于下面的错误：
- 任务过于复杂，应该分步进行。这一点可以从用户输入看出来。单就用户输入的内容就有很多了，要是再和这个提示词混合起来，不敢想
- 有些过度role prompting：“主观题评判专家”这个role甚至模型可能根本不认识，后面的一些解释也是无关紧要的
- 没有给出理由，体现在一些对模型传达的限制条件上面，模型可能根本不会遵循
- 字段说明和输出要求分离，并且字段说明有些过于复杂，模型可能很难遵循
  - 要求名称是snake case，引入了冗余信息，其实只用说这个字段的key是`is_correct`就行了
  - 对各个字段的要求没有具体的理由
  - 布尔值字段不需要解释填入true还是false
- 引入了冗余信息，如TypeScript的interface定义。当时想到用这个来表示一个JSON，是考虑了下面的理由
  1. 与JSON几乎是对应的
  2. 能清晰地体现出各个字段的数据类型
  3. 可以通过写注释的方式紧挨在字段旁边给出解释
  4. 由于是编程语言模型可能更好理解
  5. 这是一个形式化的语言应该不会有歧义
 
  但现在来看，我觉得这个引入了无谓的外部语义，为模型理解内容增添了难度。其实只需要给出example形成few-shot prompt即可

也有一些当时就考虑到的点，与这篇博文中的一些technique不谋而合：
- “以便考生日后改正”给出了解析需要详细的理由。当时能写出这个后半句只是凭直觉
- 提出以JSON对象输出，并approximate了一下prefilling（以前花括号开头）

当时不知道模型可以直接response prefilling，所以这里只是用提示词逼近了一下效果。实际依赖的是OpenAI接口本身支持传入的extra_body。

结合博文的technique，可以做一些改进：
- 分步，这是最重要的一点
- 引入CoT和tag（也就是structed CoT），让模型给出一些分离的推理内容
- response prefilling和JSON prompt
- example
- ...

这篇博文给我带来的一个最大的收获是：**给AI提供你这样做、这样限制的理由。**先前我一直以为，由于AI只是一个机器，下了指令之后不需要特别的理由。这种思路本身没错，但是在实际的效果上面就可能不如给了理由的情况，因为AI看的是整个提示词。如果某个限制缺少理由，且这个限制比较脱离common practice，那么这就属于一种全新的信息，需要AI特别在它上面放置注意力才能有遵循的效果。但模型的能力不同，注意某个部分的能力就不一样。提供一个理由，可以让这条规则、这个限制、这个目的更加自然地嵌入AI的上下文中。个人理解，仅供参考。

虽然说这篇博文对我而言不是100%的可信，因为它缺少了很多定量的验证环节，但或许大模型的黑盒性质就是需要我们像NP问题一样去试探。这篇博文集中整理了一些他们觉得的best practice，确实是一个可用于实际的不错参考。

### 关于提示词迭代：一次让AI帮忙编写大篇幅文字有感

对于一个相对复杂的任务，提示词迭代是一个必经的过程，因为在这样的任务复杂度下，我们很难一次性地把事情（对AI）说清楚，一些我们包含的细节可能在AI看来又是另外一种理解。这并不是什么大问题，只要我们知道如何去迭代我们的prompt。

这里所需要的一个重要的个人能力就是能够从AI的输出中看出有哪些部分做得好，哪些部分有不足，以及如何将这些不足用文字表达出来。对于一些文字编写类的任务，这种分辨的能力尤为重要。

但如果我们的任务是一个长耗时、高成本或者一次性的Agent任务，其迭代成本较高或者不需要迭代，那么我们可能就需要考虑自行对输出的内容进行调整，例如一些细节、符号的使用等。这个时候就需要注重全面的事前调研、分布以及资料整理，从而尽量让AI能够一次给出一个大致令人满意的结果。