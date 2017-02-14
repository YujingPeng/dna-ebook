import React, { Component } from 'react';
import { Container, Content, Header, Title, Button, Left, Right, Body, Icon } from 'native-base';

class Book extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
        <Content>
        </Content>
      </Container >
    );
  }
}

export default Book;