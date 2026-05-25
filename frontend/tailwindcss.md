# Tailwind CSS 的一些 usage pattern

## `@theme` or `:root`

这一点在[官方的文档](https://tailwindcss.com/docs/theme)上解释的很清楚，在二者中都可以定义全局的CSS变量，区别是前者可以让变量与tw自身结合起来使用。
```html
<div style="background-color: var(--color-mint-500)">
  <!-- ... -->
</div>
```

> Use `@theme` when you want a design token to map directly to a utility class, and use `:root` for defining regular CSS variables that shouldn't have corresponding utility classes.