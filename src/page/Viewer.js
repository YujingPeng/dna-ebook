import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native'
import ViewerModel from '../model/ViewerModel'
import { observer } from 'mobx-react/native'
import { loading } from '../components/loading'
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

  chapter = new ViewerModel(this.props.navigation.state.params.id, this.props.navigation.state.params.title, this.props.navigation.state.params.pageIndex);

  handlePrev = async () => {
    if (this.props.navigation.state.params.visible) {
      this.handleMenu()
    } else if (this.chapter.pageIndex > 0) {
      // this.pageIndex--
      this.chapter.discover(this.chapter.pageIndex - 1)
    } else {
      await loading()
      await this.chapter.jump(-1)
    }
  }

  handleNext = async () => {
    if (this.props.navigation.state.params.visible) {
      this.handleMenu()
    } else if (this.chapter.nextIndex < this.chapter.total) {
      // this.pageIndex++
      this.chapter.discover(this.chapter.pageIndex + 1)
    } else {
      await loading()
      await this.chapter.jump(1)
    }
  }

  handleMenu = () => {
    this.props.navigation.setParams({ visible: !this.props.navigation.state.params.visible })
  }

  handleDockPress = () => {

  }

  _renderDock = () => {
    return this.props.navigation.state.params.visible ? (
      <View style={styles.dock}>
        <TouchableOpacity onPress={this.handleDockPress} style={styles.dockItem} >
          <Icon name="list" size={18} style={styles.dockText} />
          <Text style={styles.dockText}>目录</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleDockPress} style={styles.dockItem} >
          <Icon name="moon-o" size={18} style={styles.dockText} />
          <Text style={styles.dockText}>夜间</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleDockPress} style={styles.dockItem} >
          <Icon name="gear" size={18} style={styles.dockText} />
          <Text style={styles.dockText}>设置</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleDockPress} style={styles.dockItem}>
          <Icon name="download" size={18} style={styles.dockText} />
          <Text style={styles.dockText}>缓存</Text>
        </TouchableOpacity>
      </View>
    ) : null
  }

  render () {
    return (
      <View style={{ flex: 1, position: 'relative', backgroundColor: '#f5deb3' }} >
        <StatusBar animated hidden showHideTransition="slide" />
        <View style={{ flex: 1, zIndex: -1, position: 'absolute', height: '100%', width: '100%' }}>
          <View style={{ padding: 5, height: 30 }} >
            <Text>{this.chapter.name}</Text>
          </View>
          <View style={{ paddingLeft: 10, flex: 1 }}>
            {this.chapter.dataSource.map(item => (<Text key={item.key} style={item.style} children={item.children} />))}
          </View>
          <View style={{ padding: 5, height: 30 }} >
            <Text style={{ alignSelf: 'flex-end' }}>{this.chapter.nextIndex}/{this.chapter.total}</Text>
          </View>
        </View>
        <View style={{ flex: 1, opacity: 0.3, height: '100%', width: '100%', flexDirection: 'row' }} key="mode" >
          <TouchableOpacity style={{ flex: 1 }} onPress={this.handlePrev} />
          <View style={{ flex: 1 }} >
            <TouchableOpacity onPress={this.handlePrev} style={{ flex: 1 }} />
            <TouchableOpacity onPress={this.handleMenu} style={{ flex: 1 }} />
            <TouchableOpacity onPress={this.handleNext} style={{ flex: 1 }} />
          </View>
          <TouchableOpacity onPress={this.handleNext} style={{ flex: 1 }} />
        </View>
        {this._renderDock()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dock: {
    alignItems: 'center',
    backgroundColor: '#000000',
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    height: 50,
    position: 'absolute',
    width: '100%',
    zIndex: 100
  },
  dockItem: {
    alignItems: 'center', flex: 1
  },
  dockText: {
    color: '#ffffff'
  }
})

export default Viewer
