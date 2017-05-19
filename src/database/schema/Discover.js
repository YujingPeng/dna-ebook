class Discover {}

Discover.schema = {
  name: 'Discover',
  primaryKey: 'bookId',
  properties: {
    bookId: {type: 'string', indexed: true},
    chapterId: 'string',
    page: 0,
    total: 1
  }
}

export default Discover
