/*
 * @Author: manweill
 * @Date: 2017-04-06 12:50:09
 * @Last Modified by: manweill
 * @Last Modified time: 2017-04-06 12:51:12
 */

import { observable, action, extendObservable, runInAction, toJS, computed } from 'mobx'
import BookService from '../service/BookService'
import DiscoverModel from './DiscoverModel'
import personStore from '../store/personStore'
import { Toast } from 'antd-mobile'

export default class BookModel {
  constructor (id, uri) {
    if (id) {
      this.init(id, uri)
    }
  }

  /** 主键   */
  @observable
  id = ''

  /** 网页地址   */
  @observable
  uri = ''

  /** 书名   */
  @observable
  name = '';

  /** 描述   */
  @observable
  desc = '';

  /** 作者   */
  @observable
  author = ''

  /** 更新时间   */
  @observable
  updateAt = ''

  /** 最后章节   */
  @observable
  latestChapter = ''

  /** 图片   */
  @observable
  thumbImage = ''

  /** 把图片保存成Base64   */
  @observable
  thumbImageBase64 = ''

  /** 当前阅读   */
  discover = new DiscoverModel()

  /** 章节列表   */
  @observable
  chapterList = []

  @action
  async init (id, uri) {
    let book = personStore.getBook(uri)
    console.log('cache', personStore.cacheBook)
    if (book) {
      runInAction(() => {
        extendObservable(this, toJS(book))
      })
    } else {
      book = await BookService.newBook(id, uri)
      runInAction(() => {
        this.discover.bookId = book.id
        this.discover.total = book.chapterList.length
        extendObservable(this, book)
        personStore.cacheBook = this
      })
    }
  }

  static create (id, uri) {

  }

  @action
  async save () {
    const data = toJS(this)
    BookService.saveBook(data)
    personStore.addBook(data)
  }

  @action
  next () {
    if (this.discover.chapterIndex === this.discover.total) {
      Toast.info('已经是最后一页了', 1)
      return null
    } else {
      this.discover.chapterIndex ++
      personStore.cacheBook.discover.chapterIndex = this.discover.chapterIndex
      personStore.updateDiscover()
      return this.chapterList[this.discover.chapterIndex]
    }
  }

  @action
  prev () {
    if (this.discover.chapterIndex === 0) {
      Toast.info('已经是第一页了', 1)
    } else {
      this.discover.chapterIndex --
      personStore.cacheBook.discover.chapterIndex = this.discover.chapterIndex
      personStore.updateDiscover()
      return this.chapterList[this.discover.chapterIndex]
    }
  }

  /** 当前章节 */
  @computed get currChapter () {
    return this.chapterList[this.discover.chapterIndex]
  }
}
