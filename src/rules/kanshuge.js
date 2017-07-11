export default {
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
  chapterMenu: '#list > dl > dd > a',
  chapterMenuUri: 'p.btnlinks>a.read',
  chapterMenuUriHost: true,
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
