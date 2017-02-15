import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import Home from './screen/Home';
import Search from './screen/Search';
import Reader from './screen/Reader';

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