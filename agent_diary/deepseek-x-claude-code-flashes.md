# 在 Claude Code 里使用 DeepSeek 的一些剪影

此页面用来记录一些在Claude Code里使用DeepSeek过程中遇到的小细节。

## 在recap里面展示残存的思维链

只遇到过一次，应该是模型将宿主机和Guest弄混了。但为什么会出现在这里呢...

![](deepseek-x-claude-code-flashes/deepseek-shows-though-chain-in-claude-code-recap.png)

## 模型说理解应该是真的理解

很多时候模型都只会按照提示词照做，也不会质疑什么，这是LLM本身的性质决定的。但如果模型能够主动说它理解了是什么意思，或许就可以说明这一次信息传达得很成功。例如在一个plan的过程中，我希望代码中不要出现一些magic比较，而是将这些比较封装成有语义的函数，先后让它修改了两次plan，它的回复依次是：
- Good idea — that's a cleaner API. Let me update the plan. [...] The monitor then just calls [...] — clean and self-documenting.
- Good call — no magic string checks scattered around. [...] The magic string is confined to one file.

两次回复的特点都是它能够从你给它的修改目标中得出这次修改的目的，例如cleaner API或者no magic string checks。