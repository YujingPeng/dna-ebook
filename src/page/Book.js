import React, { Component } from 'react';
import { View, Text, Image, ScrollView, ListView, TouchableOpacity } from 'react-native';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { BookModel } from '../domain/Book';
import { Button, List, Toast } from 'antd-mobile';

@observer
class Book extends Component {

  static navigationOptions = {
    title: '圣墟',
  };

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  book = new BookModel('http://www.biquge.com/43_43821/')

  componentDidMount() {
    this.book.get();
    const self = this;
  }

  renderRow = (item) => {
    const rowItemPress = () => {
      this.props.navigation.navigate('Reader', { url: item.url })
    };
    return (
      <TouchableOpacity key={item.id} onPress={rowItemPress}>
        <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#cfcfcf', marginHorizontal: 10 }}>
          <Text>{item.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {

    return (
      <ScrollView style={{ backgroundColor: '#ffffff' }}>
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
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Button style={{ flex: 1, margin: 10 }} type="primary" onClick={() => { this.props.navigation.navigate('Reader', { url: this.book.chapterList[0].url }) }}><Text>开始阅读</Text></Button>
          <Button style={{ flex: 1, margin: 10 }} ><Text>收藏</Text></Button>
        </View>
        <View>
          <ListView
            style={{ flex: 1 }}
            initialListSize={50}
            enableEmptySections
            dataSource={this.dataSource.cloneWithRows(this.book.chapterList.slice(0))}
            renderRow={this.renderRow}
          />
        </View>
      </ScrollView>
    );
  }
}

export default Book;

