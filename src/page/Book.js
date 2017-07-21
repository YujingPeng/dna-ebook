import React, { Component } from 'react'
import { View, Text, Image, ScrollView, ListView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native'
import { observer } from 'mobx-react/native'
import { Toast, Tag } from 'antd-mobile'
import { observable, action, runInAction, computed, toJS } from 'mobx'
import { newBook, storeUp, getBookById, getBookSourceName } from '../service'
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

  @observable
  book = {}

  @observable
  bookSource = getBookSourceName(this.params.uri)

  @computed get updateTime () {
    const time = moment(this.book.updateAt, 'YYYY-MM-DD HH:mm:ss')
    return time.isValid() ? time.fromNow() + '更新' : this.book.updateAt
  }

  @computed get tags () {
    let _tags = [this.book.author, this.book.name]
    if (this.book.type) _tags.push(this.book.type)
    return _tags
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
        const result = await newBook(this.params.id, this.params.uri, this.params.options)
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
    await storeUp(this.params.id)
    runInAction(() => {
      this.isExist = true
      personStore.refresh()
    })
  }

  handleRemove = async () => {
    await storeUp(this.params.id, false)
    runInAction(() => {
      this.isExist = false
      personStore.refresh()
    })
  }

  handleRead = () => {
    this.props.navigation.navigate('reader', { chapterId: this.book.discoverChapterId, title: this.book.name, pageIndex: this.book.discoverPage, bookId: this.book.id })
  }

  render () {
    return this.book && this.book.updateAt ? (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: '#ffffff' }}>
          <StatusBar hidden={false} backgroundColor={color} translucent barStyle='light-content' />
          <View style={styles.detailHead}>
            <View style={styles.bookImg}>
              {this.book.thumbImage !== '' ? <Image source={{ uri: this.book.thumbImage }} style={{ width: '100%', height: '100%' }} /> : null}
            </View>
            <View style={{ paddingLeft: 10, flex: 1 }}>
              <Text style={{ color: '#000', fontSize: 16 }}>{this.book.name}</Text>
              <Text style={styles.bookDesc} >{this.book.author}</Text>
              <Text style={styles.bookDesc}>{this.book.latestChapter}</Text>
              <Text style={styles.bookDesc}>
                <Text>已读 {((this.book.discoverChapterIndex + 1) / this.book.totalChapter * 100).toFixed(2)}%</Text>
                <Text> | {this.updateTime}</Text>
              </Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 15, marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{this.book.type || '其他类型'}</Text>
            <Text>{'168万字'}</Text>
            <Text>{'连载中'}</Text>
            <Text>{this.bookSource}</Text>
          </View>
          <View style={{ padding: 15, paddingTop: 20, marginTop: 15, borderTopColor: '#e7e7e7', borderTopWidth: 1 }}>
            <View style={{ paddingLeft: 5, borderLeftColor: color, borderLeftWidth: 3 }}>
              <Text style={{ fontSize: 14, color: '#333' }}>简介</Text>
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={{ fontSize: 14, color: '#999' }}>{this.book.desc.trim()}</Text>
            </View>
          </View>
          <View style={{ padding: 15, paddingTop: 20, marginTop: 15, borderTopColor: '#e7e7e7', borderTopWidth: 1 }}>
            <View style={{ paddingLeft: 5, borderLeftColor: color, borderLeftWidth: 3 }}>
              <Text style={{ fontSize: 14, color: '#333' }}>标签</Text>
            </View>
            <View style={{ marginTop: 15, flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
              {
                this.tags.map(tag => (
                  <View key={tag} style={{ padding: 5 }}>
                    <Tag>{tag}</Tag>
                  </View>
                ))
              }
            </View>
          </View>
        </ScrollView>
        <View style={{ flexDirection: 'row', height: 50 }}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: color }} onPress={this.handleRead}>
            <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 40, fontSize: 16 }}>开始阅读</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, backgroundColor: '#eee' }} onPress={this.handleSave}>
            <Text style={{ color, textAlign: 'center', fontSize: 16, lineHeight: 40 }}>{this.isExist ? '取消收藏' : '收藏'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : null
  }
}


const styles = StyleSheet.create({
  detailHead: {
    flexDirection: 'row',
    marginTop: 15,
    paddingHorizontal: 15
  },
  bookImg: {
    width: 100,
    height: 130,
    borderWidth: 1,
    borderColor: '#e7e7e7',
    backgroundColor: 'black',
    elevation: 15,
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 3
  },
  bookDesc: {
    color: '#999',
    marginTop: 10
  }

})

export default Book
