/*
 * @Author: manweill
 * @Date: 2017-04-01 16:33:47
 * @Last Modified by: manweill
 * @Last Modified time: 2017-04-01 16:52:37
 */
import { action, runInAction, observable } from 'mobx'
import { getBookList } from '../service'

/** 当前用户仓储 */
class PersonStore {
  constructor () {
    this.init()
  }

  /**   书本列表   */
  @observable books = []

  /**
   * @type {BookModel}
   */
  @observable cacheBook = null

  @action async init () {
    const result = await getBookList()
    runInAction(() => {
      this.books.replace(result)
    })
  }

  /**
   * 更新书架
   * @param {Array} bookList
   */
  @action async refresh (bookList) {
    const result = await getBookList()
    runInAction(() => {
      this.books.replace(result)
    })
  }

  /**
   * 移除书本
   *
   * @param {UUID} bookId
   */
  @action removeBook (bookId) {
    const index = this.books.findIndex(item => item.id === bookId)
    if (index >= 0) {
      this.books.splice(index, 1)
    }
  }

  @action addBook (book) {
    // this.books.unshift(book)
  }

  /** 直接搜索取缓存列表中的内容 */
  @action getBook (uri) {
    // return this.books.find(item => item.uri === uri)
  }

  /**
   * 直接搜索取缓存列表中的内容
   * @param {string} bookId
   * @returns {BookModel} 返回Book对象
   */
  @action getBookById (bookId) {
    // return this.books.find(item => item.id === bookId)
  }

  /**
    * 直接从缓存中判断是否存在
    *
    * @param {any} uri 要判断的地址
    * @returns {bool}
    */
  @action isExist (uri) {
    return this.books.findIndex(item => item.uri === uri) >= 0
  }

  /**
   * 更新阅读信息
   */
  @action async updateDiscover () {
    if (this.cacheBook) {
      // await BookService.saveBook(toJS(this.cacheBook))
      // await this.refresh()
    }
  }

  @action initCacheBook (book) {
    // this.cacheBook = new BookModel()
    // extendObservable(this.cacheBook, toJS(book))
  }
}

const personStore = new PersonStore()

export default personStore
