import cheerio from 'cheerio-without-node-native'
import uuid from 'react-native-uuid'
import { TextDecoder } from 'text-encoding'
import axios from 'axios'
import db from '../database'
import { rules } from '../env'

const config = {
  headers: {
    'User-Agent:': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50'
  },
  responseType: 'arraybuffer'
}

async function fetchData (uri) {
  try {
    return await axios.get(uri)
  } catch (error) {
    throw error
  }
}

export async function load (uri) {
  try {
    const rule = matchRule(uri) || {}
    const encode = rule.encode || 'utf-8'
    const res = await axios({ ...config, url: uri })
    const buffer = res.data
    // const res = await fetch(uri)
    // const buffer = await res.arrayBuffer()
    const decode = new TextDecoder(encode)
    const resHtml = decode.decode(buffer)
    return cheerio.load(resHtml)
  } catch (error) {
    throw error
  }
}
export async function search (name, site) {
  // http://zhannei.baidu.com/cse/search?q=&click=1&s=5334330359795686106&nsid=
  let uri = `http://zhannei.baidu.com/cse/site?q=${name}&cc=${site}&stp=1`
  const $ = await load(uri)
  let result = []
  $('#results>div.result').each((i, item) => {
    const $name = $(item).find('h3>a')
    const names = $name.text().split('_')
    const name = names[0].replace('最新章节', '')
    const uri = $name.attr('href')
    result.push({
      id: uuid.v4(),
      name,
      siteName: names[names.length - 1],
      uri: uri,
      thumbImage: getSearchThumbUri(site, uri)
    })
  })
  return result
}

export async function newBook (id, uri) {
  // console.warn('爬取页面', uri)
  const rule = matchRule(uri)
  // console.warn('爬取页面', rule)
  if (!rule) return null
  const $ = await load(uri)
  let book = translator(rule, $, uri) || {}
  book.id = id
  book.uri = uri
  // book.updateAt =
  const chapterList = translatorChapterMenu(rule, $, book.id) || []
  book.totalChapter = chapterList.length
  book.thumbImageBase64 = ''
  book.discoverChapterId = chapterList[0].id
  book.latestChapter = chapterList[chapterList.length - 1].text
  book.discoverChapterName = chapterList[0].text
  book.discoverChapterIndex = 0
  book.discoverPage = 0
  book.chapters = chapterList
  // 详细页面点击收藏再保存到缓存
  return book
}

export function saveBook (book) {
  return new Promise((resolve, reject) => {
    // const { ...book } = model
    // console.warn('saveBook', book)
    db.write(() => {
      db.create('Book', book)
      // chapterList.forEach(item => {
      //   db.create('Chapter', item)
      // })
      resolve(true)
    })
  })
}

export async function getBookList (params) {
  return db.objects('Book')
}

export function getChapterList (bookId, chapterId) {
  const chapters = db.objects('Chapter').filtered(`bookId = "${bookId}"`)
  const currentIndex = chapters.findIndex(item => chapterId === item.id)
  let end = 0
  let start = 0
  if ((currentIndex + 10) > chapters.length) {
    start = currentIndex - 20
    end = chapters.length
  } else if ((currentIndex - 10) <= 0) {
    start = 0
    end = 20
  } else {
    start = currentIndex - 10
    end = currentIndex + 10
  }
  return chapters.slice(start, end)
}

export async function getBookById (bookId) {
  return new Promise((resolve, reject) => {
    db.write(() => {
      // console.time('1')
      const book = db.objectForPrimaryKey('Book', bookId)
      // const chapterList = db.objects('Chapter')
      // console.timeEnd('1')
      resolve(book)
    })
  })
}

export function removeBook (bookId) {
  return new Promise((resolve, reject) => {
    db.write(() => {
      const result = db.objectForPrimaryKey('Book', bookId)
      // const chapterList = db.objects('Chapter').filtered(`bookId = "${bookId}"`)
      // db.delete(chapterList)
      db.delete(result)
      resolve(true)
    })
  })
}

export async function getChapter (chapterId) {
  return new Promise((resolve, reject) => {
    try {
      let chapter = db.objectForPrimaryKey('Chapter', chapterId)
      let chapterContent = db.objectForPrimaryKey('ChapterContent', chapterId)
      if (chapterContent) {
        resolve({ name: chapter.text, bookId: chapter.bookId, content: chapterContent.content })
      } else {
        const rule = matchRule(chapter.uri)
        load(chapter.uri).then($ => {
          const content = $(rule.content).text()
          db.write(() => {
            db.create('ChapterContent', { id: chapterId, bookId: chapter.bookId, content })
          })
          resolve({ name: chapter.text, bookId: chapter.bookId, content })
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}

export async function getChapterByIndex (bookId, chapterId, index) {
  return new Promise((resolve, reject) => {
    try {
      const chapters = db.objects('Chapter').filtered(`bookId = "${bookId}"`)
      const currentIndex = chapters.findIndex(item => chapterId === item.id)
      const result = chapters[currentIndex + index]
      if (result) {
        resolve({ chapterId: result.id, index: currentIndex + index, text: result.text })
      } else {
        resolve(null)
      }
      // updateDiscover({id: bookId, discoverChapterId: result.id, discoverChapterIndex: currentIndex + 1, discoverPage: 0})
    } catch (error) {
      reject(error)
    }
  })
}

export async function updateDiscover (book) {
  return new Promise((resolve, reject) => {
    try {
      db.write(() => {
        db.create('Book', book, true)
      })
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

export function bulkCacheChapterContent (bookId, chapterId, start, count) {
  return new Promise(async (resolve, reject) => {
    try {
      const index = db.objects('Chapter').findIndex(item => chapterId === item.id)
      const _start = start ? 0 : index + 1
      const _end = count ? index + 1 + count : null
      const chapters = db.objects('Chapter')
        .filtered(`bookId = "${bookId}"`)
        .slice(_start, _end)
      for (var i = 0; i < chapters.length; i++) {
        const chapter = chapters[i]
        const rule = matchRule(chapter.uri)
        const $ = await load(chapter.uri)
        const content = $(rule.content).text()
        db.write(() => {
          // console.warn(chapter.id)
          db.create('ChapterContent', { id: chapter.id, bookId, content }, true)
        })
        // resolve(true)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export function matchRule (uri) {
  return Object.values(rules).find(item => uri.indexOf(item.host) >= 0)
}

function translator (rule, $, uri) {
  const self = {}
  const { info, thumbImage, host } = rule
  for (let [k, v] of Object.entries(info)) {
    if (v.pattern) {
      const text = $(v.selector).text()
      self[k] = text.replace(v.pattern, '')
    } else {
      self[k] = $(v).text()
    }
  }
  let thumbImageUri = $(thumbImage).attr('src')
  if (!thumbImageUri) {
    self.thumbImage = getSearchThumbUri(host, uri)
  } else {
    self.thumbImage = `${host}${thumbImageUri}`
  }

  return self
}

function translatorChapterMenu (rule, $, bookId) {
  const { host, firstChapterIndex } = rule
  let list = []
  $('#list>dl>dd>a').each((i, item) => {
    if (i >= firstChapterIndex) {
      const $elem = $(item)
      let uri = host + $elem.attr('href')
      let text = $elem.text()
      const index = list.findIndex(item => item.uri === uri)
      if (!!text && !!uri && index < 0) {
        list.push({
          id: uuid.v4(), uri, text, bookId
        })
      }
    }
  })

  // const len = list.length
  // for (let i = 0; i < len; i++) {
  //   for (let j = 0; j < len; j++) {
  //     if (list[i].uri < list[j].uri) {
  //       let temp = list[i]
  //       list[i] = list[j]
  //       list[j] = temp
  //     }
  //   }
  // }

  return list
}

/** 获取搜索列表预览图片 */
function getSearchThumbUri (site, bookUri) {
  if (!bookUri) return ''
  const rule = matchRule(bookUri)
  if (rule) {
    let params = bookUri.split('/')
    let bookHostId = params[params.length - 1] === '' ? params[params.length - 2] : params[params.length - 1]
    let bookParams = bookHostId.split('_')
    // let uri = `${rule.host}${rule.searchThumbImage}/${parseInt(bookParams[0]) + 1}/${bookParams[1]}/${bookParams[1]}.jpg`
    let uri = rule.searchThumbImage(rule.host, bookParams[0], bookParams[1])
    return uri
  } else {
    return ''
  }
}
