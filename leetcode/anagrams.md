---
desc: 给定一个字符串和一个模式，找出该字符串中所有模式的异位词的起点位置。
tags: window
---
# 438. 找到字符串中所有字母异位词

## 静态窗口

固定窗口大小为p.length，每一次统计窗口内的字母数量，比较是否与p的字母数量相符。如果遇到不在p中的字符，将窗口的左起点移动到该字符的下一个位置。此做法容易理解，可以在lc上AC，但是时间复杂度较高。

## 动态窗口（标准做法）

```js
var findAnagrams = function (s, p) {
    let left = 0;
    let right = 0;
    const aCode = 'a'.charCodeAt(); // 小写英文字母ascii起点
    const need = new Array(26).fill(0); // p中的每个字母个数，不存在为0
    for (let c of p) {
        need[c.charCodeAt() - aCode]++;
    }
    let kinds = 0; // 总共需要满足的字母种类数，例如p中有2个a，那么当s中找出了2个a后算作“满足了一个种类的字母”
    for (let cnt of need) {
        if (cnt > 0) kinds++;
    }

    const window = new Array(26).fill(0); // 当前窗口中的每个字母的个数，不存在为0
    let currentKinds = 0; // 当前窗口中满足的字母种类数

    const ans = [];

    while (right < s.length) {
        const d = s[right].charCodeAt() - aCode; // 新字符
        right++; // 扩展
        
        if (need[d] > 0) {
            window[d]++;

            if (window[d] === need[d]) {
                currentKinds++;
            }
        }

        // 本题此处的while相当于if，但标准解法仍然是while
        // 当 right-left===p.length的时候：
        // s=abcde p=abc
        //   ↑  ↑
        while (right - left >= p.length) {
            if (currentKinds === kinds) {
                ans.push(left); // 记录一个符合要求的起点下标
            }

            // 准备收缩

            const d1 = s[left].charCodeAt() - aCode;

            if (need[d1] > 0) {
                // 减少当前收集到的字母种类数
                if (window[d1] === need[d1]) {
                    currentKinds--;
                }

                window[d1]--;
            }

            left++; // 收缩
        }
    }

    return ans;
}
```