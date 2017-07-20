export default {
  host: 'http://www.xinshubao.net/',
  name: '新书包',
  encode: 'gbk',
  content: '#content',
  info: {
    name: '#xscas > h1',
    author: {
      selector: '#xscas > p:nth-child(2)',
      pattern: '小说作者：'
    },
    updateAt: {
      selector: '#xscas > p:nth-child(4)',
      pattern: '最后更新：'
    },
    latestChapter: {
      selector: '#xscas > p:nth-child(5) > a',
      pattern: '最新章节：'
    },
    desc: '#xsintro'
  },
  thumbImage: '#novelimg img',
  searchThumbImage: (host, parm1, parm2) => `${host}/files/article/image/${parm1}/${parm2}/${parm2}s.jpg`,
  chapterMenu: '#chapters > dl > dd > a',
  chapterMenuUri: null,
  chapterMenuUriHost: false,
  firstChapterIndex: 0,
  searchUri: 'http://zhannei.baidu.com/cse/search?s=4151288846087963019&q=',
  searchItem: '#results div.result-item',
  searchInfo: {
    name: 'h3>a',
    uri: {
      selector: 'h3>a',
      attr: 'href'
    },
    thumbImage: {
      selector: 'img',
      attr: 'src'
    },
    author: {
      selector: '.result-game-item-info>p:nth-child(1)',
      pattern: '作者：'
    },
    type: {
      selector: '.result-game-item-info>p:nth-child(2)',
      pattern: '类型：'
    },
    latestChapter: {
      selector: '.result-game-item-info>p:nth-child(4)',
      pattern: '最新章节：'
    },
    desc: '.result-game-item-desc'
  }
}
