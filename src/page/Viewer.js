import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import ViewerModel from '../model/ViewerModel'
import { observer } from 'mobx-react/native'
import { Toast } from 'antd-mobile'

@observer
class Viewer extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state = {} } = navigation
    const { visible = false, title } = state.params || {}
    return visible ? { title, headerStyle: { position: 'absolute', top: 0, zIndex: 100, width: '100%' } } : { header: null }
  }

  chapter = new ViewerModel(this.props.navigation.state.params.id, this.props.navigation.state.params.title, this.props.navigation.state.params.pageIndex);

  loading= () => {
    return new Promise((resolve, reject) => {
      Toast.loading('正在加载...', 0)
      return resolve(true)
    })
  }

  handlePrev = async () => {
    if (this.props.navigation.state.params.visible) {
      this.handleMenu()
    } else if (this.chapter.pageIndex > 0) {
    // this.pageIndex--
      this.chapter.discover(this.chapter.pageIndex - 1)
    } else {
      await this.loading()
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
      await this.loading()
      await this.chapter.jump(1)
    }
  }

  handleMenu = () => {
    this.props.navigation.setParams({ visible: !this.props.navigation.state.params.visible, title: this.chapter.name })
  }

  render () {
    return (
      <View style={{ flex: 1, position: 'relative' }} >
        <View style={{ flex: 1, zIndex: -1, position: 'absolute' }}>
          <View style={{ paddingLeft: 10 }}>
            {this.chapter.dataSource.map(item => (<Text key={item.key} style={item.style} children={item.children} />))}
          </View>
        </View>
        <View style={{ padding: 10, flex: 1, position: 'absolute', bottom: 0, right: 0 }} >
          <Text style={{ alignSelf: 'flex-end' }}>{this.chapter.nextIndex}/{this.chapter.total}</Text>
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
      </View>
    )
  }
}

export default Viewer
