/*
 * @Author: manweill
 * @Date: 2017-04-01 16:44:07
 * @Last Modified by: manweill
 * @Last Modified time: 2017-04-01 16:48:08
 */
import { observable } from 'mobx'

/** 当前阅读的书  */
class DiscoverModel {
  @observable id=''
  /** 当前阅读的书ID   */
  @observable
  bookId = ''

  @observable
  chapterId=''
  /** 当前阅读的章节索引   */
  @observable
  chapterIndex = 0

  /** 当前阅读章节的页码   */
  @observable
  page = 0

  /** 总页数 */
  @observable
  total = 1
}

export default DiscoverModel
