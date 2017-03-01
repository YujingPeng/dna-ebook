import { observable, action, computed,toJS } from 'mobx';
import html from './html';
import html2 from './html2';
import cheerio from 'cheerio-without-node-native';
import { tmpl } from '../../assets/html';
import BookService from './BookService';

export default class BookModel {

  uri =''

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

  constructor(uri) {
    this.uri = uri;
  }

  @action
  async get() {
    const $ = await BookService.fetchData(this.uri);
    // const $ = cheerio.load(html);
    this.translator($);
    this.translatorChapterMenu($);
    BookService.saveBook(toJS(this));
  }


  translator($) {
    const self = this;
    const {info, thumbImage, host} = BookService.rules.biquge;
    for (let [k, v] of Object.entries(info)) {
      if (v.pattern) {
        const text = $(v.selector).text();
        self[k] = text.replace(v.pattern, '');
      }
      else {
        self[k] = $(v).text();
      }
    }
    this.thumbImage = `${host}${$(thumbImage).attr('src')}`;
  }

  translatorChapterMenu($) {
    const self = this;
    const {host, chapterMenu} = BookService.rules.biquge;
    let list = [];
    $('#list>dl>dd>a').each((i, item) => {
      const $elem = $(item);
      let url = host + $elem.attr('href');
      let text = $elem.text();
      const index = list.findIndex(item => item.url === url);
      if (!!text && !!url && index < 0) {
        list.push({
          id: Date.now(), url, text
        })
      }
    });

    const len = list.length
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (list[i].url < list[j].url) {
          let temp = list[i];
          list[i] = list[j];
          list[j] = temp;
        }
      }
      list[i].seq = i;
    }

    this.chapterList = list;
  }
}
