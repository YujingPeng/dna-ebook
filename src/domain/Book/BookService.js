import { observable, action, computed } from 'mobx';
import html from './html';
import html2 from './html2';
import cheerio from 'cheerio-without-node-native';

// https://www.baidu.com/s?q1=%E9%AD%94%E5%A4%A9%E8%AE%B0&q2=&q3=&q4=&rn=10&lm=0&ct=0&ft=&q5=&q6=biquge.com&tn=baidulocal

const rules = {
  'biquge': {
    host: 'http://www.biquge.com',
    url: 'http://www.biquge.com/43_43821',
    info: {
      name: '#info > h1',
      author: {
        selector: '#info > p:nth-child(2)',
        pattern: '作    者：'
      },
      updateAt: {
        selector: '#info > p:nth-child(4)',
        pattern: '最后更新：',
      },
      latestChapter: {
        selector: '#info > p:nth-child(5) > a',
        pattern: '最新章节：'
      },
      desc: '#intro',
    },
    thumbImage: '#fmimg > img',
    chapterMenu: '#list > dl > dd > a',
    content: '#content'
  }
}


function translator($) {
  const self = {};
  const { info, thumbImage, host } = BookService.rules.biquge;
  for (let [k, v] of Object.entries(info)) {
    if (v.pattern) {
      const text = $(v.selector).text();
      self[k] = text.replace(v.pattern, '');
    }
    else {
      self[k] = $(v).text();
    }
  }
  self.thumbImage = `${host}${$(thumbImage).attr('src')}`;
  return self;
}

function translatorChapterMenu($) {
  const self = this;
  const { host, chapterMenu } = BookService.rules.biquge;
  let list = [];
  $('#list>dl>dd>a').each((i, item) => {
    const $elem = $(item);
    let uri = host + $elem.attr('href');
    let text = $elem.text();
    const index = list.findIndex(item => item.uri === uri);
    if (!!text && !!uri && index < 0) {
      list.push({
        id: Date.now(), uri, text
      })
    }
  });

  const len = list.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (list[i].uri < list[j].uri) {
        let temp = list[i];
        list[i] = list[j];
        list[j] = temp;
        list[i].seq = i;
      }
    }
  }
  return list;
}


export default class BookService {
  static rules = rules;

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
    const res = await fetch(url, option);
    const resHtml = await res.text();
    console.log(resHtml);
    return cheerio.load(resHtml);
  }

  /**
   * @param {String} id
   * @param {Number} uri
   * @returns BookModel
   */
  static getBookInfo = async (id, uri) => {
    try {
      const storage = global.storage;
      storage.sync = {
        async book(params) {
          let { id, resolve, reject, syncParams: { uri } } = params;
          console.log('异步读取', params, uri);
          try {
            const $ = await BookService.fetchData(this.uri);
            let data = translator($) || {};
            console.log(data);
            data.chapterList = translatorChapterMenu($) || [];
            storage.save({
              key: 'book',  // 注意:请不要在key中使用_下划线符号!
              id: id,   // 注意:请不要在id中使用_下划线符号!
              rawData: data
            });
            resolve && resolve(data);
          } catch (error) {
            console.log(error);
            reject && reject(error);
          }
        }
      }
      let book = await storage.load({
        id,
        key: 'book',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          uri
        },
      })
      if (book) {
        return book
      }
      else {
        throw new Error('获取数据失败!');
      }
    } catch (error) {
      throw new Error('获取数据失败:', error.message)
    }
  }

  /**
   * 保存小说信息及目录
   * @param {BookModel} model
   */
  static saveBook = async (model) => {
    const storage = global.storage;
    storage.save({
      key: 'book',  // 注意:请不要在key中使用_下划线符号!
      id: '1001',   // 注意:请不要在id中使用_下划线符号!
      rawData: model
    });
  }

  /**
   * 获取下一个章节
   * @param {string} 小说id
   * @param {Number} 章节id
   */
  static getNextChapter = async (bookId, chapterId) => {
    // todo
  }
}
