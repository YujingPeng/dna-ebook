import moment from 'moment'
import urlencode from 'urlencode'
import db from '../database'
import {
  load, matchRule,
  generateBookModel, generateChapters, generateSearchModel
} from './utils'

/**
 * 根据关键字和站点查询
 * @param {String} name 关键字
 * @param {String} site 站点的名字
 */
export async function search (keyword, site) {
  try {
    let href = ''
    if (site.indexOf('http://zhannei.baidu.com') < 0) {
      href = site + urlencode(keyword, 'gbk')
    } else {
      href = site + keyword
    }
    const $body = await load(href)
    let result = generateSearchModel($body, site)

    return result
  } catch (error) {
    console.warn(error)
    return []
  }
}

export async function getSearchHistory () {
  return db.objects('SearchHistory').filtered(`isDeleted = false`).sorted('updateAt', true).slice(0, 10)
}

export async function getSettings () {
  return db.objectForPrimaryKey('Settings', 'settingId') || {}
}

/** 书列表 */
export async function getBookList () {
  return db.objects('Book')
}

/**
 * 根据Id获取内容
 * @param {String} bookId 主键
 */
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
/**
 * 获取章节列表
 * @param {Object} bookId 书主键
 * @param {String} chapterId 章节主键
 */
export function getChapterList (bookId, chapterId) {
  const chapters = db.objects('Chapter').filtered(`bookId = "${bookId}"`)
  const currentIndex = !chapterId ? 0 : chapters.findIndex(item => chapterId === item.id)
  return {chapters, index: currentIndex}
}

/**
 * 获取章节内容
 * @param {UUID} chapterId
 */
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
            chapter.cached = true
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

/**
 * 根据索引获取章节实体·
 * @param {String} bookId 书主键
 * @param {String} chapterId 章节主键
 * @param {Number} index 当前章节的索引
 */
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

/**
 * 批量缓存章节内容
 * @param {String} bookId 书主键
 * @param {String} chapterId 章节主键
 * @param {Number} start 开始位置
 * @param {Number} count 结束位置
 */
export async function bulkCacheChapterContent (bookId, chapterId, start, count) {
  return new Promise(async (resolve, reject) => {
    try {
      const index = db.objects('Chapter').findIndex(item => chapterId === item.id)
      const _start = start || index + 1
      const _end = !count ? -1 : index + 1 + count
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
          chapter.cached = true
          db.create('ChapterContent', { id: chapter.id, bookId, content }, true)
        })
      }
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 保存查询关键字
 * @param {string} keyword 关键字
 */
export function cachedSearchKeyword (keyword) {
  db.write(() => {
    const history = db.objectForPrimaryKey('SearchHistory', keyword)
    if (history) {
      history.updateAt = new Date()
      history.times = history.times + 1
    } else {
      db.create('SearchHistory', { keyword })
    }
  })
}
/**
 * 创建新的书
 * @param {String} id 主键
 * @param {String} uri 详细页地址，用于判断是否存在该目录地址
 */
export async function newBook (id, uri, type) {
  // console.warn('爬取页面', uri)
  const rule = matchRule(uri)
  // console.warn('爬取页面', rule)
  if (!rule) return null
  const $body = await load(uri)
  let book = generateBookModel($body, rule, uri) || {}
  book.id = id
  book.uri = uri
  book.type = type || ''
  book.updateAt = book.updateAt || ''
  // 爬取章节
  const chapterList = generateChapters($body, rule, book.id) || []
  book.totalChapter = chapterList.length
  book.discoverChapterId = chapterList[0].id
  book.latestChapter = chapterList[chapterList.length - 1].text
  book.discoverChapterName = chapterList[0].text
  book.chapters = chapterList
  // 详细页面点击收藏再保存到缓存
  return book
}

/**
 * 保存小说
 * @param {Object} book 数据库实体
 */
export function saveBook (book) {
  return new Promise((resolve, reject) => {
    try {
      db.write(() => {
        book.isCollect = true
        db.create('Book', book)
        resolve(true)
      })
    } catch (error) {
      reject(error.message)
    }
  })
}

/**
 * 删除
 * @param {String} bookId 主键
 */
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
/**
 * 更新阅读信息
 * @param {Book} book
 */
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

/**
 *
 * @param {String} id 章节主键
 * @param {String} uri 目录地址
 */
export async function updateChapterList (id, uri) {
  return new Promise(async (resolve, reject) => {
    try {
      const rule = matchRule(uri)
      // console.warn('爬取页面', rule)
      if (!rule) return null
      const $body = await load(uri)
      const chapterList = generateChapters($body, rule, id) || []
      db.write(() => {
        const book = db.objectForPrimaryKey('Book', id)
        const start = book.totalChapter
        if (start < chapterList.length) {
          const updatelist = chapterList.slice(start)
          book.chapters.push(...updatelist)
          book.totalChapter = chapterList.length
          book.latestChapter = chapterList[chapterList.length - 1].text
        }
        book.updateAt = moment().format('YYYY-MM-DD HH:mm:ss')
        resolve(chapterList.length - start)
      })
    } catch (error) {
      reject(error)
    }
  })
}
export async function saveSettings (settings) {
  db.write(() => {
    db.create('Settings', settings, true)
  })
}
