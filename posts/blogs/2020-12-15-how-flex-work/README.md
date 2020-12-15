---
sidebar: false
title: 如何让 flex item 平分空间
author: 黄小红
---

# 如何让 flex item 平分空间

我们来看一个示例，有如下HTML结构：

::: demo
<template>
  <div class="outer-1">
      <div class="a1">
        <div class="b1"></div>
      </div>
      <div class="a2"></div>
  </div>
</template>
<style>
  .outer-1 {
    width: 400px;
    display: flex;
  }
  .outer-1 .a1 {
    background: red;
    height: 100px;
    flex-grow: 1;
  }
  .outer-1 .b1 {
    width: 100px
  }
  .outer-1 .a2 {
    background: blue;
    height: 100px;
    flex-grow: 1;
  }
</style>
:::


我们希望通过设置 `flex-grow: 1` 来让两个 flex item 填充均分，而结果并非如我们所愿，两个元素的区别就是一个有子元素，一个没有。查阅[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-grow)我们可以得知


::: tip
CSS属性 flex-grow设置了一个flex项主尺寸的flex增长系数。它指定了flex容器中剩余空间的多少应该分配给项目（flex增长系数）。

主尺寸是项的宽度或高度，这取决于flex-direction值。
:::

其中有一个关键词叫 `主尺寸`，那么如何确定这个主尺寸呢？通过[W3C](https://www.w3.org/TR/css-flexbox/#flex-basis-property)我们可以找到

::: tip
flex-basis is relative to the flex container’s inner main size
:::

因此我们最终明白可以通过设置 `flex-basis` 来设置 flex item 的主尺寸，于是我们修改代码如下


::: demo
<template>
  <div class="outer-2">
      <div class="a1">
        <div class="b1"></div>
      </div>
      <div class="a2"></div>
  </div>
</template>
<style>
  .outer-2 {
    width: 400px;
    display: flex;
  }
  .outer-2 .a1 {
    background: red;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
  }
  .outer-2 .b1 {
    width: 100px
  }
  .outer-2 .a2 {
    background: blue;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
  }
</style>
:::

可以看到 a1 和 a2 在 `flex-basis` 的加持下宽度相等了，事情到这还没结束，我们接着将 `b1` 的宽度设为 300px

::: demo
<template>
  <div class="outer-3">
      <div class="a1">
        <div class="b1"></div>
      </div>
      <div class="a2"></div>
  </div>
</template>
<style>
  .outer-3 {
    width: 400px;
    display: flex;
  }
  .outer-3 .a1 {
    background: red;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
  }
  .outer-3 .b1 {
    width: 300px
  }
  .outer-3 .a2 {
    background: blue;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
  }
</style>
:::

你会发现，在 a1 的子元素宽度过大（大于平均宽度）的情况下，仍然不会均分，`flex-basis` 失效了吗？我们一定是忽略了某些细节。接着我们找到[W3C关于Man Size 的描述](https://www.w3.org/TR/css-flexbox/#main-size)，其中有这么一句

::: tip
its min and max main size properties are its min-width/max-width or min-height/max-height properties
:::

说明不光存在 main size 主尺寸，还存在最小和最大主尺寸，会对最终的宽度造成影响，效果和 width 与 min/max-width 一样，也就是说这样里面必然存在一个优先级，[相关文章](https://mastery.games/post/the-difference-between-width-and-flex-basis/)中有提到这样的一个优先级规则

::: tip
content > width > flex-basis (limted by max|min-width)
:::

按照这个规则推测，之所以在设置了 `flex-basis` 相等之后仍然没有均分的唯一可能就是a1和b1自身存在 `min-width`，打开F12我们可以看到他俩的 min-width 默认都为 `auto`，再结合 W3C关于min-width的描述

::: tip
Note: The auto keyword, representing an automatic minimum size, is the new initial value of the min-width and min-height properties. The keyword was previously defined in this specification, but is now defined in the CSS Sizing module.

To provide a more reasonable default minimum size for flex items, the used value of a main axis automatic minimum size on a flex item that is not a scroll container is a content-based minimum size; for scroll containers the automatic minimum size is zero, as usual.
:::

可以看到，在非滚动的容器下，auto 实际上等于 `content-based minimum size`，基于内容的最小宽度又是啥呢，接着看解释

::: tip
In general, the content-based minimum size of a flex item is the smaller of its content size suggestion and its specified size suggestion. 
:::

到此便可以解释最后一个示例了，由于 a1 的字元素 b1 宽度为 300px，因此 a1 的 content size（内容宽度）就等于 300px，由于 a1 本身没有指定 width 所以 min-width 就是 300px，先通过 `flex-basis` 和 `flex-grow` 计算出每个flex item的宽度，然后再和各自的 min-width 做一个交叉，所以这个计算过程就是：

- a1 和 b1 的 flex-basis 为 0
- 剩余空间为 `400 - 0` 分配到 a1 和 b1 的宽度均为 200px
- a1 的最终宽度 = 0 + 200px = 325px
- 由于 a1 本身有 min-width 300px，大于 200px，所以把 a1 重置为 300px
- b1 = 400 - 300 = 100px

为了验证上面的猜想，我们可以改动一下代码


::: demo
<template>
  <div class="outer-4">
      <div class="a1">
        <div class="b1"></div>
      </div>
      <div class="a2"></div>
  </div>
</template>
<style>
  .outer-4 {
    width: 400px;
    display: flex;
  }
  .outer-4 .a1 {
    background: red;
    height: 100px;
    flex-grow: 1;
    flex-basis: 250px;
  }
  .outer-4 .b1 {
    width: 300px
  }
  .outer-4 .a2 {
    background: blue;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
  }
</style>
:::

同样分析一下这个过程:

- a1 的 flex-basis 为 250， b1 的 flex-basis 为 0
- 剩余空间为 `400 - 0 - 250 = 150` 分配到 a1 和 b1 的宽度均为 150 / 2 = 75px
- a1 的最终宽度 = 250 + 75 = 325px
- 由于 a1 本身有 min-width 300px，但是小于 325，所以忽略
- b1 = 400 - 325 = 75px

当然也可以把 flex-basis 换成 width，因为在没有设置 flex-basis 的情况下，默认等于width

::: demo
<template>
  <div class="outer-4">
      <div class="a1">
        <div class="b1"></div>
      </div>
      <div class="a2"></div>
  </div>
</template>
<style>
  .outer-4 {
    width: 400px;
    display: flex;
  }
  .outer-4 .a1 {
    background: red;
    height: 100px;
    flex-grow: 1;
    width: 250px;
  }
  .outer-4 .b1 {
    width: 300px
  }
  .outer-4 .a2 {
    background: blue;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
  }
</style>
:::


::: warning
因此最终每个元素宽度的计算过程就是

- 1、根据 flex-basis 计算出剩余空间
- 2、结合 flex-grow 计算要分配给每个元素的剩余空间
- 3、用 flex-basis + 分配给自己的剩余空间得出每个空间的预计宽度，等价于 `width` 属性
- 4、结合计算出的 min-width 和 max-width 渲染出最终的宽度（此处涉及到 width与min/max-width的计算规则）
:::


综上，我们可以得出

::: danger
min-width 只是限制 flex item 的最终宽度，而没有参与到剩余空间的计算。剩余空间永远是参照 flex-basis 去计算的。
:::


那么回到一开始的问题，如何让 flex item 平分其实就很简单了，只需要保证 a1 的 `min-width` 为 0 即可

::: demo
<template>
  <div class="outer-5">
      <div class="a1">
        <div class="b1"></div>
      </div>
      <div class="a2"></div>
  </div>
</template>
<style>
  .outer-5 {
    width: 400px;
    display: flex;
  }
  .outer-5 .a1 {
    background: red;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
  }
  .outer-5 .b1 {
    width: 300px
  }
  .outer-5 .a2 {
    background: blue;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
  }
</style>
:::

当然可以设置 `width: 0` 因为根据上面的 min-width 计算规则，手动指定了 width 的值就会取和他内容宽度相比的最小值，也就是 0

::: demo
<template>
  <div class="outer-6">
      <div class="a1">
        <div class="b1"></div>
      </div>
      <div class="a2"></div>
  </div>
</template>
<style>
  .outer-6 {
    width: 400px;
    display: flex;
  }
  .outer-6 .a1 {
    background: red;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
    width: 0;
  }
  .outer-6 .b1 {
    width: 300px
  }
  .outer-6 .a2 {
    background: blue;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
  }
</style>
:::

另外一个解决方式就是让 a1 滚动起来，因为 `for scroll containers the automatic minimum size is zero`

::: demo
<template>
  <div class="outer-7">
      <div class="a1">
        <div class="b1"></div>
      </div>
      <div class="a2"></div>
  </div>
</template>
<style>
  .outer-7 {
    width: 400px;
    display: flex;
  }
  .outer-7 .a1 {
    background: red;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
    overflow-x: auto;
  }
  .outer-7 .b1 {
    width: 300px
  }
  .outer-7 .a2 {
    background: blue;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
  }
</style>
:::


如果有多个 flex item 呢

::: demo
<template>
  <div class="outer-14">
      <div class="a1"></div>
      <div class="a2"></div>
      <div class="a3"></div>
  </div>
</template>
<style>
  .outer-14 {
    width: 400px;
    display: flex;
  }
  .outer-14 .a1 {
    background: red;
    height: 100px;
    flex-grow: 1;
    flex-basis: 200px;
    min-width: 250px;
  }
  .outer-14 .a2 {
    background: blue;
    height: 100px;
    flex-grow: 1;
    flex-basis: 20px;
  }
  .outer-14 .a3 {
    background: green;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
  }
</style>
:::

推导一下过程
- 剩余空间 = (400 - 200 - 20 - 0) = 180
- 3个 item 平分 180 / 3 = 60
- a1 = 60 + 200 = 260 > 250 取 260
- a2 = 60 + 20 = 80
- a3 = 60

如果 a1 算出来的宽度比 min-width 小呢？

::: demo
<template>
  <div class="outer-15">
      <div class="a1"></div>
      <div class="a2"></div>
      <div class="a3"></div>
  </div>
</template>
<style>
  .outer-15 {
    width: 400px;
    display: flex;
  }
  .outer-15 .a1 {
    background: red;
    height: 100px;
    flex-grow: 1;
    flex-basis: 80px;
    min-width: 250px;
  }
  .outer-15 .a2 {
    background: blue;
    height: 100px;
    flex-grow: 1;
    flex-basis: 20px;
  }
  .outer-15 .a3 {
    background: green;
    height: 100px;
    flex-grow: 1;
    flex-basis: 0;
  }
</style>
:::

计算过程就变成了

- 剩余空间 = (400 - 80 - 20 - 0) = 300
- 3个 item 平分 300 / 3 = 100
- a1 = 100 + 80 = 180 < 250 取 250

到了 a2 这里，a2 = 100 + 20 = 80，那么明显是不对的，因为 a1 已经占用了多余的空间，所以就应该按照剩下的空间（400 - 250）计算了

- 除开a1的剩余空间 = 150 - 20 - 0 = 130
- a2 和 a3 平分 130 / 2 = 65
- a2 = 65 + 20 = 85
- a3 = 65

::: tip
由此可以得出， flex item 分为两种，一种是 min-width > main width 第二种是 min-width <= main width。 这个时候可以先把第一种item去除，因为他们已经被强制变成min-width宽度了，从容器总宽度剪掉他们的宽度之和，然后剩下的用来计算第二种item的空间分配。
:::
