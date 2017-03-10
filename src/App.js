import { StackNavigator, TabNavigator } from 'react-navigation'
import Search from './page/Search'
import Reader from './page/Reader'
import Book from './page/Book'
import { enableLogging } from 'mobx-logger'

const HomeTabBar = TabNavigator({
  BookInfo: { screen: Book },
  Search: { screen: Search }
}, { tabBarPosition: 'bottom' })

const Screen = StackNavigator({
  Home: { screen: HomeTabBar },
  Reader: { screen: Reader }
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
