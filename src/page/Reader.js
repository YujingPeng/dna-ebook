import React, { Component } from 'react';
import { View, Text, ScrollView, WebView, TouchableOpacity } from 'react-native';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import { ChapterModel } from '../domain/Book';
import { tmpl } from '../assets/html';

@observer
class Reader extends Component {
  static navigationOptions = {
    title: 'aa',
    header: {
      visible: false
    }
  }

  @observable
  chapter = new ChapterModel();

  componentDidMount() {
    this.chapter.get(this.props.navigation.state.params.url);
  }

  handleMessage = (event) => {
    if (event.nativeEvent.data) {
      alert('到底了')
    }
  }

  render() {
    // const html = tmpl(this.chapter.content);
    // console.log(this.htmlss);
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.handlePress} style={{ flex: 1 }}>
          <WebView
            onMessage={this.handleMessage}
            source={{ html: this.chapter.htmlstring }}
            style={{ backgroundColor: '#ececec', flex: 1 }}
            javaScriptEnabled={true}
            scrollEnabled={false}
          >
          </WebView>
        </TouchableOpacity>
      </View>
    );
  }
}


export default Reader;
