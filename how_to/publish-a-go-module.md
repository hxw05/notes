# 发布一个 Go module

:::warning 前置条件
- 使用git作为VCS
- 使用github.com托管代码
- 开源
:::

发布一个Go module的含义是让其能够被`go get`指令获取（从而import到其它人的项目中），同时在pkg.go.dev上展示其文档。

- 官方文档：https://go.dev/doc/modules/publishing

在开始发布的流程之前，注意完成下面的TODO：
- 运行`go mod tidy`来消除代码中的模块冗余
- `go test ./...`或者`go build`验证代码没有明显的编译错误
- 检查`go.mod`中的module name是否符合标准（如github.com/YourName/YourRepository）
- 项目添加了一个redistributable license，例如MIT。如果没有license或者不是redistributable，那么pkg.go.dev不会显示代码文档
- 项目代码已经准备好发布，不需要更多的修改了

发布的流程本质上就是在项目中创建一个tag并通知pkg.go.dev去获取。下面为了方便，将目标module name记作`github.com/example/example`，目标版本号记作`v0.0.1`。

1. 为项目打一个tag，使用`git tag v0.0.1`的格式进行。
    
   这里需要注意版本最好遵循semver并且以v开头，否则可能在`go list`这一步遇到 no matching versions for query "..." 的错误。
2. 在远端创建这个tag
   ```sh
   git push origin v0.0.1
   ```
   这个push步骤与当前分支的push不冲突，之后正常使用`git push origin main`即可
3. 执行go list
   ```sh
   GOPROXY=proxy.golang.org go list -m github.com/example/example@v0.0.1
   ```
   如果成功，该指令会回显：
   ```
   github.com/example/example v0.0.1
   ```
   如果遇到国内网络环境无法连上proxy.golang.org的情况，可以参考这个repo：https://github.com/goproxy/goproxy.cn/blob/master/README.zh-CN.md

完成这三步，就完成了一个Go module的发布。可能需要等待几分钟才能在pkg.go.dev上面看到最新的tag。第三步还可以替换为直接在浏览器中访问`https://pkg.go.dev/github.com/example/example@v0.0.1`然后点击页面上的Request按钮。

## 修订版本（仅git）

如果发现某个tag中包含错误，可以通过替换tag来达到。需要注意的是git中的tag一般一旦确定就不应该再改变，并且此操作不影响pkg.go.dev上面已经抓取的tag（可以认为pkg.go.dev上抓取的tag就是不可变的），仅当实在有必要时才采用此措施。

- 删除一个tag
  ```sh
  git tag -d v1
  ```
- 强制将一个tag指向一个提交
  ```sh
  git tag -f v0.0.1 29cfa2ba55c6f19ed5071ce787296ad8a960eeb8
  ```
  ```sh
  git push -f origin v0.0.1
  ```