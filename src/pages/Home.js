import React, { Component } from 'react';
import { View,Text } from 'react-native';
import { Container, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import Book from '../components/Book';

class Home extends Component {
    render() {
        return (
            <Container >
                <Content>
                <Book></Book>
                </Content>
                <Footer>
                    <FooterTab style={{backgroundColor:'#f5fcff'}}>
                        <Button active>
                            <Icon name="apps" />
                            <Text>书架</Text>
                        </Button>
                        <Button>
                            <Icon name="camera" />
                            <Text>搜索</Text>
                        </Button>
                        <Button>
                            <Icon name="person" />
                            <Text>我</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

export default Home;