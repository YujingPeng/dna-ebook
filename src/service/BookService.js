
import cheerio from 'cheerio-without-node-native'
import uuid from 'react-native-uuid'
import { TextDecoder } from 'text-encoding'
import axios from 'axios'

// https://www.baidu.com/s?q1=%E9%AD%94%E5%A4%A9%E8%AE%B0&q2=&q3=&q4=&rn=10&lm=0&ct=0&ft=&q5=&q6=biquge.com&tn=baidulocal

const rules = {
  'biquge': {
    host: 'http://www.biquge.com',
    info: {
      name: '#info > h1',
      author: {
        selector: '#info > p:nth-child(2)',
        pattern: '作    者：'
      },
      updateAt: {
        selector: '#info > p:nth-child(4)',
        pattern: '最后更新：'
      },
      latestChapter: {
        selector: '#info > p:nth-child(5) > a',
        pattern: '最新章节：'
      },
      desc: '#intro'
    },
    thumbImage: '#fmimg > img',
    searchThumbImage: '/files/article/image',
    chapterMenu: '#list > dl > dd > a',
    content: '#content'
  }
}

function translator ($) {
  const self = {}
  const { info, thumbImage, host } = BookService.rules.biquge
  for (let [k, v] of Object.entries(info)) {
    if (v.pattern) {
      const text = $(v.selector).text()
      self[k] = text.replace(v.pattern, '')
    } else {
      self[k] = $(v).text()
    }
  }
  self.thumbImage = `${host}${$(thumbImage).attr('src')}`
  return self
}

function translatorChapterMenu ($) {
  const { host } = BookService.rules.biquge
  let list = []
  $('#list>dl>dd>a').each((i, item) => {
    const $elem = $(item)
    let uri = host + $elem.attr('href')
    let text = $elem.text()
    const index = list.findIndex(item => item.uri === uri)
    if (!!text && !!uri && index < 0) {
      list.push({
        id: Date.now(), uri, text
      })
    }
  })

  const len = list.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (list[i].uri < list[j].uri) {
        let temp = list[i]
        list[i] = list[j]
        list[j] = temp
      }
    }
  }

  return list
}

/** 获取搜索列表预览图片 */
function getSearchThumbUri (host, bookUri) {
  const rule = rules[host]
  let params = bookUri.split('/')
  let bookHostId = params[params.length - 2]
  let bookParams = bookHostId.split('_')
  let uri = `${rule.host}${rule.searchThumbImage}/${parseInt(bookParams[0]) + 1}/${bookParams[1]}/${bookParams[1]}.jpg`
  return uri
}

export default class BookService {
  static rules = rules;

  static async fetchData (url) {
    let headers = {
      // 'Proxy-Connection': 'keep-alive',
      // 'Cache-Control': 'max-age=0',
      // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      // 'Origin': origin,
      'User-Agent:': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50'
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // 'Accept-Encoding': 'compress,gzip,deflate,sdch',
      // 'Accept-Language': 'zh-CN,zh;q=0.8'
      // 'Accept-Charset': 'GBK,utf-8;q=0.7,*;q=0.3'
    }
    try {
      // const res = await fetch(url, option)
      // const resHtml = await res.text()
      // console.log('fetchData', url, resHtml)

      const resHtml = await axios.get(url, {headers})
      console.log('fetchData', url, resHtml)
      return cheerio.load(resHtml.data)
    } catch (error) {
      throw new Error({ message: '抓取失败' })
    }
  }

  static async fetchDecode (url) {
    try {
      const res = await fetch(url)
      const buffer = await res.arrayBuffer()
      const decode = new TextDecoder('utf-8')
      const resHtml = decode.decode(buffer)
      return resHtml// cheerio.load(resHtml)
    } catch (error) {
      throw new Error({ message: '抓取失败' })
    }
  }

  /**
   * 获取全部小说
   */
  static async getList () {
    try {
      const storage = global.storage
      const books = await storage.getAllDataForKey('book')

      console.log(books)
      if (books) {
        return books
      } else {
        return []
      }
    } catch (error) {
      return []
    }
  }

  static async newBook (id, uri) {
    console.log('爬取页面', uri)
    const $ = await BookService.fetchData(uri)
    let data = translator($) || {}
    data.id = id
    data.uri = uri
    data.chapterList = translatorChapterMenu($) || []
    // 详细页面点击收藏再保存到缓存
    // BookService.saveBook(data)
    return data
  }

  /**
   * 获取Book详细
   *
   * @param {String} id - bookId
   * @param {Number} uri - new book uri
   * @returns {BookModel} a BookModel object
   */
  static async getBookInfo (id, uri) {
    try {
      const storage = global.storage
      storage.sync = {
        async book (params) {
          let { id, resolve, reject, syncParams: { uri } } = params
          console.log('异步读取', params, uri)
          try {
            const $ = await BookService.fetchData(uri)
            let data = translator($) || {}
            data.id = id
            data.uri = uri
            data.chapterList = translatorChapterMenu($) || []
            storage.save({
              key: 'book',  // 注意:请不要在key中使用_下划线符号!
              id: id,   // 注意:请不要在id中使用_下划线符号!
              rawData: data
            })
            resolve && resolve(data)
          } catch (error) {
            reject && reject(error)
          }
        }
      }
      let book = await storage.load({
        id,
        key: 'book',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          uri
        }
      })
      if (book) {
        return book
      } else {
        throw new Error('获取数据失败!')
      }
    } catch (error) {
      throw new Error('获取数据失败:' + error.message)
    }
  }

  /**
   * 保存小说信息及目录
   * @param {BookModel}  model
   */
  static async saveBook (model) {
    const storage = global.storage
    storage.save({
      key: 'book',  // 注意:请不要在key中使用_下划线符号!
      id: model.id,   // 注意:请不要在id中使用_下划线符号!
      rawData: model
    })
  }

  /**
   * 移除book
   * @param {string} bookId bookid
   */
  static async removeBook (bookId) {
    const storage = global.storage
    storage.remove({
      key: 'book',
      id: bookId
    })
  }

  /**
   * 获取章节
   * @param {string} 小说id
   * @param {Number} 章节id
   */
  static async getChapter (bookId, chapterId) {
    // todo
  }

  /**
   * 搜索
   * @param {String} name
   */
  static async search (name, site) {
    let uri = `http://zhannei.baidu.com/cse/site?q=${name}&cc=${site}&stp=1`
    const $ = await BookService.fetchData(uri)
    let result = []
    $('#results>div').each((i, item) => {
      const $name = $(item).find('h3>a')
      // const $img = $(item).find('img')
      const uri = $name.attr('href')
      result.push({
        id: uuid.v4(),
        name: $name.text(),
        uri: uri,
        thumbImage: getSearchThumbUri('biquge', uri)
      })
    })
    return result
  }
}
