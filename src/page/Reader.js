import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react/native'
import { ChapterModel } from '../domain/Book'
import HtmlView from '../components/HtmlView'
import personStore from '../store/personStore'
import {action} from 'mobx'

@observer
class Reader extends Component {
  static navigationOptions = {
    header: ({state}) => {
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
  chapter = new ChapterModel(this.props.navigation.state.params.uri, this.props.navigation.state.params.title);

  componentDidMount () {
    this.chapter.get()
  }

  @action
  handleMessage = (event) => {
    switch (event.nativeEvent.data) {
      case '-1':
        let prev = personStore.cacheBook.prev()
        this.chapter.uri = prev.uri
        this.chapter.name = prev.text
        this.chapter.get()
        break
      case '1':
        let next = personStore.cacheBook.next()
        this.chapter.uri = next.uri
        this.chapter.name = next.text
        this.chapter.get()
        break
      default:
        this.props.navigation.setParams({visible: !this.props.navigation.state.params.visible, title: this.chapter.name})
        break
    }
  }

  render () {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity style={{ flex: 1 }}>
          <HtmlView content={this.chapter.content} onMessage={this.handleMessage} />
        </TouchableOpacity>
      </View>
    )
  }
}

export default Reader
