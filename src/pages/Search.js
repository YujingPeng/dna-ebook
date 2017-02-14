import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Container, Content, Header, Title, Button, Left, Right, Body, Icon, Text } from 'native-base';
import DnaFooter from '../common/DnaFooter';

class Search extends Component {
  render() {
    return (
      <Container >
        <Content>
          <Header>
            <Left>
              <TouchableOpacity transparent onPress={() => { global.route.home() }}>
                <Icon name='arrow-back' style={{ color: '#ffffff' }} />
              </TouchableOpacity>
            </Left>
            <Body>
              <Title>搜索</Title>
            </Body>
            <Right>
              <TouchableOpacity transparent>
                <Icon name='menu' style={{ color: '#ffffff' }} />
              </TouchableOpacity>
            </Right>
          </Header>
        </Content>
        <DnaFooter activeKey='search'></DnaFooter>
      </Container>
    );
  }
}

export default Search;
