import React, { Component } from 'react'
import { View, ListView, StatusBar, FlatList } from 'react-native'
import { observer } from 'mobx-react/native'
import { observable, runInAction, computed } from 'mobx'
import { getChapterList, updateDiscover } from '../service'
import { color } from '../env'
import { ListViewItem, ListItem } from '../components/chapterList'

@observer
export default class chapters extends Component {
  static navigationOptions = ({ navigation }) => {
    const { name } = navigation.state.params || {}
    return {
      title: name,
      headerStyle: { width: '100%', backgroundColor: color, paddingTop: 20 },
      headerTintColor: '#ffffff'
    }
  }

  // dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  @observable
  chapters = []

  @observable
  chapterIndex = 0

  // @computed get DataSource () {
  //   return this.dataSource.cloneWithRows(this.chapters.slice())
  // }

  componentWillMount () {
    this.init()
  }

  keyExtractor = (item, index) => item.id

  init = async () => {
    const result = await getChapterList(this.props.navigation.state.params.bookId, this.props.navigation.state.params.chapterId)
    runInAction(() => {
      this.chapters = result.chapters
      this.chapterIndex = result.index
      setTimeout(() => {
        this.chapterRef.scrollToIndex({ viewPosition: 0, index: result.index })
      }, 100)
    })
  }

  _getItemLayout = (data, index) => {
    return { length: 40, offset: 40 * index, index }
  }

  _renderRow = ({ item, index }) => {
    const rowItemPress = () => {
      updateDiscover({
        id: item.bookId,
        discoverChapterId: item.id,
        discoverPage: 0,
        discoverChapterIndex: Number(index),
        discoverChapterName: item.text
      })
      this.props.navigation.navigate('viewer', { id: item.id, pageIndex: 0, title: this.props.navigation.state.params.name, bookId: item.bookId })
    }
    return (
      <ListItem index={index} item={item} onPress={rowItemPress} />
    )
  }
  render () {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={false} backgroundColor={color} translucent barStyle='light-content' />
        <FlatList
          extraData={this.chapters}
          ref={(ref) => { this.chapterRef = ref }}
          renderItem={this._renderRow}
          data={this.chapters.slice()}
          keyExtractor={this.keyExtractor}
          getItemLayout={this._getItemLayout}
        />
      </View>
    )
  }
}
