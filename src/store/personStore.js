/*
 * @Author: manweill
 * @Date: 2017-04-01 16:33:47
 * @Last Modified by: manweill
 * @Last Modified time: 2017-04-01 16:52:37
 */
import { action, runInAction, observable } from 'mobx'
import { getBookList, getSearchHistory } from '../service'
import { rules } from '../env'

/** 当前用户仓储 */
class PersonStore {
  constructor () {
    this.init()

    let host = []
    for (var key in rules) {
      if (rules.hasOwnProperty(key)) {
        host.push({
          label: rules[key].name,
          value: rules[key].searchUri
        })
      }
    }
    this.currentSource = host[0].value
    this.sites = host
  }

  @observable sites = []

  @observable currentSource = ''

  /**   书本列表   */
  @observable books = []

  @observable searchHistory = []

  @action async init () {
    const books = await getBookList()
    const search = await getSearchHistory() || []
    runInAction(() => {
      this.books.replace(books)
      this.searchHistory.replace(search)
    })
  }

  @action cacheSearchHistory (keyword) {
    const index = this.searchHistory.findIndex(item => keyword === item.keyword)
    if (index >= 0) {
      this.searchHistory.splice(index, 1)
    }
    this.searchHistory.unshift({keyword})
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
}

const personStore = new PersonStore()

export default personStore
