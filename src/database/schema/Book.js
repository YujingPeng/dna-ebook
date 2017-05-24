class Book { }

Book.schema = {
  name: 'Book',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    uri: 'string',
    name: 'string',
    desc: 'string',
    author: 'string',
    updateAt: 'string',
    latestChapter: 'string',
    thumbImage: 'string',
    thumbImageBase64: 'string',
    chapterList: { type: 'list', objectType: 'Chapter' },
    discover: { type: 'Discover' }
  }
}

export default Book
