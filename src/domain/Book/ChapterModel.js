import { observable, action, computed } from 'mobx';
import html from './html';
import html2 from './html2';
import cheerio from 'cheerio-without-node-native';
import tmpl from './tmpl';
import BookService from './BookService';

export default class ChapterModel {

  bookId = '1001';

  id = 0;

  uri = '';

  seq = 0;

  @observable
  name = '屠海龙'

  @observable
  numbers = '第二百一十四章'

  @observable
  content = ''

  @observable
  htmlstring = ''

  async get(uri) {
    const $ = await BookService.fetchData(uri);
    // const $ = cheerio.load(html2);
    const rule = BookService.rules.biquge;
    this.content = $(rule.content).html();
    this.htmlstring = tmpl(this.content);
  }

  /**
   * 获取下一页
   */
  @action
  async next() {
    //todo
    // alert('下一页')
    const nextId = this.id + 1;
    const book = await BookService.getBookInfo(this.bookId, this.uri);
    const data = book.chapterList.find(item => item.seq === nextId);
    console.log(book,data);
    if (data) {
      this.get(data.uri);
    }

  }

  /**
   * 获取上一页
   */
  async prev() {
    //todo
    alert('上一页')
  }
}
