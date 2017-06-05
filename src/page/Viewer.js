import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
const Dimensions = require('Dimensions')
const ScreenHeight = Dimensions.get('window').height
import ChapterModel from '../model/ChapterModel'
import { computed, observable, action, runInAction } from 'mobx'
import { observer } from 'mobx-react/native'

const lineHeight = 30
let fontSize = 20
// 进一
const lineMax = Math.round((ScreenHeight - 100) / lineHeight)

@observer class Viewer extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state = {} } = navigation
    const { visible = false, title } = state.params || {}
    return visible ? { title, headerStyle: { position: 'absolute', top: 0, zIndex: 100, width: '100%' } } : { header: null }
  }

  chapter = new ChapterModel(this.props.navigation.state.params.id, this.props.navigation.state.params.title);

  @observable pageIndex = this.props.navigation.state.params.pageIndex || 0

  @computed get total () {
    const total = Math.ceil(this.chapter.lines.length / lineMax)
    return total === 0 ? 1 : total
  }

  @computed get nextIndex () {
    return this.pageIndex + 1
  }

  @computed get dataSource () {
    return this.chapter.lines.slice(lineMax * this.pageIndex, lineMax * this.nextIndex)
  }

  @action
  handlePrev =async () => {
    if (this.pageIndex > 0) {
      this.pageIndex--
      this.chapter.discover(this.pageIndex)
    } else {
      await this.chapter.jump(-1)
      runInAction(() => {
        this.pageIndex = 0
      })
    }
  }

  @action
  handleNext =async () => {
    if (this.nextIndex < this.total) {
      this.pageIndex++
      this.chapter.discover(this.pageIndex)
    } else {
      await this.chapter.jump(1)
      runInAction(() => {
        this.pageIndex = 0
      })
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
            {this.dataSource.map(item => (<Text key={item.key} style={styles[item.style]} children={item.children} />))}
          </View>
        </View>
        <View style={{ padding: 10, flex: 1, position: 'absolute', bottom: 0, right: 0 }} >
          <Text style={{ alignSelf: 'flex-end' }}>{this.nextIndex}/{this.total}</Text>
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

const styles = StyleSheet.create({
  text: {
    fontSize, lineHeight
  },
  textFirst: {
    fontSize, lineHeight, paddingLeft: fontSize * 2
  }
})

export default Viewer
