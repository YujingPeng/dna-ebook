class Book { }

Book.schema = {
  name: 'Book',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    uri: 'string',
    name: 'string',
    createAt: 'date',
    desc: 'string',
    author: 'string',
    updateAt: 'date',
    latestChapter: 'string',
    thumbImage: 'string',
    thumbImageBase64: 'string',
    discover: { type: '<ObjectType>', objectType: 'Discover' }
  }
}

export default Book
