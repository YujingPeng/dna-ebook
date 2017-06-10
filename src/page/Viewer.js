import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ListView, StatusBar } from 'react-native'
import ViewerModel from '../model/ViewerModel'
import { observer } from 'mobx-react/native'
import { observable, computed, action } from 'mobx'
import { loading } from '../components/loading'
import DrawerLayout from 'react-native-drawer-layout'
import { bulkCacheChapterContent, getChapterList } from '../service'
import { Toast } from 'antd-mobile'
import { theme } from '../env'
import Dock from '../components/dock'
import ScreenArea from '../components/viewer/ScreenArea'
import Pager from '../components/viewer/Pager'
import Icon from 'react-native-vector-icons/FontAwesome'

@observer
class Viewer extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state = {} } = navigation
    const { visible = false, title } = state.params || {}
    return visible ? {
      title,
      headerStyle: {
        position: 'absolute', top: 0, zIndex: 100, width: '100%', backgroundColor: '#000000'
      },
      headerTintColor: '#ffffff'
    } : { header: null }
  }

  viewer = new ViewerModel(this.props.navigation.state.params.id, this.props.navigation.state.params.bookId, this.props.navigation.state.params.title, this.props.navigation.state.params.pageIndex);

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  @observable
  chapters = getChapterList(this.props.navigation.state.params.bookId, this.props.navigation.state.params.id)

  @observable
  reanderItemView = null

  @computed get mode () {
    return this.viewer.isNightMode ? theme.night : theme.light
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
      // this.pageIndex++
      this.viewer.discover(this.viewer.pageIndex + 1)
    } else {
      await loading()
      await this.viewer.jump(1)
    }
  }

  handleMenu = () => {
    this.props.navigation.setParams({ visible: !this.props.navigation.state.params.visible })
  }

  @action
  handleDockPress = () => {
    this.reanderItemView = !this.reanderItemView ? (
      <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 15, height: 45, margin: 15, justifyContent: 'space-between', borderBottomColor: '#e7e7e7', borderBottomWidth: 1 }}>
        <TouchableOpacity onPress={() => { }} style={{ flex: 1, borderColor: '#e7e7e7', borderWidth: 1, marginHorizontal: 5, borderRadius: 3, justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ color: '#fff' }}>Aa-</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }} style={{ flex: 1, borderColor: '#e7e7e7', borderWidth: 1, marginHorizontal: 5, borderRadius: 3, justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ color: '#fff' }}>Aa+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }} style={{ flex: 1, borderColor: '#e7e7e7', borderWidth: 1, marginHorizontal: 5, borderRadius: 3, justifyContent: 'center', alignItems: 'center' }} >
          <Icon style={{ color: '#fff' }} name="align-justify" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }} style={{ flex: 1, borderColor: '#e7e7e7', borderWidth: 1, marginHorizontal: 5, borderRadius: 3, justifyContent: 'center', alignItems: 'center' }} >
          <Icon style={{ color: '#fff' }} name="reorder" />
        </TouchableOpacity>
      </View>
    ) : null
  }
  handleChangeMode = () => {
    this.viewer.isNightMode = !this.viewer.isNightMode
  }
  handleDownload = (start, count) => {
    Toast.info('开始缓存！', 0.5)
    // todo start end
    bulkCacheChapterContent(this.viewer.bookId, this.viewer.id, start, count)
  }

  @action
  handleDownloadBar = () => {
    this.reanderItemView = !this.reanderItemView ? (
      <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 15, height: 45, margin: 15, justifyContent: 'space-between', borderBottomColor: '#e7e7e7', borderBottomWidth: 1 }}>
        <TouchableOpacity onPress={() => { this.handleDownload(0) }} style={{ flex: 1, borderColor: '#e7e7e7', borderWidth: 1, marginHorizontal: 5, borderRadius: 3, justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ color: '#fff' }}>全本</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.handleDownload(null, 10) }} style={{ flex: 1, borderColor: '#e7e7e7', borderWidth: 1, marginHorizontal: 5, borderRadius: 3, justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ color: '#fff' }}>10章</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.handleDownload(null, 100) }} style={{ flex: 1, borderColor: '#e7e7e7', borderWidth: 1, marginHorizontal: 5, borderRadius: 3, justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ color: '#fff' }}>100章</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.handleDownload() }} style={{ flex: 1, borderColor: '#e7e7e7', borderWidth: 1, marginHorizontal: 5, borderRadius: 3, justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ color: '#fff' }}>后面全部</Text>
        </TouchableOpacity>
      </View>
    ) : null
  }

  handleOpen = () => {
    this.drawer.openDrawer()
    this.props.navigation.setParams({ visible: false })
  }

  _renderRow = (item, sectionID, rowID) => {
    const rowItemPress = () => {
      if (this.isExist) {
        // updateDiscover({ id: item.bookId, discoverChapterId: item.id, discoverPage: 0, discoverChapterIndex: Number(rowID) })
        this.props.navigation.navigate('viewer', { id: item.id, pageIndex: 0, title: this.book.name })
      } else {
        Toast.info('请收藏后再阅读', 0.7)
      }
    }
    return (
      <TouchableOpacity key={item.id} onPress={rowItemPress}>
        <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#a9a9a9', marginHorizontal: 10 }}>
          <Text style={{ color: this.mode.color }}>{item.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _reanderChapters = () => (
    <View style={{ flex: 1, backgroundColor: this.mode.backgroundColor }}>
      <ListView
        style={{ flex: 1 }}
        initialListSize={50}
        enableEmptySections
        dataSource={this.dataSource.cloneWithRows(this.chapters.slice(0))}
        renderRow={this._renderRow} />
    </View>
  )

  render () {
    const { backgroundColor, color } = this.mode

    return (
      <DrawerLayout
        ref={ref => { this.drawer = ref }}
        drawerWidth={90}
        drawerLockMode='locked-closed'
        renderNavigationView={this._reanderChapters}>
        <View style={{ flex: 1, position: 'relative', backgroundColor }} >
          <StatusBar animated hidden />
          <Pager
            dataSource={this.viewer.dataSource}
            themeColor={color}
            header={this.viewer.name}
            footer={`第${this.viewer.nextIndex}/${this.viewer.total}章`} />
          <ScreenArea
            onLeftPress={this.handlePrev}
            onRightPress={this.handleNext}
            onCenterPress={this.handleMenu} />
          <Dock visible={this.props.navigation.state.params.visible} renderItemView={this.reanderItemView}>
            <Dock.Item text="目录" icon="list" />
            <Dock.Item text="夜间" icon="moon-o" onPress={this.handleChangeMode} />
            <Dock.Item text="设置" icon="gear" onPress={this.handleDockPress} />
            <Dock.Item text="缓存" icon="download" onPress={this.handleDownloadBar} />
          </Dock>
        </View>
      </DrawerLayout>

    )
  }
}

export default Viewer
