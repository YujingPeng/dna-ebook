
import { observable, action, extendObservable } from 'mobx'
import BookService from './BookService'

export default class BookModel {
  @observable
  id=''

  @observable
  uri = ''

  @observable
  name = '';

  @observable
  desc = '';

  @observable
  author = ''

  @observable
  updateAt = ''

  @observable
  latestChapter = ''

  @observable
  thumbImage = ''

  @observable
  currentReader = ''

  @observable
  chapterList = []

  constructor (id, uri) {
    this.id = id
    this.uri = uri
  }

  @action
  async get () {
    const book = await BookService.getBookInfo(this.id, this.uri)
    extendObservable(this, book)
  }
}
