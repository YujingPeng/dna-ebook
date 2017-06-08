import React, { Component } from 'react'
import { View, TouchableOpacity, Text, ListView, Image, RefreshControl, StatusBar } from 'react-native'
import { observer } from 'mobx-react/native'
import { SwipeAction } from 'antd-mobile'
import personStore from '../store/personStore'
import { action, observable, runInAction } from 'mobx'
import {removeBook} from '../service'

@observer
class Home extends Component {
  static navigationOptions =({navigation}) => {
    return {
      title: '📖书架',
      headerRight: <TouchableOpacity style={{paddingHorizontal: 15}} onPress={() => { navigation.navigate('search') }}><Text>🔍搜索</Text></TouchableOpacity>
    }
  };

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  @observable
  isRefreshing=false

  @action
  removeItem = async (bookId) => {
    personStore.removeBook(bookId)
    await removeBook(bookId)
  }

  @action
  handleRefresh=() => {
    this.isRefreshing = true
    runInAction(async () => {
      await personStore.refresh()
      this.isRefreshing = false
    })
  }

  _renderRow = (item) => {
    const rowItemPress = () => {
      // personStore.initCacheBook(item)
      // this.props.navigation.navigate('viewer', { uri: personStore.cacheBook.currChapter.uri, title: personStore.cacheBook.currChapter.text })
      this.props.navigation.navigate('viewer', { id: item.discoverChapterId, title: item.name, pageIndex: item.discoverPage })
    }

    const SwipeActionConfig = {
      autoClose: true,
      right: [ {
        text: '详细',
        onPress: () => this.props.navigation.navigate('book', { id: item.id, uri: item.uri, name: item.name })
      },
      {
        text: '删除',
        onPress: () => this.removeItem(item.id),
        style: { backgroundColor: '#F4333C', color: '#F5F5F5' }
      }]
    }
    // console.warn(JSON.stringify(item.discover))
    return (
      <SwipeAction {...SwipeActionConfig} >
        <TouchableOpacity key={item.id} onPress={rowItemPress}>
          <View style={{ flex: 1, flexDirection: 'row', padding: 5, borderBottomWidth: 1, borderColor: '#f0ffff', backgroundColor: '#F5F5F5' }}>
            <View style={{ width: 72, height: 90 }}>
              {item.thumbImage !== '' ? <Image source={{ uri: item.thumbImage }} style={{ width: 72, height: 90 }} /> : null}
            </View>
            <View style={{ marginHorizontal: 10 }}>
              <Text>书名：{item.name}</Text>
              <Text>作者：{item.author}</Text>
              <Text>最后章节：{item.latestChapter}</Text>
              <Text>进度：{((item.discoverChapterIndex + 1) / item.totalChapter).toFixed(2)}%</Text>
            </View>
          </View>
        </TouchableOpacity>
      </SwipeAction>
    )
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={false} />
        {/* <Text>{db.objects('Chapter').length}{db.objects('Book').length}</Text> */}
        <ListView
          style={{ flex: 1 }}
          initialListSize={50}
          enableEmptySections
          dataSource={this.dataSource.cloneWithRows(personStore.books.slice(0))}
          renderRow={this._renderRow}
          refreshControl={
            <RefreshControl
              refreshing={this.isRefreshing}
              onRefresh={this.handleRefresh}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffffff"
          />
        }
        />
      </View>
    )
  }
}

export default Home
