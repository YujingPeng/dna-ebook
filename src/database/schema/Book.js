
class Book {
  // toJSON () {
  //   return {
  //     id: this.id,
  //     uri: this.uri,
  //     name: this.name,
  //     desc: this.desc,
  //     author: this.author,
  //     updateAt: this.updateAt,
  //     latestChapter: this.latestChapter,
  //     thumbImage: this.thumbImage,
  //     thumbImageBase64: this.thumbImageBase64,
  //     totalChapter: this.totalChapter,
  //     discoverChapterId: this.discoverChapterId,
  //     discoverChapterIndex: this.discoverChapterIndex,
  //     discoverPage: this.discoverPage
  //   }
  // }
}

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
    totalChapter: 'int',
    discoverChapterId: 'string',
    discoverChapterIndex: 'int',
    discoverChapterName: 'string',
    discoverPage: 'int',
    chapters: { type: 'list', objectType: 'Chapter' }
  }
}

export default Book
