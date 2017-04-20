import { observable, action, runInAction } from 'mobx'
import {Toast} from 'antd-mobile'
import BookService from './BookService'

export default class ChapterModel {
  bookId = '1001';

  id = 0

  uri = ''

  @observable
  name = '屠海龙'

  @observable
  numbers = '第二百一十四章'

  @observable
  content = ''

  @observable
  htmlstring = ''

  constructor (uri, title) {
    this.uri = uri
    this.name = title
  }

  @action
  async get () {
    const $ = await BookService.fetchData(this.uri)
    const rule = BookService.rules.biquge
    runInAction(() => {
      this.content = $(rule.content).html()
    })
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
    if ((index + 1) === book.chapterList.length) {
      Toast.info('已经是最后一页了')
      return
    }
    const data = book.chapterList[index + 1]
    if (data) {
      runInAction(() => {
        this.uri = data.uri
        this.name = data.text
      })
      this.get()
    }
  }

  /**
   * 获取上一页
   */
  async prev () {
    // todo
    const uri = this.uri
    const book = await BookService.getBookInfo(this.bookId, this.uri)
    const index = book.chapterList.findIndex(item => item.uri === uri)
    if (index === 0) {
      Toast.info('已经是第一页了', 1)
      return
    }
    const data = book.chapterList[index - 1]
    if (data) {
      this.uri = data.uri
      this.get()
    }
  }
}
