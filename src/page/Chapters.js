import React, { Component } from 'react'
import { View, StatusBar, FlatList } from 'react-native'
import { observer } from 'mobx-react/native'
import { observable, runInAction } from 'mobx'
import { getChapterList, updateDiscover } from '../service'
import { color } from '../env'
import { ChapterItem } from '../components/item'
import readingStore from '../store/readingStore'

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

  @observable
  chapters = []

  @observable
  chapterIndex = 0

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

  getItemLayout = (data, index) => {
    return { length: 40, offset: 40 * index, index }
  }

  renderRow = ({ item, index }) => {
    const rowItemPress = () => {
      updateDiscover({
        id: item.bookId,
        discoverChapterId: item.id,
        discoverPage: 1,
        discoverChapterIndex: Number(index),
        discoverChapterName: item.text
      })
      readingStore.get(item.id, 1)
      this.props.navigation.goBack()
    }
    return (
      <ChapterItem index={index} item={item} onPress={rowItemPress} />
    )
  }
  render () {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={false} backgroundColor={color} translucent barStyle='light-content' />
        <FlatList
          extraData={this.chapters}
          ref={(ref) => { this.chapterRef = ref }}
          renderItem={this.renderRow}
          data={this.chapters.slice()}
          keyExtractor={this.keyExtractor}
          getItemLayout={this.getItemLayout}
        />
      </View>
    )
  }
}
