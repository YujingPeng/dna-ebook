import React, { Component } from 'react'
import { observer } from 'mobx-react/native'
import { action, observable, runInAction } from 'mobx'

import { SwipeAction, Toast } from 'antd-mobile'
import { FlatList, Image, ListView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import { color } from '../env'
import { removeBook, updateChapterList } from '../service'
import personStore from '../store/personStore'
import BookItem from '../components/item/BookItem'

@observer
class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '阅来客栈',
      headerStyle: { width: '100%', backgroundColor: color, paddingTop: 20 },
      headerTintColor: '#ffffff',
      headerRight: (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <TouchableOpacity style={{ paddingHorizontal: 15 }}
            onPress={() => {
              personStore.refresh()
              Toast.info('更新成功', 0.5)
            }}>
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
  refreshing = false

  @action
  removeItem = async (bookId) => {
    personStore.removeBook(bookId)
    await removeBook(bookId)
  }

  @action
  handleRefresh = () => {
    this.refreshing = true
    runInAction(async () => {
      await personStore.refresh()
      this.refreshing = false
    })
  }

  handleItemRefresh = async (id, chapterMenuUri) => {
    try {
      const total = await updateChapterList(id, chapterMenuUri)
      if (total > 0) {
        personStore.refresh()
        Toast.info(`更新了${total}`, 0.5)
      } else {
        Toast.info('没有更新！', 0.5)
      }
    } catch (error) {
      Toast.info(`更新失败:${error.message}`, 0.7)
    }
  }

  _renderRow = ({ item, index }) => {
    const rowItemPress = () => {
      this.props.navigation.navigate('reader', {
        id: item.discoverChapterId,
        title: item.name,
        pageIndex: item.discoverPage,
        bookId: item.id
      })
    }

    const SwipeActionConfig = {
      left: [{
        text: '更新',
        onPress: () => this.handleItemRefresh(item.id, item.uri)
      }],
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
      <SwipeAction autoClose {...SwipeActionConfig} >
        <BookItem item={item} index={index} onPress={rowItemPress} />
      </SwipeAction>
    )
  }
  _keyExtractor = (item, index) => item.id;

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <StatusBar hidden={false} backgroundColor={color} translucent barStyle='light-content' />
        <FlatList
          data={personStore.books.slice(0)}
          renderItem={this._renderRow}
          keyExtractor={this._keyExtractor}
          refreshing={this.refreshing}
          onRefresh={this.handleRefresh}
        />
      </View>
    )
  }
}

export default Home
