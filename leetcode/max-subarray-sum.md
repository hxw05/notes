---
desc: 求一个数组中的最大子数组和。
tags: dp
---
# 53. 最大子数组和

动态规划，记`dp[i]`表示以第i（从0开始）个元素结尾的最大子数组和，那么状态转移方程为

$$ dp[0]=nums[0], dp[i]=\max\{dp[i-1]+nums[i],nums[i]\}, i>0 $$

注意最后要统计dp的最大值而不是`dp[n-1]`。

```js
var maxSubArray = function (nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  // dp[i]表示以第i个元素结尾的最大子数组和
  const dp = [nums[0]];

  let ans = nums[0];

  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
    if (dp[i] > ans) ans= dp[i];
  }

  return ans;
};
```
