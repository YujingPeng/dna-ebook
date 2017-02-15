import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Book from '../components/Book';
import Search from './Search';
import { Button } from 'antd-mobile';


class Home extends Component {
    static navigationOptions = {
        title: '书架',
        tabBar: {
            label: 'Home',
            // Note: By default the icon is only shown on iOS. Search the showIcon option below.
            icon: ({ tintColor }) => (
                <Icon name="share" />
            ),
        },
    };
    render() {
        return (
            <View >
                <Button>我是个按钮</Button>
                <Text onPress={() => { this.props.navigation.navigate('Search', { name: '摩天记' }); }} style={{ marginTop: 30, fontSize: 50 }}>Hello, Navigation!</Text>
            </View >
        );
    }
}




export default Home;