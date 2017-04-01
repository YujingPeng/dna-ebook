import React, { Component } from 'react'
import { View, TouchableOpacity, Text, ListView, Image } from 'react-native'
import { observable, action, runInAction } from 'mobx'
import BookService from '../domain/Book/BookService'
import { observer } from 'mobx-react/native'

@observer
class Home extends Component {
  static navigationOptions = {
    title: '书架'
  };

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  @observable
  bookList = this.dataSource.cloneWithRows([])

  componentWillMount () {
    this.init()
  }

  @action
  init = async () => {
    let result = await BookService.getList()
    runInAction(() => {
      this.bookList = this.dataSource.cloneWithRows(result)
    })
  }

  renderRow = (item) => {
    const rowItemPress = () => {
      this.props.navigation.navigate('book', { id: item.id, uri: item.uri })
    }

    return (
      <TouchableOpacity key={item.id} onPress={rowItemPress}>
        <View style={{ flex: 1, flexDirection: 'row', padding: 5, borderBottomWidth: 1, borderColor: '#cfcfcf' }}>
          <View style={{ width: 72, height: 90 }}>
            {item.thumbImage !== '' ? <Image source={{ uri: item.thumbImage }} style={{ width: 72, height: 90 }} /> : null}
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text>书名：{item.name}</Text>
            <Text>作者：{item.author}</Text>
            <Text>最后章节：{item.latestChapter}</Text>
            <Text>进度：0%</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <ListView
          style={{ flex: 1 }}
          initialListSize={50}
          enableEmptySections
          dataSource={this.bookList}
          renderRow={this.renderRow}
        />
      </View>
    )
  }
}

export default Home
