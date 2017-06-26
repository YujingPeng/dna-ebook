import Realm from 'realm'
import Book from './schema/Book'
import Chapter from './schema/Chapter'
import ChapterContent from './schema/ChapterContent'
import Settings from './schema/Settings'
import SearchHistory from './schema/SearchHistory'

const realm = new Realm({
  schema: [
    Chapter, ChapterContent, Book,
    Settings, SearchHistory
  ]
})

export default realm
