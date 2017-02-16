import React, { Component } from 'react';
import { View, Text, ScrollView, WebView } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { ChapterModel } from '../domain/Book/BookService';

@observer
class Reader extends Component {
  static navigationOptions = {
    title: 'aa',
    header: {
      visible: false
    }
  }

  @observable
  chapter = new ChapterModel()

  componentDidMount() {
    this.chapter.get(this.props.navigation.state.params.url);
  }


  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <WebView source={{ html: this.chapter.content }} style={{ backgroundColor: '#ececec', flex: 1, }}
          scrollEnabled={false}>
        </WebView>
      </View>
    );
  }
}

export default Reader;
