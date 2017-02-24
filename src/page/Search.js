import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { InputItem, List } from 'antd-mobile';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import validate from 'mobx-form-validate';

@observer
class Search extends Component {
  static navigationOptions = {
    title: `搜索`
  };

  @observable
  query = ''

  render() {
    return (
      <View>
        <List>
          <InputItem value={this.query}></InputItem>
        </List>
      </View>
    );
  }
}

export default Search;
