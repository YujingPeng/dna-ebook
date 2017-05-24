import Realm from 'realm'
import Book from './schema/Book'
import Discover from './schema/Discover'
import Chapter from './schema/Chapter'

const realm = new Realm({
  schema: [
    Discover, Chapter, Book
  ]
})

export default realm
