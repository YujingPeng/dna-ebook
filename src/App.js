import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import Search from './page/Search';
import Reader from './page/Reader';
import Book from './page/Book';

const HomeTabBar = TabNavigator({
  BookInfo: { screen: Book },
  Search: { screen: Search },
}, { tabBarPosition: 'bottom' });

const Screen = StackNavigator({
  Home: { screen: HomeTabBar },
  Reader: { screen: Reader }
});

// global.route = Actions;

export default Screen;
