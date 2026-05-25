# Tailwind CSS 的一些 usage pattern

## 用 `@theme` 还是 `:root`

这一点在[官方的文档](https://tailwindcss.com/docs/theme)上解释的很清楚，在二者中都可以定义全局的CSS变量，区别是前者可以让变量与tw自身结合起来使用。
```html
<div style="background-color: var(--color-mint-500)">
  <!-- ... -->
</div>
```

> Use `@theme` when you want a design token to map directly to a utility class, and use `:root` for defining regular CSS variables that shouldn't have corresponding utility classes.

## 为什么不建议使用 `@apply`

*虽然挺好用的。*但是`@apply`不具备复用机制，相当于是在以一种简化的方式去写纯CSS代码，而这些代码之间没有任何复用。缺少复用是违背引入Tailwind的初衷的，因此不推荐使用。当然对于规模较小或者需要用到定义的token时是可以使用的。