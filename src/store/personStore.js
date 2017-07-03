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

  @action
  async init () {
    const books = await getBookList()
    runInAction(() => {
      this.books.replace(books)
    })
  }

  /**
   * 更新书架
   * @param {Array} bookList
   */
  @action
  async refresh (bookList) {
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
  @action
  removeBook (bookId) {
    const index = this.books.findIndex(item => item.id === bookId)
    if (index >= 0) {
      this.books.splice(index, 1)
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

  /**
   * 根据书地址获取Id
   * @param {String} uri 地址
   */
  @action
  getBookIdByUri (uri) {
    const book = this.books.find(item => item.uri === uri) || {}
    return book.id
  }
}

const personStore = new PersonStore()

export default personStore
