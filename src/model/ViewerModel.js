import { observable, action, runInAction, computed } from 'mobx'
import { Platform, Dimensions } from 'react-native'
import { getChapter, getChapterByIndex, updateDiscover } from '../service'
import { Toast } from 'antd-mobile'
var ScreenWidth = Dimensions.get('window').width
const ScreenHeight = Dimensions.get('window').height

const lineHeight = 30
let fontSize = 18

const OFFSET = Platform.OS === 'ios' ? 70 : 40
const LINE_INDENT = Platform.OS === 'ios' ? '\t' : '\t\t\t\t\t'
const LINE_WRAP = '\n'

function zhcnCode (s) {
  return /[^\x00-\xff]/.test(s)
}

function AZCode (s) {
  return /[\x41-\x5a]/.test(s)
}

/**
 * 获取一个字符的大小
 * @param {String} char 要判断的字符
 * @param {Number} fontSize 初始大小，以中文字大小为准
 */
function getCharSize (char, fontSize) {
  return Platform.OS === 'ios' ? fontSize : zhcnCode(char) ? fontSize : AZCode(char) ? fontSize * 0.8 : fontSize * 0.6
}

// 取整
const lineMax = Math.round((ScreenHeight - OFFSET) / lineHeight)
const lineWidth = ScreenWidth - 18

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
  let lineEnd = lineWidth - (fontSize * 2)
  if (!str && str === '') return result
  let start = 0
  let size = 0
  for (let i = 0, length = chars.length; i < length; i++) {
    size = getCharSize(chars[i], fontSize)
    if ((linefeed + size) >= lineEnd) {
      // i--
      if (result.length === 0) {
        result.push(LINE_INDENT + chars.slice(start, i).join('') + LINE_WRAP)
        lineEnd = lineWidth
      } else {
        result.push(chars.slice(start, i).join('') + LINE_WRAP)
      }
      start = i
      linefeed = size
    } else {
      linefeed += size
    }
  }
  result.push(
    result.length === 0
      ? LINE_INDENT + chars.slice(start).join('') + LINE_WRAP
      : chars.slice(start).join('') + LINE_WRAP
  )
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

  @observable
  pageIndex = 0

  @observable
  isNightMode = false

  @observable
  list = []

  @observable
  pagers = []

  @observable
  total=1

  constructor (id, bookId, title, pageIndex) {
    this.id = id
    this.name = title
    this.pageIndex = pageIndex || 0
    if (id) {
      this.get()
    }
  }

  @computed get nextIndex () {
    return (this.pageIndex + 1) || 1
  }

  @action
  async get () {
    try {
      const result = await getChapter(this.id)
      runInAction(() => {
        this.name = result.name
        this.bookId = result.bookId
        this.content = result.content.replace(/\r\n/g, '')
        let content = this.content.split('    ')
        let lines = []
        for (let i = 0; i < content.length; i++) {
          lines = lines.concat(lineFeed(content[i], 'row_' + i))
        }
        let pagers = []
        const total = Math.ceil(lines.length / lineMax)
        for (var i = 0; i < total; i++) {
          pagers.push({ key: 'page' + i, context: lines.slice(lineMax * i, lineMax * (i + 1)).join('') })
        }
        this.total = total
        this.pagers.replace(pagers)
        Toast.hide()
      })
    } catch (error) {
      Toast.fail('加载失败!!!')
    }
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
    return new Promise(async (resolve, reject) => {
      const result = await getChapterByIndex(this.bookId, this.id, index)
      if (result) {
        runInAction(async () => {
          this.id = result.chapterId
          await this.get()
          runInAction(() => {
            this.pageIndex = index < 0 ? (this.total - 1) : 0
            updateDiscover({
              id: this.bookId,
              discoverPage: this.pageIndex,
              discoverChapterId: result.chapterId,
              discoverChapterIndex: result.index,
              discoverChapterName: result.text
            })
            return resolve(this.pageIndex)
          })
        })
      } else {
        Toast.info(index > 0 ? '已经是最后一章了' : '已经是第一章了', 0.7)
      }
    })
  }

  @action
  discover (page) {
    this.pageIndex = page
    updateDiscover({ id: this.bookId, discoverPage: page })
  }
}

export default ChapterModel
