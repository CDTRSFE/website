module.exports = {
  title: '成都拓尔思前端团队',
  themeConfig: {
    nav: [
      { text: '文章', link: '/topics/' },
      { text: '开源项目', link: '' },
      { text: '拓尔思官网', link: 'http://www.trs.com.cn/' },
    ],
    sidebar: 'auto',
    lastUpdated: 'Last Updated'
  },
  plugins: [
    '@vuepress/medium-zoom',
  ]
}