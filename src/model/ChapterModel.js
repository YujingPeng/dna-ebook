import { observable, action, runInAction } from 'mobx'
import { load, matchRule, getChapter } from '../service'
import personStore from '../store/personStore'
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
    if ((linefeed + size) > lineEnd) {
      i--
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
  bookId = '1001';

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
    const chapter = await getChapter(this.id)
    // const rule = matchRule(this.uri)
    runInAction(() => {
      // const $ = cheerio.load(resHtml)
      // let text = $(rule.content).text()
      this.content = chapter.content
      let content = chapter.content.split('    ')
      let result = []
      for (let i = 0; i < content.length; i++) {
        result = result.concat(lineFeed(content[i], 'row_' + i))
      }
      this.lines = result
    })
  }

  /**
   * 获取下一页
   */
  @action
  async next () {
    const data = personStore.cacheBook.next()
    if (data) {
      this.uri = data.uri
      this.name = data.text
      this.get()
    }
  }

  /**
   * 获取上一页
   */
  @action
  async prev () {
    const data = personStore.cacheBook.prev()
    if (data) {
      this.uri = data.uri
      this.name = data.text
      this.get()
    }
  }
}

export default ChapterModel
