import { observable, action, runInAction } from 'mobx'
import { Toast } from 'antd-mobile'
import BookService from './BookService'
import personStore from '../../store/personStore'
var Dimensions = require('Dimensions')
var ScreenWidth = Dimensions.get('window').width

function zhcnCode (s) {
  return /[^\x00-\xff]/.test(s)
}

let fontSize = 20
// 取整
// const lineEnd = parseInt(ScreenWidth / 20)

function lineFeed (str: string, prefix) {
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
          key: prefix + '_' + i,
          style: 'textFirst',
          children: chars.slice(start, i).join('')
        })
        lineEnd = ScreenWidth
      } else {
        result.push({
          key: prefix + '_' + i,
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
    key: prefix + '_',
    style: result.length === 0 ? 'textFirst' : 'text',
    children: chars.slice(start).join('')
  })
  return result
}

export default class ChapterModel {
  bookId = '1001';

  id = 0

  uri = ''

  @observable
  name = ''

  @observable
  numbers = ''

  @observable
  content = null

  @observable
  htmlstring = ''

  @observable
  lines = []

  constructor (uri, title) {
    this.uri = uri
    this.name = title
  }

  @action
  async get () {
    const $ = await BookService.fetchData(this.uri)
    const rule = BookService.rules.biquge
    runInAction(() => {
      // const $ = cheerio.load(resHtml)
      let text = $(rule.content).text()
      this.content = text
      let content = text.split('    ')
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
    // todo
    // alert('下一页')
    // const uri = this.uri
    // const book = await BookService.getBookInfo(this.bookId, this.uri)
    // const index = book.chapterList.findIndex(item => item.uri === uri)
    // if ((index + 1) === book.chapterList.length) {
    //   Toast.info('已经是最后一页了')
    //   return
    // }
    // const data = book.chapterList[index + 1]
    // if (data) {
    //   runInAction(() => {
    //     this.uri = data.uri
    //     this.name = data.text
    //   })
    //   this.get()
    // }
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
  async prev () {
    // todo
    // const uri = this.uri
    // const book = await BookService.getBookInfo(this.bookId, this.uri)
    // const index = book.chapterList.findIndex(item => item.uri === uri)
    // if (index === 0) {
    //   Toast.info('已经是第一页了', 1)
    //   return
    // }
    // const data = book.chapterList[index - 1]
    // if (data) {
    //   this.uri = data.uri
    //   this.get()
    // }
    const data = personStore.cacheBook.prev()
    if (data) {
      this.uri = data.uri
      this.name = data.text
      this.get()
    }
  }
}
