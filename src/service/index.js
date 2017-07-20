import { getBookById, getBookList, newBook, removeBook, updateDiscover, storeUp } from './book'
import { search, cachedSearchKeyword, getSearchHistory } from './search'
import { getChapter, getChapterByIndex, getChapterList, bulkCacheChapterContent, updateChapterList } from './chapter'
import { getSettings, saveSettings } from './setting'
import { getBookSourceName } from './utils'

export {
  getBookById, getBookList, newBook, removeBook, updateDiscover, storeUp,
  search, cachedSearchKeyword, getSearchHistory,
  getChapter, getChapterByIndex, getChapterList, bulkCacheChapterContent, updateChapterList,
  getSettings, saveSettings,
  getBookSourceName
}
