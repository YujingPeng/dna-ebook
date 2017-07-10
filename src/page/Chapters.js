import React, { Component } from 'react'
import { View, ListView, StatusBar } from 'react-native'
import { observer } from 'mobx-react/native'
import { observable, runInAction, computed } from 'mobx'
import { Toast } from 'antd-mobile'
import { getChapterList, updateDiscover } from '../service'
import { color } from '../env'
import { ListViewItem } from '../components/chapterList'

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

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  @observable
  chapters=[]

  @computed get DataSource () {
    return this.dataSource.cloneWithRows(this.chapters.slice())
  }

  componentWillMount () {
    this.init()
  }

  init = async () => {
    const result = await getChapterList(this.props.navigation.state.params.bookId, this.props.navigation.state.params.chapterId)
    runInAction(() => {
      this.chapters = result.chapters
    })
  }

  _renderRow = (item, sectionID, rowID) => {
    const rowItemPress = () => {
      if (this.isExist) {
        updateDiscover({
          id: item.bookId,
          discoverChapterId: item.id,
          discoverPage: 0,
          discoverChapterIndex: Number(rowID),
          discoverChapterName: item.text
        })
        this.props.navigation.navigate('viewer', { id: item.id, pageIndex: 0, title: this.book.name, bookId: item.bookId })
      } else {
        Toast.info('请收藏后再阅读', 0.7)
      }
    }
    return (
      <ListViewItem rowID={rowID} item={item} onPress={rowItemPress} />
    )
  }
  render () {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={false} backgroundColor={color} translucent barStyle='light-content' />
        <ListView enableEmptySections initialListSize={10} renderRow={this._renderRow} dataSource={this.DataSource} />
      </View>
    )
  }
}
