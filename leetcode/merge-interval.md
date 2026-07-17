---
desc: 给定一系列区间，将其合并。
tags: sort
---

# 56. 合并区间

排序后，选中某一个区间，向前看尽可能合并，合并完毕后，从最后被合并的那个片段的下一个位置开始。排序确保了这个过程是不重不漏的。

```js
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
  if (intervals.length === 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  let current = 0;
  const ans = [];
  while (current < intervals.length) {
    let left = intervals[current][0];
    let right = intervals[current][1];
    let p = current + 1;
    while (p < intervals.length) {
      let l = intervals[p][0];
      let r = intervals[p][1];
      if (l > right || r < left) break;
      // 后一个等号可不带
      if (l >= left && r >= right) {
        right = r;
        // 前一个等号可不带
      } else if (l <= left && r <= right) {
        left = l;
      }
      p++;
    }
    ans.push([left, right]);
    current = p;
  }
  return ans;
};
```
