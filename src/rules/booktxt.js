export default {
  host: 'http://www.booktxt.net',
  name: '顶点文学 (推荐) ',
  encode: 'gbk',
  content: '#content',
  info: {
    name: '#info > h1',
    author: {
      selector: '#info > p:nth-child(2)',
      pattern: '作    者：'
    },
    updateAt: {
      selector: '#info > p:nth-child(4)',
      pattern: '最后更新：'
    },
    latestChapter: {
      selector: '#info > p:nth-child(5) > a',
      pattern: '最新章节：'
    },
    desc: '#intro'
  },
  thumbImage: '#fmimg img',
  searchThumbImage: (host, parm1, parm2) => `${host}/files/article/image/${parm1}/${parm2}/${parm2}s.jpg`,
  chapterMenu: '#list > dl > dd > a',
  chapterMenuUri: null,
  chapterMenuUriHost: true,
  firstChapterIndex: 9,
  searchUri: 'http://zhannei.baidu.com/cse/search?s=5334330359795686106&q=',
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
    updateAt: {
      selector: '.result-game-item-info>p:nth-child(3)',
      pattern: '更新时间：'
    },
    latestChapter: {
      selector: '.result-game-item-info>p:nth-child(4)',
      pattern: '最新章节：'
    },
    desc: '.result-game-item-desc'
  }
}
