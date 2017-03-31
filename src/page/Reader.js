import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react/native'
import { ChapterModel } from '../domain/Book'
import HtmlView from '../components/HtmlView'

@observer
class Reader extends Component {
  static navigationOptions = {

    header: ({state}) => {
      return {
        visible: state.params.visible || false,
        title: state.params.title
      }
    }
  }
  chapter = new ChapterModel(this.props.navigation.state.params.uri, this.props.navigation.state.params.title);

  componentDidMount () {
    this.chapter.get()
  }

  handleMessage = (event) => {
    switch (event.nativeEvent.data) {
      case '-1':
        this.chapter.prev()
        break
      case '1':
        this.chapter.next()
        break
      default:
        this.props.navigation.setParams({visible: !this.props.navigation.state.params.visible, title: this.chapter.name})
        break
    }
  }

  render () {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.handlePress} style={{ flex: 1 }}>
          <HtmlView content={this.chapter.content} onMessage={this.handleMessage} />
        </TouchableOpacity>
      </View>
    )
  }
}

export default Reader
