import React, { Component } from 'react'
import { View, Text, Image, ScrollView, ListView, TouchableOpacity, StatusBar } from 'react-native'
import { observer } from 'mobx-react/native'
import { Toast, Tag } from 'antd-mobile'
import { observable, action, runInAction, computed, toJS } from 'mobx'
import { newBook, saveBook, getBookById, updateDiscover, getBookSourceName } from '../service'
import personStore from '../store/personStore'
import { color } from '../env'
import moment from 'moment'
import loading from '../components/loading'

@observer
class Book extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state = {} } = navigation
    const { name, id } = state.params || {}
    return {
      title: name,
      headerStyle: { width: '100%', backgroundColor: color, paddingTop: 20 },
      headerTintColor: '#ffffff',
      headerRight: (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <TouchableOpacity style={{ paddingHorizontal: 15 }} onPress={() => { navigation.navigate('chapter', { bookId: id, name }) }}>
            <Text style={{ fontSize: 18, color: '#fff' }}>目录</Text>
          </TouchableOpacity>
        </View>
      )
    }
  };

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
  params = this.props.navigation.state.params

  @observable
  isExist = personStore.isExist(this.params.uri);
  // 'http://www.biquge.com/43_43821/'
  // book = new BookModel(this.props.navigation.state.params.id, this.props.navigation.state.params.uri)
  @observable
  book = {}

  @observable
  bookSource = getBookSourceName(this.params.uri)

  @computed get updateTime () {
    const time = moment(this.book.updateAt, 'YYYY-MM-DD HH:mm:ss')
    return time.isValid() ? time.fromNow() + '更新' : this.book.updateAt
  }

  componentWillMount () {
    this.init()
  }

  componentWillUnmount () {
    Toast.hide()
  }

  @action
  init = async () => {
    try {
      await loading()
      if (this.isExist) {
        const id = personStore.getBookIdByUri(this.params.uri)
        const result = await getBookById(id)
        runInAction(() => {
          this.book = result
          Toast.hide()
        })
      } else {
        const result = await newBook(this.params.id, this.params.uri)
        runInAction(() => {
          this.book = result
          Toast.hide()
        })
      }
    } catch (error) {
      Toast.fail(error.message)
    }
  }

  @action
  handleSave = async () => {
    await saveBook(toJS(this.book))
    runInAction(() => {
      this.isExist = true
      personStore.refresh()
    })
    // Toast.hide()
  }

  handleRemove = () => {
    // todo
  }

  handleRead = () => {
    if (this.isExist) {
      this.props.navigation.navigate('reader', { id: this.book.discoverChapterId, title: this.book.name, pageIndex: this.book.discoverPage, bookId: this.book.id })
    } else {
      Toast.info('请收藏后再阅读', 0.7)
    }
  }

  handleChapterItemPress = ({ item, index }) => {
    if (this.isExist) {
      updateDiscover({
        id: item.bookId,
        discoverChapterId: item.id,
        discoverPage: 0,
        discoverChapterIndex: Number(index),
        discoverChapterName: item.text
      })
      this.props.navigation.navigate('reader', { id: item.id, pageIndex: 0, title: this.book.name, bookId: item.bookId })
    } else {
      Toast.info('请收藏后再阅读', 0.7)
    }
  }

  render () {
    return this.book && this.book.updateAt ? (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: '#ffffff' }}>
          <StatusBar hidden={false} backgroundColor={color} translucent barStyle='light-content' />
          <View style={{ flexDirection: 'row', marginTop: 15, paddingHorizontal: 15 }}>
            <View style={{ width: 104, height: 130, borderWidth: 1, borderColor: '#e7e7e7' }}>
              {this.book.thumbImage !== '' ? <Image source={{ uri: this.book.thumbImage }} style={{ width: '100%', height: '100%' }} /> : null}
            </View>
            <View style={{ paddingLeft: 10, flex: 1 }}>
              <Text style={{ color: '#333', fontSize: 22 }}>{this.book.name}</Text>
              <Text style={{ color: '#999', marginTop: 10 }} >{this.book.author}</Text>
              <Text style={{ color: '#696969', marginTop: 10 }}>{this.book.latestChapter}</Text>
              <Text style={{ color: '#999', marginTop: 10 }}>{this.updateTime}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 15, marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{'其他类型'}</Text>
            <Text>{'168万字'}</Text>
            <Text>{'连载中'}</Text>
            <Text>{this.bookSource}</Text>
          </View>
          <View style={{ padding: 15, paddingTop: 20, marginTop: 15, borderTopColor: '#e7e7e7', borderTopWidth: 1 }}>
            <View style={{ paddingLeft: 5, borderLeftColor: color, borderLeftWidth: 3 }}>
              <Text style={{ fontSize: 16, color: '#333' }}>简介</Text>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 16 }}>{this.book.desc.trim()}</Text>
            </View>
          </View>
          <View style={{ padding: 15, paddingTop: 20, marginTop: 15, borderTopColor: '#e7e7e7', borderTopWidth: 1 }}>
            <View style={{ paddingLeft: 5, borderLeftColor: color, borderLeftWidth: 3 }}>
              <Text style={{ fontSize: 16, color: '#333' }}>标签</Text>
            </View>
            <View style={{ marginTop: 15, flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <View style={{ padding: 5 }}>
                <Tag>{this.book.author}</Tag>
              </View>
              <View style={{ padding: 5 }}>
                <Tag>{this.book.name}</Tag>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{ flexDirection: 'row', height: 50 }}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: color }} onPress={this.handleRead}>
            <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 40, fontSize: 20 }}>开始阅读</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, backgroundColor: '#eee' }} onPress={this.handleSave}>
            <Text style={{ color, textAlign: 'center', fontSize: 20, lineHeight: 40 }}>{this.isExist ? '取消收藏' : '收藏'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : null
  }
}

export default Book
