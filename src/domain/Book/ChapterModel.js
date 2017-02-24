import { observable, action, computed } from 'mobx';
import html from './html';
import html2 from './html2';
import cheerio from 'cheerio-without-node-native';
import { tmpl } from '../../assets/html';
import BookService from './BookService';

export default class ChapterModel {
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
}
