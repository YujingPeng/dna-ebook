/*
 * @Author: manweill
 * @Date: 2017-04-06 12:50:09
 * @Last Modified by: manweill
 * @Last Modified time: 2017-04-06 12:51:12
 */

import { observable, action, extendObservable, runInAction } from 'mobx'
import BookService from './BookService'
import DiscoverModel from './DiscoverModel'
import personStore from '../store/personStore'

export default class BookModel {
  constructor (id, uri) {
    this.init(id, uri)
  }

  /**
   * 主键
   * @memberOf BookModel
   */
  @observable
  id = ''

  /**
   * 网页地址
   * @memberOf BookModel
   */
  @observable
  uri = ''

  /**
   * 书名
   */
  @observable
  name = '';

  /**
   * 描述
   */
  @observable
  desc = '';

  /**
   * 作者
   */
  @observable
  author = ''

  /**
   * 更新时间
   */
  @observable
  updateAt = ''

  /**
   * 最后章节
   */
  @observable
  latestChapter = ''

  /**
   * 图片
   */
  @observable
  thumbImage = ''

  /**
   * 把图片保存成Base64
   * todo
   * @memberOf BookModel
   */
  @observable
  thumbImageBase64 = ''

  /**
   * 当前阅读
   */
  @observable
  discover = new DiscoverModel()

  /**
   * 章节列表
   */
  @observable
  chapterList = []

  @action
  async init (id, uri) {
    let book = personStore.getBook(uri)
    if (book) {
      runInAction(() => {
        extendObservable(this, book)
      })
    } else {
      book = await BookService.newBook(id, uri)
      runInAction(() => {
        extendObservable(this, book)
      })
    }
  }
}
