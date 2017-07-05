import React, { Component } from 'react'
import { View, ListView, StatusBar } from 'react-native'
import ViewerModel from '../model/ViewerModel'
import { observer } from 'mobx-react/native'
import { observable, computed, action } from 'mobx'
import DrawerLayout from 'react-native-drawer-layout'
import { Toast } from 'antd-mobile'

// import Icon from 'react-native-vector-icons/FontAwesome'

import { theme } from '../env'
import settingStore from '../store/settingStore'
import { bulkCacheChapterContent, getChapterList } from '../service'

import loading from '../components/loading'
import { ListViewItem } from '../components/chapterList'
import Dock from '../components/dock'
import { DownloadDock, SettingsDock } from '../components/viewer'
import Pager from '../components/pager'

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

  componentWillUnmount () {
    Toast.hide()
  }

  viewer = new ViewerModel(this.props.navigation.state.params.id, this.props.navigation.state.params.bookId, this.props.navigation.state.params.title, this.props.navigation.state.params.pageIndex);

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  @observable
  chapters = getChapterList(this.props.navigation.state.params.bookId, this.props.navigation.state.params.id)

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

  handlePrev = async () => {
    if (this.props.navigation.state.params.visible) {
      this.handleMenu()
    } else if (this.viewer.pageIndex > 0) {
      // this.pageIndex--
      this.viewer.discover(this.viewer.pageIndex - 1)
    } else {
      await loading()
      await this.viewer.jump(-1)
    }
  }

  handleNext = async () => {
    if (this.props.navigation.state.params.visible) {
      this.handleMenu()
    } else if (this.viewer.nextIndex < this.viewer.total) {
      this.viewer.discover(this.viewer.pageIndex + 1)
    } else {
      await loading()
      await this.viewer.jump(1)
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
    this.drawer.openDrawer()
    // this.isDrawerOpen = true
    this.props.navigation.setParams({ visible: false })
  }

  @action
  handleEndReached = () => {

  }

  _renderRow = (item, sectionID, rowID) => {
    const rowItemPress = () => {
      Toast.info('coming soom...', 0.7)
    }
    return (
      <ListViewItem item={item} rowID={rowID} onPress={rowItemPress} />
    )
  }

  _reanderChapters = () => (
    <View style={{ flex: 1, backgroundColor: this.mode.backgroundColor }}>
      <ListView
        style={{ flex: 1 }}
        initialListSize={10}
        enableEmptySections
        onEndReached={this.handleEndReached}
        dataSource={this.dataSource.cloneWithRows(this.chapters.slice(0))}
        renderRow={this._renderRow} />
    </View>
  )

  render () {
    const { backgroundColor, color } = this.mode

    return (
      <View style={{ flex: 1, backgroundColor }} >
        <StatusBar animated hidden />
        <Pager
          context={this.viewer.pagers.slice()}
          initPage={1}
          onLeftPress={this.handlePrev}
          onRightPress={this.handleNext}
          onCenterPress={this.handleMenu}
        />
        {/* <Pager
          dataSource={this.viewer.dataSource}
          themeColor={color}
          header={this.viewer.name}
          footer={`第${this.viewer.nextIndex}/${this.viewer.total}章`} /> */}
        {/* <DrawerLayout
          ref={ref => { this.drawer = ref }}
          drawerWidth={300}
          drawerLockMode='locked-closed'
          onDrawerClose={() => { this.isDrawerOpen = false }}
          renderNavigationView={this._reanderChapters}> */}

        {/* </DrawerLayout> */}
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

export default Viewer
