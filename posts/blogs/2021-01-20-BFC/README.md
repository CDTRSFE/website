---
sidebar: false
title: 边距坍缩和边距重叠问题
author: 王天睿
---
# 边距坍缩和边距重叠问题

## 在正式讨论边距坍缩和边距重叠的问题之前，先来了解一下BFC

### BFC 定义

BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

### BFC布局特性

1. 内部的盒会在垂直方向一个接一个排列（可以看作BFC中有一个的常规流）；
2. 处于同一个BFC中的元素相互影响，可能会发生margin collapse；
每个元素的margin box的左边，与容器块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此；
BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然；
3. 计算BFC的高度时，考虑BFC所包含的所有元素，连浮动元素也参与计算；
浮动盒区域不叠加到BFC上

## 边距坍缩问题的表现
父盒子没设置垂直边距，子盒子设置垂直外边距，子盒子的垂直外边距并未将父盒子撑开，而是让父盒子出现了本不应该出现的外边距表现

::: demo
<template>
    <div class="main">
        <div class="father1">
            <div class="children1">
                123
            </div>
        </div>
    </div>
</template>
<style>
.main{
    min-height:100px;
}
.father1{
    width: 100px;
    background-color: pink;
}
.children1{
    background-color: yellow;
    width: 100px;
    margin: 10px 0;
}
</style>
:::

## 边距坍缩的解决方案

1. 设置外层父盒子相应方向的边框border(注：设置对应边的border只会解决对应边的边距坍缩，本例未设置下边框，所以下方的边距坍缩仍存在，第二条padding设置同样如此)

::: demo
<template>
    <div class="main">
        <div class="father2">
            <div class="children2">
                123
            </div>
        </div>
    </div>
</template>
<style>
.father2{
    width: 100px;
    background-color: pink;
    border-top: 1px red solid;
}
.children2{
    background-color: yellow;
    width: 100px;
    margin: 10px 0;
}
</style>
:::

2. 设置外层父盒子相应方向的内边距padding

::: demo
<template>
    <div class="main">
        <div class="father3">
            <div class="children3">
                123
            </div>
        </div>
    </div>
</template>
<style>
.father3{
    width: 100px;
    background-color: pink;
    padding:1px 0;
}
.children3{
    background-color: yellow;
    width: 100px;
    margin: 10px 0;
}
</style>
:::

3. 使外层父盒子形成BFC，具体方法有：

+ float属性不为none

::: demo
<template>
    <div class="main">
        <div class="father4">
            <div class="children4">
                123
            </div>
        </div>
    </div>
</template>
<style>
.father4{
    width: 100px;
    background-color: pink;
    float:left;
}
.children4{
    background-color: yellow;
    width: 100px;
    margin: 10px 0;
}
</style>
:::

+ position为absolute或fixed

::: demo
<template>
    <div class="main">
        <div class="father5">
            <div class="children5">
                123
            </div>
        </div>
    </div>
</template>
<style>
.father5{
    width: 100px;
    background-color: pink;
    position:absolute;
}
.children5{
    background-color: yellow;
    width: 100px;
    margin: 10px 0;
}
</style>
:::

+ display为inline-block, table-cell, table-caption, flex, inline-flex

::: demo
<template>
    <div class="main">
        <div class="father6">
            <div class="children6">
                123
            </div>
        </div>
    </div>
</template>
<style>
.father6{
    width: 100px;
    background-color: pink;
    display:inline-block;
}
.children6{
    background-color: yellow;
    width: 100px;
    margin: 10px 0;
}
</style>
:::

+ overflow不为visible

::: demo
<template>
    <div class="main">
        <div class="father7">
            <div class="children7">
                123
            </div>
        </div>
    </div>
</template>
<style>
.father7{
    width: 100px;
    background-color: pink;
    overflow:hidden;
}
.children7{
    background-color: yellow;
    width: 100px;
    margin: 10px 0;
}
</style>
:::

### 上述三种方法中，第一和第二两种方法可能会使最终效果与预期存在极小的差别（多出来的边框宽度或内边距），所以需要按照场景选择适合的解决方案

## 边距重叠问题的表现
在父盒子内部有两个及以上的子盒子都具有垂直外边距，相邻两个子盒子之间的距离并不是上方子盒子的下外边距加上下方子盒子的上外边距，而是这两个中的较大值作为它们之间的距离，于是上下两个子盒子之间的外边距就发生了边距重叠问题(下方举例已经处理过边距坍缩)

::: demo
<template>
    <div class="main2">
        <div class="father8">
            <div class="children8">1</div>
            <div class="children8">2</div>
            <div class="children8">3</div>
            <div class="children8">4</div>
        </div>
    </div>
</template>
<style>
.main2{
    min-height:220px;
}
.father8{
    width: 100px;
    overflow: hidden;
    background-color: pink;
}
.children8{
    margin: 10px 0;
    width: 100px;
    background-color: yellow;
}
</style>
:::

## 边距重叠的解决方案

1. 将子盒子和父盒子都浮动（需要注意父盒子与子盒子的宽度）

::: demo
<template>
    <div class="main2">
        <div class="father9">
            <div class="children9">1</div>
            <div class="children9">2</div>
            <div class="children9">3</div>
            <div class="children9">4</div>
        </div>
    </div>
</template>
<style>
.father9{
    width: 100px;
    background-color: pink;
    float: left;
}
.children9{
    float: left;
    margin: 10px 0;
    width: 100px;
    background-color: yellow;
}
</style>
:::

2. 在子盒子外层再套一层盒子，并让新加的这一层容器形成BFC（下例使用overflow: hidden使box2形成BFC,第5号盒子与第4号盒子之间没有边距重叠）

::: demo
<template>
    <div class="main2">
        <div class="father0">
            <div class="children0">1</div>
            <div class="children0">2</div>
            <div class="children0">3</div>
            <div class="children0">4</div>
            <div class="box2">
                <div class="children0">5</div>
            </div>
        </div>
    </div>
</template>
<style>
.father0{
    width: 100px;
    background-color: pink;
    overflow: hidden;
}
.children0{
    background-color: yellow;
    width: 100px;
    margin: 10px 0;
}
.box2{
    overflow: hidden;
}
</style>
:::

3. 在设置样式时只是用一个垂直方向的外边距，即margin-top或margin-bottom，或者使用内边距padding来进行样式设计，这样就可以比较符合预期的根据子盒子样式撑开父盒子高度。


 