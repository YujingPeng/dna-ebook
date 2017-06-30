import { StackNavigator } from 'react-navigation'
import SearchPage from './page/Search'
import BookPage from './page/Book'
import HomePage from './page/Home'
import ViewerPage from './page/Viewer'
// import { enableLogging } from 'mobx-logger'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
// const HomeTabBar = TabNavigator({
//   BookInfo: { screen: HomePage },
// }, {
//   tabBarPosition: 'bottom',
//   swipeEnabled: false
// })

const Screen = StackNavigator({
  home: { screen: HomePage },
  search: { screen: SearchPage },
  book: { screen: BookPage },
  viewer: { screen: ViewerPage }
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
