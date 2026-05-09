# 主题：非阻塞通信

在一个TaskContext上有下面的这个函数，用于任务过程中信息的输出，这一信息会使用结构体包装后，送到TaskContext上的outputChan通道上。如果此时TaskContext的底层上下文已经结束，那么这个函数的调用应该没有效果。以下代码是AI生成的写法。

```go
func (tc *TaskContext) println(msg string) {
	select {
	case <-tc.ctx.Done():
		return
	case tc.outputChan <- TaskOutput{
		Step:   tc.step,
		Output: msg,
	}
    }
}
```

结合select语句在遇到多个可执行的分支会随机选择其一进行执行这一特点，由于`tc.ctx.Done()`的receive和`tc.outputChan`的send可能均不阻塞，以上代码其实并不能确保“如果遇到底层上下文结束，就不向outputChan发送信息”的约定。此时，考虑修改为两个非阻塞通信：

```go
select {
case <-tc.ctx.Done():
    return
default:
}
select {
case tc.outputChan <- TaskOutput{
    Step:   tc.step,
    Output: msg,
}
default:
}
```

其中第一个select扮演一种类似于if的作用，如果`tc.ctx.Done()`有信号就返回，否则什么也不做。第二个select是为了避免让`tc.outputChan`的发送操作阻塞。

虽然说以上的写法摆脱了随机性，但是第二个select又引入了另外一个行为，即如果`tc.outputChan`已满，那么这一次的输出就会被直接丢弃不发送。以及如果恰好在第一个select进入default分支后，`tc.ctx.Done()`有信号返回，那么第二个select就欠缺了对其的考虑，所以到头来其实也没有实现目的。

综合来看，其实第一种写法才是最常用的，虽然确实有随机选择的问题。select语句在面对多个分支随机择其一的设计是为了防止饥饿而非引入麻烦，换句话说，随机是为了确保分支之间的公平性，防止某个始终就绪的分支垄断CPU资源。在实际的goroutine中，当`tc.ctx.Done()`有信号返回时，println被调用的频率会自然降低，即使因为随机在二者均成立时选择了不发送消息的那一条，也只是丢掉了整个流程中的最后一行日志，这比引入额外的检查从而带来维护成本要划算。

## 更严格的实现

上面的两个select并没有达到目的。如果本着要复杂就复杂到底的原则，一种更加严格的实现是引入互斥锁，从而将这个函数的操作原子化。但显然，这样引入的维护成本就非常高了，一旦引入互斥锁，其余方法中也要正确使用互斥锁。而且实现得也没有那么顺利：`tc.outputChan`的send仍然有阻塞的可能，而一旦阻塞就是死锁。

为了一个println引入互斥锁是一个危险的过度设计，因此回归到一开始的select，接收最后一条日志会小概率丢失的事实，是比较好的选择。

```go
func (tc *TaskContext) println(msg string) {
	tc.mu.Lock()
	defer tc.mu.Unlock()
	if tc.ctx.Err() != nil {
		return
	}
	tc.outputChan <- TaskOutput{
		Step:   tc.step,
		Output: msg,
	}
}
```