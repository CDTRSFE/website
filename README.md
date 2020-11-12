## 写文章

在 `posts/blogs` 下创建一个目录（命名为日期-标题的英文单词以-连接 如：`YYYY-MM-DD-what-this-blog-about` ，因为vuepress目前不支持中文目录名）

，然后再该目录下新建一个 `README.md` 作为内容文件，以 Markdown 格式写文章，格式为：

```
---
sidebar: false
title: 文章标题
author: 作者
---
.....
```



需要引入图片的也直接放到当前目录下。




写完之后编辑 `posts/blogs/README.md` 将文章连接加进去即可

## 预览

命令行中运行 `npm run dev` 即可启动一个本地预览


## 部署

直接提交一个 PR 即可