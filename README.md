# README

读取某个目录下的配置文件，通过该配置文件，指定要发布的文件内容

### Example

hexo.yaml

```yaml
posts:
  - title: JavaScript基础
    date: 2018-04-11 22:05:14
    path: langs/ecmascript/javascript-base.md
    imageBaseUrl: https://raw.githubusercontent.com/liuyanjie/knowledge/master/langs/ecmascript/
    categories:
    - Syntax
    - JavaScript
    tags: 
    - JavaScript
    - JavaScript基础

  - title: JavaScript深度
    date: 2018-05-02
    path: langs/ecmascript/javascript-deep.md
    imageBaseUrl: https://raw.githubusercontent.com/liuyanjie/knowledge/master/langs/ecmascript/
    categories:
    - Syntax
    - JavaScript
    tags: 
    - JavaScript
    - JavaScript执行上下文、变量对象、活动对象、词法作用域、闭包、执行过程
```

```sh
hexo-post -f path/to/hexo.yaml
```
