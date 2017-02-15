import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Book from '../components/Book';
import Search from './Search';
import { Button } from 'antd-mobile';


class Home extends Component {
    static navigationOptions = {
        title: '书架',
    };
    render() {
        return (
            <Book navigation={this.props.navigation}></Book>
        );
    }
}




export default Home;