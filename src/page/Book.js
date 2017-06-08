import React, { Component } from 'react'
import { View, Text, Image, ScrollView, ListView, TouchableOpacity, StatusBar } from 'react-native'
import { observer } from 'mobx-react/native'
// import BookModel from '../model/BookModel'
import { Button, Toast } from 'antd-mobile'
import { observable, action, runInAction, computed, toJS } from 'mobx'
import { newBook, saveBook, getBookById, updateDiscover } from '../service'
import personStore from '../store/personStore'

@observer
class Book extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state = {} } = navigation
    const { name } = state.params || {}
    return {
      title: name
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
      this.props.navigation.navigate('viewer', { id: this.book.discoverChapterId, title: this.book.name, pageIndex: this.book.discoverPage })
    } else {
      Toast.info('请收藏后再阅读', 0.7)
    }
  }

  _renderRow = (item, sectionID, rowID) => {
    const rowItemPress = () => {
      if (this.isExist) {
        updateDiscover({ id: item.bookId, discoverChapterId: item.id, discoverPage: 0, discoverChapterIndex: Number(rowID) })
        this.props.navigation.navigate('viewer', { id: item.id, pageIndex: 0, title: item.text,title: this.book.name, })
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
        <StatusBar hidden={false} />
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
            this.isExist
              ? (<Button style={{ flex: 1, margin: 10, borderColor: '#ff0000' }} onClick={this.handleRemove}><Text>删除</Text></Button>)
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
