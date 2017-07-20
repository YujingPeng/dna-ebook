import { observable, action, runInAction, computed } from 'mobx'
import { Platform, Dimensions } from 'react-native'
import { getChapter, getChapterByIndex, updateDiscover } from '../service'
import { Toast } from 'antd-mobile'
import settingStore from '../store/settingStore'
const ScreenWidth = Dimensions.get('window').width
const ScreenHeight = Dimensions.get('window').height

const OFFSET = Platform.OS === 'ios' ? 70 : 40
const LINE_INDENT = '        '
const LINE_WRAP = '\n'

function zhcnCode (s) {
  return /[\u3400-\u4DB5\u4E00-\u9FA5\u9FA6-\u9FBB\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFF00-\uFFEF\u2E80-\u2EFF\u3000-\u303F\u31C0-\u31EF\u2F00-\u2FDF\u2FF0-\u2FFF\u3100-\u312F\u31A0-\u31BF\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\u4DC0-\u4DFF\uA000-\uA48F\uA490-\uA4CF\u2800-\u28FF\u3200-\u32FF\u3300-\u33FF\u2700-\u27BF\u2600-\u26FF\uFE10-\uFE1F\uFE30-\uFE4F，。？：；！、【】]/.test(s)
}

function HalfCode (s) {
  return /[”“’‘~@#$%&*(),.?:;'!"\-a-z]/.test(s)
}

/**
 * 获取一个字符的大小
 * @param {String} char 要判断的字符
 * @param {Number} fontSize 初始大小，以中文字大小为准
 */
function getCharSize (char, fontSize) {
  return zhcnCode(char) ? fontSize : HalfCode(char) ? fontSize * 0.55 : fontSize * 0.85
}

// 取整

const lineMax = Math.round((ScreenHeight - OFFSET) / settingStore.lineHight)
const lineWidth = ScreenWidth - settingStore.fontSize * 2.5

/**
 *  字符串换行处理
 * @param {string} str 要拆分的字符串
 * @param {string} prefix key的数据的前缀
 */
function lineFeed (str) {
  let result = []
  let chars = str.split('')
  let linefeed = 0
  // 第一次转换需要进行首航缩进
  let lineEnd = lineWidth - (settingStore.indentWidth)
  if (!str && str === '') return result
  let start = 0
  let size = 0
  for (let i = 0, length = chars.length; i < length; i++) {
    size = Math.ceil(getCharSize(chars[i], settingStore.fontSize))
    if ((linefeed + size) >= lineEnd) {
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

class ReadingStore {
  @observable bookId = ''
  /** 章节Id */
  @observable chapterId = ''
  /** 章节地址 */
  @observable chapterUri = ''
  /** 章节名 */
  @observable chapterName = ''
  /** 页码 */
  @observable pageIndex = 0
  /** 是否是夜间模式 */
  @observable isNightMode = false

  /** 页 */
  @observable pagers = [{ key: 'page0', context: '' }, { key: 'page1', context: '' }]
  /** 总数 */
  @observable total = 1
  @action
  async get (chapterId, pageIndex) {
    try {
      const result = await getChapter(chapterId || this.chapterId)
      runInAction(() => {
        if (pageIndex) {
          this.pageIndex = pageIndex
        }
        if (chapterId) {
          this.chapterId = chapterId
        }
        this.chapterName = result.name
        this.bookId = result.bookId
        this.content = result.content.replace(/\r\n/g, '')
        // 处理章节内容
        let content = this.content.split('    ')
        let lines = []
        for (let i = 0; i < content.length; i++) {
          lines = lines.concat(lineFeed(content[i]))
        }
        let pagers = [{ key: 'page0', context: '' }]
        const total = Math.ceil(lines.length / lineMax)
        for (var i = 0; i < total; i++) {
          pagers.push({
            key: 'page' + i + 1,
            context: lines.slice(lineMax * i, lineMax * (i + 1)).join('')
          })
        }
        pagers.push({ key: 'page' + total + 1, context: '' })
        this.total = total
        this.pagers.replace(pagers)
        Toast.hide()
      })
    } catch (error) {
      Toast.fail('加载失败!!!')
    }
  }

  /**
   * 章节跳转
   * @param {Number} index 章节号，1或者-1
   */
  @action
  async jump (index) {

  }

  /**
   * 记录当前页码
   * @param {Number} page 页码
   */
  @action
  async discover (page) {
    this.pageIndex = page
    updateDiscover({ id: this.bookId, discoverPage: page })
  }
}

const readingStore = new ReadingStore()

export default readingStore
