import React, { Component } from 'react'
import { View, TouchableOpacity, Text, ListView, Image, RefreshControl, StatusBar } from 'react-native'
import { observer } from 'mobx-react/native'
import { SwipeAction } from 'antd-mobile'
import personStore from '../store/personStore'
import { action, observable, runInAction } from 'mobx'
import { removeBook } from '../service'
import Icon from 'react-native-vector-icons/FontAwesome'
import { color } from '../env'
import moment from 'moment'

@observer
class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '阅来客栈',
      headerStyle: { width: '100%', backgroundColor: color },
      headerTintColor: '#ffffff',
      headerRight: (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <TouchableOpacity style={{ paddingHorizontal: 15 }} onPress={() => { navigation.navigate('search') }}>
            <Icon name="refresh" size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingHorizontal: 15 }} onPress={() => { navigation.navigate('search') }}>
            <Icon name="search" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )
    }
  };

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  @observable
  isRefreshing = false

  @action
  removeItem = async (bookId) => {
    personStore.removeBook(bookId)
    await removeBook(bookId)
  }

  @action
  handleRefresh = () => {
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
      this.props.navigation.navigate('viewer', { id: item.discoverChapterId, title: item.name, pageIndex: item.discoverPage, bookId: item.id })
    }

    const SwipeActionConfig = {
      autoClose: true,
      right: [{
        text: '详细',
        onPress: () => this.props.navigation.navigate('book', { id: item.id, uri: item.uri, name: item.name })
      },
      {
        text: '删除',
        onPress: () => this.removeItem(item.id),
        style: { backgroundColor: '#F4333C', color: '#F5F5F5' }
      }]
    }
    return (
      <SwipeAction {...SwipeActionConfig} >
        <TouchableOpacity key={item.id} onPress={rowItemPress} style={{ backgroundColor: '#F5F5F5' }}>
          <View style={{ flex: 1, marginLeft: 15, flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#e7e7e7' }}>
            <View style={{ width: 40, height: 50 }}>
              {item.thumbImage !== '' ? <Image source={{ uri: item.thumbImage }} style={{ width: 40, height: 50 }} /> : null}
            </View>
            <View style={{ marginHorizontal: 10 }}>
              <Text style={{ color: '#696969', fontSize: 18 }}>
                {item.name}
                <Text style={{ color: '#999', fontSize: 12 }}> {item.author} {((item.discoverChapterIndex + 1) / item.totalChapter * 100).toFixed(2)}%</Text>
              </Text>
              <Text><Text style={{ color: '#999', fontSize: 12 }}>{moment(item.updateAt).fromNow()}更新：</Text>{item.latestChapter}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </SwipeAction>
    )
  }

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <StatusBar hidden={false} backgroundColor={color} />
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
