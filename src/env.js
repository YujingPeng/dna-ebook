export const color = '#2F589C'

// #802A2A

export const theme = {
  night: {
    backgroundColor: '#161418',
    color: '#696969'
  },
  light: {
    backgroundColor: '#f5deb3',
    color: '#161418'
  }
}

const kanshuge = {
  host: 'http://www.kanshuge.la',
  encode: 'gbk',
  name: '看书阁',
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
  thumbImage: '#fmimg > img',
  searchThumbImage: (host, parm1, parm2) => `${host}/files/article/image/${Number(parm1) + 1}/${parm2}/${parm2}.jpg`,
  chapterMenuUri: 'p.btnlinks>a.read',
  chapterMenu: '#list > dl > dd > a',
  firstChapterIndex: 9,
  searchUri: 'http://www.kanshuge.la/modules/article/searche.php?searchkey=',
  searchItem: '.item-pic',
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
    author: 'p:nth-child(3)>i:nth-child(1)',
    type: '',
    updateAt: 'p:nth-child(4)>i:nth-child(2)',
    latestChapter: 'p:nth-child(4)>a',
    desc: 'p:nth-child(5)'
  }
}

const biquge = {
  host: 'http://www.biquge.com.tw',
  sid: '10048850760735184192',
  encode: 'gbk',
  name: '笔趣阁1',
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
  thumbImage: '#fmimg > img',
  searchThumbImage: (host, parm1, parm2) => `${host}/files/article/image/${Number(parm1) + 1}/${parm2}/${parm2}.jpg`,
  chapterMenuUri: null,
  chapterMenu: '#list > dl > dd > a',
  firstChapterIndex: 9,
  content: '#content'
}

const booktxt = {
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
  chapterMenuUri: null,
  chapterMenu: '#list > dl > dd > a',
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

export const rules = {
  'booktxt.net': booktxt,
  'kanshuge.la': kanshuge
}
