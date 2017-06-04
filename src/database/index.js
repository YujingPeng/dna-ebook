import Realm from 'realm'
import Book from './schema/Book'
import Discover from './schema/Discover'
import Chapter from './schema/Chapter'
import ChapterContent from './schema/ChapterContent'

const realm = new Realm({
  schema: [
    Discover, Chapter, ChapterContent, Book
  ]
})

export default realm
