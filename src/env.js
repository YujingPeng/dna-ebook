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

export const rules = {
  'baidu.com': {
    host: 'http://zhannei.baidu.com',
    encode: 'utf-8'
  },
  'biquge.com': {
    host: 'http://www.biquge.com',
    encode: 'utf-8',
    name: '笔趣阁',
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
    chapterMenu: '#list > dl > dd > a',
    firstChapterIndex: 9,
    content: '#content'
  },
  'biqudu.com': {
    host: 'http://www.biqudu.com',
    encode: 'utf-8',
    name: '笔趣阁',
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
    chapterMenu: '#list > dl > dd > a',
    firstChapterIndex: 9,
    content: '#content'
  },
  'booktxt.net': {
    host: 'http://www.booktxt.net',
    name: '顶点文学',
    encode: 'gbk',
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
    firstChapterIndex: 9,
    content: '#content'
  }
}
