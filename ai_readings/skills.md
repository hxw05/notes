# Skills

## 何为Skill & Skill解决了什么问题

**何为Skill**：Skill是一个封装了领域知识的文件夹。按照规范，其至少由一个SKILL.md构成。

**Skill解决了什么问题：**现代Agent的能力不断提升，但对于真实业务场景，Agent往往缺少上下文，这使得其无法*可靠地*完成工作。

Skill的作用是为Agent补齐这类领域上下文，并提供相关的工具和材料，帮助Agent更好地完成工作。

**Skill为Agent带来了什么：**
1. 领域知识：体现在提示词、scripts、assets中
2. 可复用的流程：可以将需要多步完成的工作在Skill中描述为标准的工作流
3. 跨Agent产品通用性

## Agent如何读取Skills

```mermaid
flowchart LR
A[Discover: name, description]
B[Activation: SKILL.md]
C[Execution: references, scripts, assets, ...]
A -->|决定| B --> C
```

通过**渐进式披露（progressive disclosure）**过程，分为三步：
1. 发现：Agent初始只能看到Skill的基础信息：name和description，它们来自于SKILL.md的frontmatter
   - name：是该Skill的唯一标记
   - description：描述了该Skill能够完成的工作，是主要的判断依据
2. 激活：若Agent判定此时确实应触发该Skill，则将其激活，Agent将全量读取SKILL.md的内容
3. 执行：Agent根据Skill中的指示，继续选择性地读取参考（references）或执行脚本

## SKILL.md的frontmatter

SKILL.md必须包含一个frontmatter，字段如下：
- name（必填）：kebab-case的Skill名，一般控制在64个字符内。规范要求严格遵循kebab-case，不允许有大写字母、出现`--`或以-开头或结尾
- description（必填）：用于描述**①这个Skill是做什么的 ②何时需要用到此Skill**，一般控制在1024个字符以内
- license：许可证，或对许可证文件路径的描述
  - eg. Apache-2.0, MIT
  - eg. Proprietary. LICENSE.txt has complete terms
- compatibility：描述该Skill对环境要求，仅当Skill对环境有明确要求时使用
  - eg. Requires git, docker, jq, and access to the internet
- metadata：用键值对表示的规范外元数据
- allowed-tools：默认允许使用工具的列表，以空格分隔，这是一个非标准化字段

## 目录

- scripts：存储确定性的逻辑或流程。脚本的职责应该分明，对于存在依赖行为的，需要有准确的描述；对于错误应当优雅处理；应当提供良好的结果或报错返回
- references
- assets：模板、图片、数据文件等

## 渐进式披露相关建议

|级别|内容|建议限制|
|:-:|:-:|:-:|
|Catalog|name和description|<100 tokens|
|Instructions|SKILL.md|<500 lines, <5K tokens|
|Resources|其余文件|建议职责明确|

## 文件间指代方式

按照规范，在提示词中引用其它文件时，路径应相对于Skill根目录，且不建议路径过深。

- references/REFERENCE.md
- scripts/extract.py
