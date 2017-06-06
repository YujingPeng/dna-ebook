import Realm from 'realm'
import Book from './schema/Book'
import Discover from './schema/Discover'
import Chapter from './schema/Chapter'
import ChapterContent from './schema/ChapterContent'
import Settings from './schema/Settings'

const realm = new Realm({
  schema: [
    Discover, Chapter, ChapterContent, Book, Settings
  ]
})

export default realm
