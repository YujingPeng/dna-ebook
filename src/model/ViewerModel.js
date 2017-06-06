import { observable, action, runInAction, computed } from 'mobx'
import { getChapter, getChapterByIndex, updateDiscover } from '../service'
import { Toast } from 'antd-mobile'
var Dimensions = require('Dimensions')
var ScreenWidth = Dimensions.get('window').width
const ScreenHeight = Dimensions.get('window').height
function zhcnCode (s) {
  return /[^\x00-\xff]/.test(s)
}

const lineHeight = 30
let fontSize = 20
// 取整
// const lineEnd = parseInt(ScreenWidth / 20)
const lineMax = Math.round((ScreenHeight - 100) / lineHeight)

const textStyles = {
  fontSize, lineHeight
}
const textFirstStyles = {
  fontSize, lineHeight, paddingLeft: fontSize * 2
}

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
          style: textFirstStyles,
          children: chars.slice(start, i).join('')
        })
        lineEnd = ScreenWidth
      } else {
        result.push({
          key: keyPrefix + '_' + i,
          style: textStyles,
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
    style: result.length === 0 ? textFirstStyles : textStyles,
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

  @observable
  pageIndex = 0

  constructor (id, title, pageIndex) {
    console.log('dsdasd')
    this.id = id
    this.name = title
    this.pageIndex = pageIndex
    if (id) {
      this.get()
    }
  }

  @computed get total () {
    const length = Math.ceil(this.lines.length / lineMax)
    return length === 0 ? 1 : length
  }

  @computed get nextIndex () {
    return this.pageIndex + 1
  }

  @computed get dataSource () {
    return this.lines.slice(lineMax * this.pageIndex, lineMax * (this.pageIndex + 1))
  }

  @action
  async get () {
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
      runInAction(async () => {
        this.id = result.chapterId
        await this.get()
        runInAction(() => {
          this.pageIndex = index < 0 ? (this.total - 1) : 0
          updateDiscover({
            id: this.bookId,
            discoverPage: this.pageIndex,
            discoverChapterId: result.chapterId,
            discoverChapterIndex: result.index
          })
        })
      })
    } else {
      Toast.info(index > 0 ? '已经是最后一章了' : '已经是第一章了', 0.7)
    }
  }

  @action
  discover (page) {
    this.pageIndex = page
    updateDiscover({ id: this.bookId, discoverPage: page })
  }
}

export default ChapterModel
