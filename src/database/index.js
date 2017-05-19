import Realm from 'realm'
import Book from './schema/Book'
import Discover from './schema/Discover'

const realm = new Realm({
  schema: [
    Book, Discover
  ]
})

export default realm
