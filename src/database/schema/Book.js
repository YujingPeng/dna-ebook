
class Book {}

Book.schema = {
  name: 'Book',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    uri: 'string',
    name: 'string',
    desc: 'string',
    author: 'string',
    type: 'string',
    orderBy: { type: 'int', default: Date.now() },
    /** 更新时间 */
    updateAt: 'string',
    /** 是否已收藏，预留字段 */
    isCollect: {type: 'bool', default: true},
    /** 最新章节 */
    latestChapter: 'string',
    thumbImage: 'string',
    /** 预留字段，做预览图缓存准备 */
    thumbImageBase64: { type: 'string', default: '' },
    totalChapter: 'int',
    /** 阅读相关信息 */
    discoverChapterId: 'string',
    discoverChapterIndex: { type: 'int', default: 0 },
    discoverChapterName: 'string',
    discoverPage: { type: 'int', default: 0 },
    /** 章节目录地址，如果为空，则应该取uri的地址 */
    chapterMenuUri: 'string',
    /** 章节列表 */
    chapters: { type: 'list', objectType: 'Chapter' }
  }
}

export default Book
