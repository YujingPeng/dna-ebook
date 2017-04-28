import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native'
var Dimensions = require('Dimensions')
var ScreenWidth = Dimensions.get('window').width
var ScreenHeight = Dimensions.get('window').height
import ChapterModel from '../domain/Book/ChapterModel'
import { computed, observable, action, autorunAsync} from 'mobx'
// import Viewer from '../components/Viewer'
import { observer } from 'mobx-react/native'

function splitHtml (s): string[] {
  if (s) {
    return s.match && s.match(/([\W\w]+?)<br\/>/g)
  } else {
    return []
  }
}

function zhcnCode (s) {
  return /[^\x00-\xff]/.test(s)
}

const lineHeight = 30
let fontSize = 20
// 进一
const lineMax = Math.ceil((ScreenHeight - 100) / lineHeight)
// 取整
// const lineEnd = parseInt(ScreenWidth / 20)

function lineFeed (str: string, prefix) {
  let result = []
  let chars = str.split('')
  let linefeed = 0
  // 第一次转换需要进行首航缩进
  let lineEnd = ScreenWidth - (fontSize * 2)
  if (!str && str === '') return result
  let start = 0
  let size = 0
  for (let i = 0, length = chars.length; i < length; i++) {
    size = zhcnCode(chars[i]) ? fontSize : fontSize / 2
    if ((linefeed + size) > lineEnd) {
      i--
      if (result.length === 0) {
        result.push(<Text key={prefix + '_' + i} style={styles.textFirst}>{chars.slice(start, i)}</Text>)
        lineEnd = ScreenWidth
      } else {
        result.push(<Text key={prefix + '_' + i} style={styles.text}>{chars.slice(start, i)}</Text>)
      }
      start = i
      linefeed = size
    } else {
      linefeed += size
    }
  }
  result.push(<Text key={prefix + '_'} style={styles.text}>{chars.slice(start)}</Text>)

  return result
}

@observer
class Viewer extends Component {
  static navigationOptions = {
    header: ({ state }) => {
      return {
        visible: state.params.visible || false,
        title: state.params.title,
        style: {
          position: 'absolute',
          top: 0,
          zIndex: 100,
          width: '100%'
        }
      }
    }
  }

  @observable
  pageIndex = 1

  @computed get start () {
    return lineMax * (this.pageIndex - 1)
  }

  @computed get end () {
    return lineMax * this.pageIndex
  }

  @computed get total () {
    const total = Math.ceil(this.chapter.lines.length / lineMax)
    return total === 0 ? 1 : total
  }

  chapter = new ChapterModel(this.props.navigation.state.params.uri, this.props.navigation.state.params.title);

  componentWilMount () {
    this.chapter.get()
  }
  @action
  handlePrev =() => {
    if (this.pageIndex > 1) {
      this.pageIndex--
    } else {
      this.pageIndex = 1
      this.chapter.prev()
    }
  }
  @action
  handleNext =() => {
    if (this.pageIndex < this.total) {
      this.pageIndex++
    } else {
      this.chapter.next()
      this.pageIndex = 1
    }
  }
  handleMenu =() => {
    this.props.navigation.setParams({visible: !this.props.navigation.state.params.visible, title: this.chapter.name})
  }

  render () {
    const ds = this.chapter.lines.slice(this.start, this.end)
    return (
      <View style={{ flex: 1, position: 'relative' }} >
        <View style={{ flex: 1, zIndex: -1, position: 'absolute' }}>
          <View style={{ paddingLeft: 10 }}>
            {ds.map(item => (
              <Text key={item.key} style={styles[item.style]} children={item.children} />
            ))}
          </View>
        </View>
        <View style={{ padding: 10, flex: 1, position: 'absolute', bottom: 0, right: 0 }} >
          <Text style={{ alignSelf: 'flex-end' }}>{this.pageIndex}/{this.total}</Text>
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
