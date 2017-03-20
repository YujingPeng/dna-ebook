import { observable, action, computed } from 'mobx'
import html from './html'
import html2 from './html2'
import cheerio from 'cheerio-without-node-native'
import tmpl from './tmpl'
import BookService from './BookService'

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

  constructor (uri) {
    this.uri = uri
  }

  @action
  async get () {
    const $ = await BookService.fetchData(this.uri)
    // const $ = cheerio.load(html2);
    const rule = BookService.rules.biquge
    this.content = $(rule.content).html()
    this.htmlstring = tmpl(this.content)
  }

  /**
   * 获取下一页
   */
  @action
  async next () {
    // todo
    // alert('下一页')
    const uri = this.uri
    const book = await BookService.getBookInfo(this.bookId, this.uri)
    const index = book.chapterList.findIndex(item => item.uri === uri)
    const data = book.chapterList[index + 1]
    console.log(uri, index, data)
    if (data) {
      this.uri = data.uri
      this.get()
    }
  }

  /**
   * 获取上一页
   */
  async prev () {
    // todo
    alert('上一页')
  }
}
