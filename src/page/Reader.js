import React, { Component } from 'react'
import { View, StatusBar, Dimensions, StyleSheet, Text, FlatList } from 'react-native'
import ViewerModel from '../model/ViewerModel'
import { observer } from 'mobx-react/native'
import { observable, computed, action } from 'mobx'
import { Toast } from 'antd-mobile'

import { theme } from '../env'
import settingStore from '../store/settingStore'
import { bulkCacheChapterContent } from '../service'

import loading from '../components/loading'
import Dock from '../components/dock'
import { DownloadDock, SettingsDock, ScreenArea } from '../components/viewer'
const deviceWidth = Dimensions.get('window').width

@observer
class Viewer extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state = {} } = navigation
    const { visible = false, title } = state.params || {}
    return visible ? {
      title,
      headerStyle: {
        position: 'absolute', top: 0, width: '100%', backgroundColor: '#000000'
      },
      headerTintColor: '#ffffff'
    } : { header: null }
  }

  componentWillMount () {
    this.init()
  }

  componentWillUnmount () {
    Toast.hide()
  }

  _preScrollX = 0

  viewer = new ViewerModel(this.props.navigation.state.params.chapterId, this.props.navigation.state.params.bookId, this.props.navigation.state.params.title, this.props.navigation.state.params.pageIndex);

  @observable
  refreshed = false

  @observable
  dockItemViewMode = null

  @observable
  isDrawerOpen = false

  @computed get mode () {
    return settingStore.nightMode ? theme.night : theme.light
  }

  @computed get renderItemView () {
    switch (this.dockItemViewMode) {
      case 'settings':
        return <SettingsDock onPress={() => { }} />
      case 'download':
        return <DownloadDock onPress={this.handleDownload} />
      default:
        return null
    }
  }

  @action
  init = async () => {
    this.refreshed = true
    // await loading()
    await this.viewer.get()
    this.refreshed = false
    // this.paper.scrollToIndex({viewPosition: 0, index: this.viewer.pageIndex + 1})
  }

  handlePrev = async () => {
    if (this.props.navigation.state.params.visible) {
      this.handleMenu()
    } else if (this.viewer.pageIndex > 1) {
      this.paper.scrollToIndex({ viewPosition: 0, index: this.viewer.pageIndex - 1 })
      this.viewer.discover(this.viewer.pageIndex - 1)
    } else {
      this.refreshed = true
      await loading()
      await this.viewer.jump(-1)
      this.refreshed = false
    }
  }

  handleNext = async () => {
    if (this.props.navigation.state.params.visible) {
      this.handleMenu()
    } else if (this.viewer.pageIndex < this.viewer.total) {
      this.paper.scrollToIndex({ viewPosition: 0, index: this.viewer.pageIndex + 1 })
      this.viewer.discover(this.viewer.pageIndex + 1)
    } else {
      this.refreshed = true
      await loading()
      await this.viewer.jump(1)
      this.refreshed = false
    }
  }

  _getItemLayout = (data, index) => {
    return { length: deviceWidth, offset: deviceWidth * index, index }
  }

  @action
  handleScroll = async (e) => {
    let { x } = e.nativeEvent.contentOffset
    let position = Math.floor(x / deviceWidth)
    if (x === this._preScrollX) return
    this._preScrollX = x
    let offset = x / deviceWidth - position
    if (offset === 0) {
      if (position > this.viewer.total) {
        this.refreshed = true
        await loading()
        await this.viewer.jump(1)
        this.refreshed = false
      } else if (position < 1) {
        this.refreshed = true
        await loading()
        await this.viewer.jump(-1)
        this.refreshed = false
      } else {
        this.viewer.discover(position)
      }
    }
  }

  @action
  handleMenu = () => {
    this.dockItemViewMode = ''
    this.props.navigation.setParams({ visible: !this.props.navigation.state.params.visible })
  }

  @action
  handleSettingsPress = () => {
    this.dockItemViewMode = this.dockItemViewMode !== 'settings' ? 'settings' : ''
  }
  handleChangeMode = () => {
    settingStore.saveSetting({ nightMode: !settingStore.nightMode })
  }
  handleDownload = async (start, count) => {
    Toast.info('开始缓存！', 0.5)
    // todo start end
    await bulkCacheChapterContent(this.viewer.bookId, this.viewer.id, start, count)
    Toast.info('缓存完成', 0.5)
  }

  @action
  handleDownloadPress = () => {
    this.dockItemViewMode = this.dockItemViewMode !== 'download' ? 'download' : ''
  }

  @action
  handleOpen = () => {
    this.props.navigation.navigate('chapter', { bookId: this.viewer.bookId, chapterId: this.viewer.id, name: this.props.navigation.state.params.title })
  }

  @action
  handleEndReached = (event) => {

  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.pagerContainer}>
        <View style={styles.context}>
          <Text style={{ fontSize: settingStore.fontSize, lineHeight: 30, color: this.mode.color }}>
            {item.context}
          </Text>
        </View>
        <ScreenArea
          onLeftPress={this.handlePrev}
          onRightPress={this.handleNext}
          onCenterPress={this.handleMenu} />
      </View>
    )
  }

  render () {
    const { backgroundColor } = this.mode
    return (
      <View style={{ flex: 1, backgroundColor }} >
        <StatusBar animated hidden />
        <View style={styles.header} >
          <Text style={{ color: '#696969' }}>{this.viewer.name}</Text>
        </View>
        <View style={{ flex: 1 }}>
          {
            !this.refreshed && (
            <FlatList
              extraData={this.mode}
              horizontal
              pagingEnabled
              ref={(ref) => { this.paper = ref }}
              initialScrollIndex={this.viewer.pageIndex}
              getItemLayout={this._getItemLayout}
              data={this.viewer.pagers}
              renderItem={this._renderItem}
              showsHorizontalScrollIndicator={false}
              onScroll={this.handleScroll}
            />)
          }
        </View>
        <View style={styles.footer} >
          <Text style={{ alignSelf: 'flex-end', color: '#696969' }}>{`${this.viewer.pageIndex}/${this.viewer.total}`}</Text>
        </View>
        <Dock visible={this.props.navigation.state.params.visible} renderItemView={this.renderItemView}>
          <Dock.Item text="目录" icon="list" onPress={this.handleOpen} />
          <Dock.Item text={settingStore.nightMode ? '白天' : '夜间'} icon={settingStore.nightMode ? 'sun-o' : 'moon-o'} onPress={this.handleChangeMode} />
          <Dock.Item text="设置" icon="gear" onPress={this.handleSettingsPress} />
          <Dock.Item text="缓存" icon="download" onPress={this.handleDownloadPress} />
        </Dock>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, height: '100%', width: '100%'
  },
  pagerContainer: {
    position: 'relative', width: deviceWidth, flex: 1
  },
  header: {
    paddingTop: 8, paddingLeft: 17, height: 30
  },
  footer: {
    paddingRight: 18, height: 30
  },
  context: {
    zIndex: -1, position: 'absolute', paddingLeft: settingStore.fontSize
  }
})

export default Viewer
