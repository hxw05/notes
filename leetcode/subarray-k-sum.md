---
desc: 返回一个数组中和为k的子数组的个数。
tags: psum,hash
---
# 560. 和为 K 的子数组

```js
var subarraySum = function (nums, k) {
    const pre = new Array(nums.length + 1);
    pre[0] = 0;
    for (let i = 0; i < nums.length; i++) {
        pre[i + 1] = pre[i] + nums[i];
    }

    // m用来记录在j之前的某个前缀和出现的次数，初始化为0出现了1次（因为pre[0]=0）
    const m = { 0: 1 }
    // pre[j] - pre[i] === k (j > i >= 0)
    // => 寻找 (i,j), j>i>=0 使得 pre[i] === pre[j] - k
    // 注意j的起点是1
    let ans = 0;
    for (let j = 1; j <= nums.length; j++) {
        const target = pre[j] - k;
        if (m[target] !== undefined) {
            ans += m[target];
        }
        m[pre[j]] ? m[pre[j]]++ : m[pre[j]] = 1;
    }

    return ans;
};
```

注意以下几点：
1. $pre[i]-pre[j]=k \Rightarrow pre[i]=pre[j]-k (j\gt i \geq 0)$，注意此时j是从1开始的
2. pre[0]表示前0个元素的和，为0；需要直接记录在m中，即值为0的前缀和（至少）出现了1次（也可能出现更多次）。
3. for循环变量最好用j来命名，j在此处有双重含义：
   1. 作为i，此时增加m中的前缀和计数
   2. 作为j，此时寻找符合条件的计数，累加，得到更新后子数组的个数

另有一种边构造前缀和边寻找解的写法，代码更简单，但不好理解。