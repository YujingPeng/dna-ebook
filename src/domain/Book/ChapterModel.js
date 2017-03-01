import { observable, action, computed } from 'mobx';
import html from './html';
import html2 from './html2';
import cheerio from 'cheerio-without-node-native';
import tmpl from './tmpl';
import BookService from './BookService';

export default class ChapterModel {

  bookId = '';

  id = '';

  uri = '';

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
  async next(){
    //todo
    alert('下一页')
  }

  /**
   * 获取上一页
   */
  async prev(){
    //todo
    alert('上一页')
  }
}
