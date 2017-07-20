import moment from 'moment'
import db from '../database'
import {
  load, matchRule, generateChapters
} from './utils'
/**
 * 获取章节列表
 * @param {Object} bookId 书主键
 * @param {String} chapterId 章节主键
 */
export function getChapterList (bookId, chapterId) {
  const chapters = db.objects('Chapter').filtered(`bookId = "${bookId}"`)
  const currentIndex = !chapterId ? 0 : chapters.findIndex(item => chapterId === item.id)
  return { chapters, index: currentIndex }
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
 * 更新章节目录
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
