import React, { Component } from 'react'
import { View, Text, ScrollView, WebView, TouchableOpacity } from 'react-native'
import { observable, computed, autorunAsync } from 'mobx'
import { observer } from 'mobx-react/native'
import { ChapterModel } from '../domain/Book'
import HtmlView from '../components/HtmlView';

@observer
class Reader extends Component {
  static navigationOptions = {
    title: 'aa',
    header: {
      visible: false
    }
  }
  chapter = new ChapterModel(this.props.navigation.state.params.uri);

  componentDidMount() {
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
        alert('弹出菜单')
        break
    }
  }

  render() {
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
