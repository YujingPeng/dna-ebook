import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Container, Content, Header, Title, Button, Left, Right, Body, Icon, Text } from 'native-base';
import Book from '../components/Book';
import DnaFooter from '../common/DnaFooter';


class Home extends Component {
    render() {
        return (
            <Container >
                <Header>
                    <Left>
                        <TouchableOpacity transparent>
                            <Icon name='arrow-back' style={{ color: '#FFFFFF' }} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <Title>书架</Title>
                    </Body>
                    <Right>
                        <TouchableOpacity transparent>
                            <Icon name='menu' style={{ color: '#FFFFFF' }} />
                        </TouchableOpacity>
                    </Right>
                </Header>
                <Content>
                    <Book />
                </Content>
                <DnaFooter activeKey='home'></DnaFooter>
            </Container>
        );
    }
}

export default Home;