/*
 * @Author: manweill
 * @Date: 2017-04-01 16:33:47
 * @Last Modified by: manweill
 * @Last Modified time: 2017-04-01 16:52:37
 */
import DiscoverModel from '../model/DiscoverModel'
import { action, runInAction, observable } from 'mobx'
import BookService from '../domain/Book/BookService'

/**
 * 当前用户仓储
 * @class PersonStore
 */
class PersonStore {
  constructor () {
    this.init()
  }

  /**
   * 当前阅读
   * @memberOf PersonStore
   */
  discover = new DiscoverModel()

  /**
   * 书本列表
   * @memberOf PersonStore
   */
  @observable
  books = []

  @action
  async init () {
    const result = await BookService.getList()
    runInAction(() => {
      this.books = []
    })
  }

  /**
   * 更新书架
   *
   * @param {Array} bookList
   *
   * @memberOf PersonStore
   */
  @action
  refresh (bookList) {
    this.books = bookList
  }

  /**
   * 移除书本
   *
   * @param {UUID} bookId
   * @memberOf PersonStore
   */
  @action
  removeBook (bookId) {
    const index = this.books.findIndex(item => item.id === bookId)
    if (index) {
      this.books.splice(index, 1)
    }
  }

  @action
  addBook (book) {
    this.books.unshift(book)
  }

  @action
  getBook (uri) {
    const index = this.books.findIndex(item => item.uri === uri)
    if (index >= 0) {
      return this.books[index]
    } else {
      return null
    }
  }

 /**
   * 直接从缓存中判断是否存在
   *
   * @param {any} uri 要判断的地址
   * @returns {bool}
   */
  @action
  isExist (uri) {
    return this.books.findIndex(item => item.uri === uri) >= 0
  }
}

const personStore = new PersonStore()

export default personStore
