import React, { Component } from 'react'
import { View, Text, Image, ScrollView, ListView, TouchableOpacity, StatusBar } from 'react-native'
import { observer } from 'mobx-react/native'
import { Button, Toast } from 'antd-mobile'
import { observable, action, runInAction, computed, toJS } from 'mobx'
import { newBook, saveBook, getBookById, updateDiscover } from '../service'
import personStore from '../store/personStore'
import { color } from '../env'
import moment from 'moment'

@observer
class Book extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state = {} } = navigation
    const { name } = state.params || {}
    return {
      title: name,
      headerStyle: { width: '100%', backgroundColor: color },
      headerTintColor: '#ffffff'
    }
  };

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
  params = this.props.navigation.state.params

  @observable
  isExist = personStore.isExist(this.props.navigation.state.params.uri);
  // 'http://www.biquge.com/43_43821/'
  // book = new BookModel(this.props.navigation.state.params.id, this.props.navigation.state.params.uri)
  @observable
  book = {}

  @computed get DataSource () {
    const chapters = this.book.chapters || []
    return this.dataSource.cloneWithRows(chapters.slice(0))
  }

  componentWillMount () {
    this.init()
  }

  @action
  init = async () => {
    if (this.isExist) {
      const result = await getBookById(this.params.id)
      runInAction(() => {
        // console.time('2')
        // const bookJSON = result.book.toJSON()
        // // const list = result.chapterList.map(item => item.toJSON())
        // console.timeEnd('2')
        this.book = result
      })
    } else {
      const result = await newBook(this.params.id, this.params.uri)
      runInAction(() => {
        this.book = result
      })
    }
  }

  // @action
  handleSave = async () => {
    // Toast.loading('正在保存...', 0, () => {})

    // this.book.save()
    await saveBook(toJS(this.book))
    runInAction(() => {
      this.isExist = true
    })
    // Toast.hide()
  }

  handleRemove = () => {
    // todo
  }

  handleRead = () => {
    if (this.isExist) {
      this.props.navigation.navigate('viewer', { id: this.book.discoverChapterId, title: this.book.name, pageIndex: this.book.discoverPage, bookId: this.book.id })
    } else {
      Toast.info('请收藏后再阅读', 0.7)
    }
  }

  _renderRow = (item, sectionID, rowID) => {
    const rowItemPress = () => {
      if (this.isExist) {
        updateDiscover({ id: item.bookId, discoverChapterId: item.id, discoverPage: 0, discoverChapterIndex: Number(rowID), discoverChapterName: item.text })
        this.props.navigation.navigate('viewer', { id: item.id, pageIndex: 0, title: this.book.name, bookId: item.bookId })
      } else {
        Toast.info('请收藏后再阅读', 0.7)
      }
    }
    return (
      <TouchableOpacity key={item.id} onPress={rowItemPress}>
        <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#cfcfcf', marginHorizontal: 10 }}>
          <Text>{item.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <ScrollView style={{ backgroundColor: '#ffffff' }}>
        <StatusBar hidden={false} backgroundColor={color} />
        <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingTop: 10 }}>
          <View style={{ width: 72, height: 90 }}>
            {this.book.thumbImage !== '' ? <Image source={{ uri: this.book.thumbImage }} style={{ width: '100%', height: '100%' }} /> : null}
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <Text style={{ color: '#696969', fontSize: 22 }}>{this.book.name}</Text>
            <Text style={{ color: '#999' }}>{this.book.author}</Text>
            <Text style={{ color: '#696969' }}>{this.book.latestChapter}</Text>
            <Text style={{ color: '#999' }}>{moment(this.book.updateAt).fromNow()}更新</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
          <Text>{this.book.desc}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Button style={{ flex: 1, margin: 10 }} type='primary' onClick={this.handleRead}><Text>开始阅读</Text></Button>
          {
            this.isExist
              ? (<Button style={{ flex: 1, margin: 10, borderColor: '#ff0000' }} onClick={this.handleRemove}><Text>取消收藏</Text></Button>)
              : (<Button style={{ flex: 1, margin: 10 }} onClick={this.handleSave}><Text>收藏</Text></Button>)
          }
        </View>
        <View>
          <ListView
            style={{ flex: 1 }}
            initialListSize={50}
            enableEmptySections
            dataSource={this.DataSource}
            renderRow={this._renderRow}
          />
        </View>
      </ScrollView>
    )
  }
}

export default Book
