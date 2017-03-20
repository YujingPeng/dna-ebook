import { StackNavigator, TabNavigator } from 'react-navigation'
import SearchPage from './page/Search'
import ReaderPage from './page/Reader'
import BookPage from './page/Book'
import { enableLogging } from 'mobx-logger'

const HomeTabBar = TabNavigator({
  BookInfo: { screen: BookPage },
  Search: { screen: SearchPage }
}, { tabBarPosition: 'bottom' })

const Screen = StackNavigator({
  Home: { screen: HomeTabBar },
  Reader: { screen: ReaderPage }
}, {
  initialRouteName: 'Reader',
  headerMode: 'screen'
})
const config = {
  predicate: () => __DEV__ && Boolean(window.navigator.userAgent),
  action: true,
  reaction: true,
  transaction: true,
  compute: true
}
enableLogging(config)

export default Screen
