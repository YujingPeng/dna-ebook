import db from '../database'
import {
  load, matchRule,
  generateBookModel, generateChapters
} from './utils'
/** 书列表 */
export async function getBookList () {
  return db.objects('Book').filtered(`isCollect = true`)
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
 * 创建新的书
 * @param {String} id 主键
 * @param {String} uri 详细页地址，用于判断是否存在该目录地址
 */
export async function newBook (id, uri, options) {
  return new Promise(async (resolve, reject) => {
    try {
      const rule = matchRule(uri)
      if (!rule) return null
      const $body = await load(uri)
      let info = generateBookModel($body, rule, uri) || {}
      let result = { ...options, ...info }
      result.id = id
      result.uri = uri
      result.updateAt = info.updateAt || ''
      result.isCollect = false
      // 爬取章节
      const chapterList = generateChapters($body, rule, result.id) || []
      result.totalChapter = chapterList.length
      result.discoverChapterId = chapterList[0].id
      result.latestChapter = chapterList[chapterList.length - 1].text
      result.discoverChapterName = chapterList[0].text
      let book = {
        ...result,
        chapters: chapterList
      }
      db.write(() => {
        db.create('Book', book)
      })
      // 详细页面点击收藏再保存到缓存
      resolve(result)
    } catch (error) {
      reject(error.message)
    }
  })
  // console.warn('爬取页面', uri)
}

/**
 * 保存小说
 * @param {String} id 主键
 * @param {Bool} isCollect 是否收藏
 */
export function storeUp (id, isCollect = true) {
  return new Promise((resolve, reject) => {
    try {
      db.write(() => {
        db.create('Book', { id, isCollect }, true)
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
