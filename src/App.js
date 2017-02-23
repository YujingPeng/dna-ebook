import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import Home from './page/Home';
import Search from './page/Search';
import Reader from './page/Reader';

const HomeTabBar = TabNavigator({
    Home: { screen: Home },
    Search: { screen: Search },
}, { tabBarPosition: 'bottom' });

const Screen = StackNavigator({
    Home: { screen: HomeTabBar },
    Reader: { screen: Reader }
});

// global.route = Actions;

export default Screen;
