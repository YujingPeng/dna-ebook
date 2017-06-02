
class Chapter {
  // toJSON () {
  //   return {
  //     id: this.id,
  //     bookId: this.bookId,
  //     text: this.text,
  //     uri: this.uri
  //   }
  // }
}

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
