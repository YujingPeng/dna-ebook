export default {
  name: 'SearchHistory',
  primaryKey: 'keyword',
  properties: {
    keyword: {type: 'string', indexed: true},
    times: {type: 'int', default: 1},
    updateAt: {type: 'date', default: new Date()},
    createAt: {type: 'date', default: new Date()},
    isDeleted: {type: 'bool', indexed: true, default: false}
  }
}
