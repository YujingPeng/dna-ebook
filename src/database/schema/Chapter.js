class Chapter { }

Chapter.schema = {
  name: 'Chapter',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    bookId: { type: 'string', indexed: true },
    text: 'string',
    uri: 'string'
  }
}

export default Chapter
