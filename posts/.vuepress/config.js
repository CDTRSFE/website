module.exports = {
  title: '成都拓尔思前端团队',
  themeConfig: {
    nav: [
      { text: '文章', link: '/blogs/' },
      { text: '开源项目', link: '' },
      {text: '加入我们', link: '/website/join/' },
      { text: '拓尔思官网', link: 'http://www.trs.com.cn/' },
    ],
    sidebar: 'auto',
    lastUpdated: 'Last Updated'
  },
  plugins: [
    '@vuepress/medium-zoom',
    'demo-code'
  ]
}