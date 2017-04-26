import React, { Component } from 'react'
import { View, Text, Image, ScrollView, ListView, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react/native'
import BookModel from '../model/BookModel'
import { Button } from 'antd-mobile'
import {observable, action} from 'mobx'
import personStore from '../store/personStore'

@observer
class Book extends Component {
  static navigationOptions = {
    title: ({state}) => state.params.name
  };

  @observable
  isCollection = personStore.isExist(this.props.navigation.state.params.uri);

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  // 'http://www.biquge.com/43_43821/'
  book = new BookModel(this.props.navigation.state.params.id, this.props.navigation.state.params.uri)

  _renderRow = (item, sectionID, rowID) => {
    const rowItemPress = () => {
      personStore.cacheBook.discover.chapterIndex = parseInt(rowID)
      personStore.updateDiscover()
      this.props.navigation.navigate('reader', { uri: item.uri, title: item.text })
    }
    return (
      <TouchableOpacity key={item.id} onPress={rowItemPress}>
        <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#cfcfcf', marginHorizontal: 10 }}>
          <Text>{item.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  @action
  handleSave =() => {
    this.isCollection = true
    this.book.save()
  }

  handleRemove=() => {
    // todo
  }

  handleRead=() => {
    this.props.navigation.navigate('reader', { uri: this.book.currChapter.uri, title: this.book.currChapter.text })
  }

  render () {
    return (
      <ScrollView style={{ backgroundColor: '#ffffff' }}>
        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 10 }}>
          <View style={{ width: 120, height: 150 }}>
            {this.book.thumbImage !== '' ? <Image source={{ uri: this.book.thumbImage }} style={{ width: 120, height: 150 }} /> : null}
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
          <Button style={{ flex: 1, margin: 10 }} type='primary' onClick={this.handleRead}><Text>开始阅读</Text></Button>
          {
            this.isCollection
            ? (<Button style={{ flex: 1, margin: 10, borderColor: '#ff0000' }} onClick={this.handleRemove}><Text>删除</Text></Button>)
            : (<Button style={{ flex: 1, margin: 10 }} onClick={this.handleSave}><Text>收藏</Text></Button>)
          }
        </View>
        <View>
          <ListView
            style={{ flex: 1 }}
            initialListSize={50}
            enableEmptySections
            dataSource={this.dataSource.cloneWithRows(this.book.chapterList.slice(0))}
            renderRow={this._renderRow}
          />
        </View>
      </ScrollView>
    )
  }
}

export default Book
