import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { BookModel } from '../domain/Book/BookService';
import { Button } from 'native-base';

@observer
class Book extends Component {

  @observable
  book = new BookModel();

  componentDidMount() {
    this.book.get()
  }
  

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 10 }}>
          <View style={{ width: 120, height: 150 }}>
            {this.book.thumbImage != '' ? <Image source={{ uri: this.book.thumbImage }} style={{ width: 120, height: 150 }} /> : null}
          </View>
          <View style={{ padding: 10 }}>
            <Text>名字：<Text>{this.book.name}</Text> </Text>
            <Text>作者：<Text>{this.book.author}</Text> </Text>
            <Text>最新章节：<Text>{this.book.latestChapter}</Text> </Text>
            <Text>最后更新时间：<Text>{this.book.updateAt}</Text> </Text>
          </View>
        </View>
        <Text>{this.book.desc}</Text>
        <Button onPress={() => { global.route.reader() }}><Text style={{color:'#FFFFFF'}}>开始阅读</Text></Button>
      </View>
    );
  }
}

export default Book;