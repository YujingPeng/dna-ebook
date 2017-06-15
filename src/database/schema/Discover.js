
class Discover {
}

Discover.schema = {
  name: 'Discover',
  primaryKey: 'id',
  properties: {
    id: {type: 'string', indexed: true},
    bookId: {type: 'string', indexed: true},
    chapterId: 'string',
    chapterIndex: 'int',
    page: 'int',
    total: 'int'
  }
}

export default Discover
