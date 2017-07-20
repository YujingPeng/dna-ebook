export default {
  host: 'http://www.xxbiquge.com',
  name: '新笔趣阁',
  encode: 'utf-8',
  content: '#content',
  info: {
    name: '#info > h1',
    author: {
      selector: '#info > p:nth-child(2)',
      pattern: '作    者：'
    },
    ending: {
      selector: '#info > p:nth-child(3)',
      contains: '已完结'
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
  searchThumbImage: (host, parm1, parm2) => `${host}/files/article/image/${Number(parm1) + 1}/${parm2}/${parm2}.jpg`,
  chapterMenu: '#list > dl > dd > a',
  chapterMenuUri: null,
  chapterMenuUriHost: true,
  firstChapterIndex: 0,
  searchUri: 'http://zhannei.baidu.com/cse/search?s=5199337987683747968&q=',
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
