class ChapterContent {}

ChapterContent.schema = {
  name: 'ChapterContent',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    bookId: { type: 'string', indexed: true },
    content: 'string'
  }
}

export default ChapterContent
