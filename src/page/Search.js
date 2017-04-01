import React, { Component } from 'react'
import { View, ListView, TouchableOpacity, Image, Text } from 'react-native'
import { observer } from 'mobx-react/native'
import { action, observable, runInAction } from 'mobx'
import BookService from '../domain/Book/BookService'
import { List, InputItem, Button } from 'antd-mobile'

@observer
class Search extends Component {
  static navigationOptions = {
    title: `搜索`
  };

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  @observable
  bookList = this.dataSource.cloneWithRows([])

  @observable
  bookName = ''

  componentWillMount () {
  }

  @action
  handlePress = async () => {
    let result = await BookService.search(this.bookName, 'biquge.com')
    runInAction(() => {
      this.bookList = this.dataSource.cloneWithRows(result)
    })
  }

  handleChange = (v) => {
    this.bookName = v
  }

  renderRow = (item) => {
    const rowItemPress = () => {
      this.props.navigation.navigate('book', { id: item.id, uri: item.uri })
    }

    return (
      <TouchableOpacity key={item.id} onPress={rowItemPress}>
        <View style={{ flex: 1, flexDirection: 'row', padding: 5, borderBottomWidth: 1, borderColor: '#cfcfcf' }}>
          <View style={{ width: 72, height: 90 }}>
            {item.thumbImage !== '' ? <Image source={{ uri: item.thumbImage }} style={{ width: 72, height: 90 }} /> : null}
          </View>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Text>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <List >
          <InputItem value={this.bookName} onChange={this.handleChange} />
          <List.Item>
            <Button onClick={this.handlePress}>搜索</Button>
          </List.Item>
        </List>
        <ListView
          style={{ flex: 1 }}
          initialListSize={50}
          enableEmptySections
          dataSource={this.bookList}
          renderRow={this.renderRow}
        />
      </View>
    )
  }
}

export default Search
