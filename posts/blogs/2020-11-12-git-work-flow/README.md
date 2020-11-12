---
sidebar: false
title: 如何规范Git工作流
author: 作者
---

# 如何规范Git工作流

## Pre Commit Hook

在提交之前我们必须保证满足某些条件，需要安装 `husky`

```
npm install --save-dev husky
```

## 代码风格检测

不同的语言和框架有不同的检测工具，比如 `vue` 我们需要在 package.json 中加入如下的脚本

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint"
    }
  }
}
```

这会让所有的文件都被检测，比较耗时，而加入 `lint-staged` 可以只用检测 staged 中的文件。首先安装

```
npm install --save-dev lint-staged
```

然后 `pakckage.json` 应该被修改为

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.{js,vue}": [
    "vue-cli-service lint",
    "git add"
  ]
}
```

[参考链接](https://cli.vuejs.org/zh/guide/cli-service.html#git-hook)


## 提交信息验证

> 标准的提交信息会给我们带来很大的好处

安装 [`commitlint`](https://commitlint.js.org/) 并初始化配置文件，执行下面的脚本

```
npm install --save-dev @commitlint/{cli,config-conventional}
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

在 `package.json` 中加入配置

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

最终 package.json 文件就变成下面这样了

```json
{
  ...
  "husky": {
      "hooks": {
        "pre-commit": "lint-staged",
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
      }
    },
  "lint-staged": {
    "*.{js,vue}": [
      "vue-cli-service lint",
      "git add"
    ]
  }
  ...
}
```

## 工具

> 很多时候我们需要通过工具来帮我们完成上面的工作

### 提交信息格式化工具

1、安装 [`commitizen`](https://github.com/commitizen/cz-cli) globaly

```
npm install -g commitizen
```

2、运行下面的脚本启用 Angular 风格的提交信息风格

```
commitizen init cz-conventional-changelog --save-dev --save-exact
```

如果上面的脚本运行失败，你可以用下面的方式替代

```
npm install --save-dev cz-conventional-changelog
```

新增配置到 package.json

```
"config": {
  "commitizen": {
    "path": "cz-conventional-changelog"
  }
}
```

3、最后我们要使用 `git cz` 来替代 `git commit` 命令。


### Git ChangeLog 生成工具

全局安装 [`conventional-changelog`](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli) 

```
npm install -g conventional-changelog-cli
```

然后生成 changelog 文件 `CHANGELOG.md`

```
conventional-changelog -p angular -i CHANGELOG.md -s -r 0
```

把上面的命令加入到 package.json 中

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
  }
}
```

::: warning
`conventional-changelog` 只会取 `Feature`, `Fix`, `Performance Improvement` 或者 `Breaking Changes` 类型的提交。
:::


推荐的工作流

-  修改代码
- `git cz` 提交
- `npm version 1.x.x` 修改版本打Tag
- `npm run changelog` 生成更新日志
- `git cz` 推送更新日志 (选择 `docs` 提交类型).
- `git push origin v1.x.x` 将上面的 Tag 推送到远端


## 标准

### [Semver Version](https://semver.org/lang/zh-CN/)

示例

- `major`  3.1.0 -> 4.0.0
- `premajor` 2.1.0 –> 3.0.0-0
- `minor` 2.0.1 -> 2.1.0
- `prepatch` 3.0.0–>3.0.1-0
- `patch` 2.0.0-0 -> 2.0.0 / 2.0.0 -> 2.0.1

最佳实践

- 开始版本号推荐为 `0.1.0`
-  正式版的版本号至少应该为 `1.0.0`


## 参考

- http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html
- https://github.com/angular/angular/blob/master/CONTRIBUTING.md
