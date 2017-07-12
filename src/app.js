import { StackNavigator } from 'react-navigation'
import SearchPage from './page/Search'
import BookPage from './page/Book'
import HomePage from './page/Home'
import ReaderPage from './page/Reader'
import Chapters from './page/Chapters'
// import { enableLogging } from 'mobx-logger'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const Screen = StackNavigator({
  home: { screen: HomePage },
  chapter: { screen: Chapters },
  search: { screen: SearchPage },
  book: { screen: BookPage },
  reader: { screen: ReaderPage }
}, {
  initialRouteName: 'home',
  headerMode: 'screen'
})
// const config = {
//   predicate: () => __DEV__ && Boolean(window.navigator.userAgent),
//   action: true,
//   reaction: true,
//   transaction: true,
//   compute: true
// }
// enableLogging(config)

export default Screen
