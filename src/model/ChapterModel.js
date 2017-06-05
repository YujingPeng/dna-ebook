import { observable, action, runInAction } from 'mobx'
import { getChapter, getChapterByIndex, updateDiscover } from '../service'
import {Toast} from 'antd-mobile'
var Dimensions = require('Dimensions')
var ScreenWidth = Dimensions.get('window').width

function zhcnCode (s) {
  return /[^\x00-\xff]/.test(s)
}

let fontSize = 20
// 取整
// const lineEnd = parseInt(ScreenWidth / 20)

/**
 *  字符串换行处理
 * @param {string} str 要拆分的字符串
 * @param {string} prefix key的数据的前缀
 */
function lineFeed (str: string, keyPrefix: string) {
  let result = []
  let chars = str.split('')
  let linefeed = 0
  // 第一次转换需要进行首航缩进
  let lineEnd = ScreenWidth - (fontSize * 2)
  if (!str && str === '') return result
  let start = 0
  let size = 0
  for (let i = 0, length = chars.length; i < length; i++) {
    size = zhcnCode(chars[i]) ? fontSize : fontSize / 2
    if ((linefeed + size) >= lineEnd) {
      // i--
      if (result.length === 0) {
        result.push({
          key: keyPrefix + '_' + i,
          style: 'textFirst',
          children: chars.slice(start, i).join('')
        })
        lineEnd = ScreenWidth
      } else {
        result.push({
          key: keyPrefix + '_' + i,
          style: 'text',
          children: chars.slice(start, i).join('')
        })
      }
      start = i
      linefeed = size
    } else {
      linefeed += size
    }
  }
  result.push({
    key: keyPrefix + '_',
    style: result.length === 0 ? 'textFirst' : 'text',
    children: chars.slice(start).join('')
  })
  return result
}

class ChapterModel {
  @observable
  bookId = '';

  @observable
  id = ''

  @observable
  uri = ''

  @observable
  name = ''

  @observable
  lines = []

  constructor (id, title) {
    this.id = id
    this.name = title
    if (id) {
      this.get()
    }
  }

  @action
  async get () {
    Toast.loading('正在加载...', 0)
    const result = await getChapter(this.id)
    runInAction(() => {
      this.name = result.name
      this.bookId = result.bookId
      this.content = result.content.replace(/\r\n/g, '')
      let content = this.content.split('    ')
      let lines = []
      for (let i = 0; i < content.length; i++) {
        // console.warn(JSON.stringify(content[i]))
        lines = lines.concat(lineFeed(content[i], 'row_' + i))
      }
      this.lines = lines
      Toast.hide()
    })
  }

  /**
   * 获取下一页
   */
  @action
  async next () {
    const result = await getChapterByIndex(this.bookId, this.id, 1)
    if (result) {
      runInAction(() => {
        this.id = result.id
        this.get()
      })
    } else {
      Toast.info('已经是最后一章了', 0.7)
    }
  }

  /**
   * 获取上一页
   */
  @action
  async prev () {
    const result = await getChapterByIndex(this.bookId, this.id, -1)
    if (result) {
      runInAction(() => {
        this.id = result.id
        this.get()
      })
    } else {
      Toast.info('已经是第一章了', 0.7)
    }
  }

  @action
  async jump (index) {
    const result = await getChapterByIndex(this.bookId, this.id, index)
    if (result) {
      runInAction(async() => {
        this.id = result.id
        await this.get()
      })
    } else {
      Toast.info(index > 0 ? '已经是最后一章了' : '已经是第一章了', 0.7)
    }
  }

  @action
  discover (page) {
    updateDiscover({id: this.bookId, discoverPage: page})
  }
}

export default ChapterModel
