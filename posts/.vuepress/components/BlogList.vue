<template>
    <div class="blog-card">
        <div class="blog-date">
            <slot name="date" />
        </div>
        <div class="topic-list">
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
.blog-card {
    width: 600px;
    margin: 0 auto;
    margin-bottom: 25px;
    
    .topic-list {
        border: #DDD 1px solid;
        padding: 20px;
        box-shadow: 0px 0px 10px #EEE;
    }
}
</style>