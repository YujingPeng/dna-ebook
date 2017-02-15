import { observable, action } from 'mobx';
import html from './html';
import html2 from './html2';
import cheerio from 'cheerio-without-node-native';

const rules = {
  'biquge': {
    host: 'http://www.biquge.com',
    url: 'http://www.biquge.com/43_43821',
    info: {
      name: '#info > h1',
      author: {
        selector: '#info > p:nth-child(2)',
        regex: '作    者：'
      },
      updateAt: {
        selector: '#info > p:nth-child(4)',
        regex: '最后更新：',
      },
      latestChapter: {
        selector: '#info > p:nth-child(5) > a',
        regex: '最新章节：'
      },
      desc: '#intro',
    },
    thumbImage: '#fmimg > img',
    chapterMenu: '#list > dl > dd:nth-child(@chapterMenu) > a',
    content: '#content'
  }
}

export class BookModel {


  @observable
  name = '';

  @observable
  desc = '';

  @observable
  author = ''

  @observable
  updateAt = ''

  @observable
  latestChapter = ''

  @observable
  thumbImage = ''

  @observable
  currentReader = ''

  @observable
  chapterList = []

  @action
  async get() {
    const $ = await BookService.fetchData('http://www.biquge.com/43_43821/');
    this.translator($);
    this.translatorChapterMenu($);
  }


  translator($) {
    const self = this;
    const {info, thumbImage, host} = rules.biquge;
    for (let [k, v] of Object.entries(info)) {
      if (v.regex) {
        const text = $(v.selector).text();
        self[k] = text.replace(v.regex, '');
      }
      else {
        self[k] = $(v).text();
      }
    }
    this.thumbImage = `${host}${$(thumbImage).attr('src')}`;

  }

  translatorChapterMenu($) {
    const self = this;
    const {host, chapterMenu} = rules.biquge;
    let list = [];
    const length = $('#list>dl>dd>a').length;
    // list = $('#list>dl>dd>a').map((intex, item) => {
    //   if (item && item.text) {
    //     return {
    //       id: Date.now(),
    //       url: item.attribs.href,
    //       text: item.firstChild.data
    //     }
    //   }
    //   else {
    //     return {
    //       id: Date.now(),
    //       url: '',
    //       text: ''
    //     }
    //   }
    // });
    for (let i = 0; i < length; i++) {
      const selector = chapterMenu.replace('@chapterMenu', i);
      const $elem = $(selector);
      let url = $elem.attr('href');
      let text = $elem.text();
      const index = list.filter(item => item.url === url);
      if (!!text && !!url && index.length === 0) {
        list.push({
          id: Date.now(), url: host + url, text
        })
      }
    }

    const len = list.length
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (list[i].url < list[j].url) {
          let temp = list[i];
          list[i] = list[j];
          list[j] = temp;
        }
      }
    }

    this.chapterList = list;
  }
}

export class ChapterModel {
  @observable
  name = '屠海龙'

  @observable
  numbers = '第二百一十四章'

  @observable
  content = ''

  async get(uri) {
    const $ = await BookService.fetchData(uri);
    // const $ = cheerio.load(html2);
    const rule = rules.biquge;
    this.content = $(rule.content).html();
  }

}

class BookService {
  static fetchData = async (url) => {
    let origin = url;
    let headers = {
      'Proxy-Connection': 'keep-alive',
      // 'Cache-Control': 'max-age=0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      // 'Origin': origin,
      // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // 'Accept-Encoding': 'compress,gzip,deflate,sdch',
      'Accept-Language': 'zh-CN,zh;q=0.8',
      // 'Accept-Charset': 'GBK,utf-8;q=0.7,*;q=0.3'
    };
    const option = {
      method: 'GET',
      headers: headers
    };
    // const res = await fetch(url, option);
    // const resHtml = await res.text();
    // console.log(resHtml);
    return cheerio.load(html);
  }
}
