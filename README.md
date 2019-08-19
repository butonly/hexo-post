# README

读取某个目录下的配置文件，通过该配置文件，指定要发布的文件内容

### Example

example [hexo.yaml](https://github.com/liuyanjie/knowledge/blob/master/hexo.yaml)

```yaml

repository: https://github.com/liuyanjie/knowledge

posts:
  - title: libuv源码分析（一）全局概览（Overview）
    date: 2019-04-23 23:00:01+0800
    path: node.js/libuv/1-libuv-overview.md 
    categories: [源码分析]
    tags: [libuv, node.js, eventloop]
  - title: libuv源码分析（二）事件循环（Eventloop）
    date: 2019-04-23 23:00:02+0800
    path: node.js/libuv/2-libuv-event-loop.md 
    categories: [源码分析]
    tags: [libuv, node.js, eventloop]
  - title: libuv源码分析（三）资源抽象：Handle 和 Request
    date: 2019-04-23 23:00:03+0800
    path: node.js/libuv/3-libuv-handle-and-request.md 
    categories: [源码分析]
    tags: [libuv, node.js, eventloop]
  - title: libuv源码分析（四）定时器（Timer）
    date: 2019-04-23 23:00:04+0800
    path: node.js/libuv/4-libuv-timer.md 
    categories: [源码分析]
    tags: [libuv, node.js, eventloop]
  - title: libuv源码分析（五）IO观察者（io_watcher）
    date: 2019-04-23 23:00:05+0800
    path: node.js/libuv/5-libuv-io-watcher.md 
    categories: [源码分析]
    tags: [libuv, node.js, eventloop]
  - title: libuv源码分析（六）流（Stream）
    date: 2019-04-23 23:00:06+0800
    path: node.js/libuv/6-libuv-stream.md 
    categories: [源码分析]
    tags: [libuv, node.js, eventloop]
  - title: libuv源码分析（七）异步唤醒（Async）
    date: 2019-04-23 23:00:07+0800
    path: node.js/libuv/7-libuv-async.md 
    categories: [源码分析]
    tags: [libuv, node.js, eventloop]
  - title: libuv源码分析（八）线程池（Threadpool）
    date: 2019-04-23 23:00:08+0800
    path: node.js/libuv/8-libuv-threadpool.md 
    categories: [源码分析]
    tags: [libuv, node.js, eventloop]

  - title: Git对象模型：一步一步分析Git底层对象模型
    date: 2019-06-24 19:00:00+0800
    path: vcs/git/git-object-model.md 
    categories: [git]
    tags: [vcs, git]
  - title: Git命令工作机制
    date: 2019-06-24 20:00:00+0800
    path: vcs/git/git-working-mechanism.md 
    categories: [git]
    tags: [vcs, git]
```

```sh
hexo-post -f path/to/hexo.yaml
```
