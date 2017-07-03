import React, { Component } from 'react'
import { View, ListView, TouchableOpacity, Image, Text, StatusBar } from 'react-native'
import { observer } from 'mobx-react/native'
import { action, observable, runInAction, computed } from 'mobx'
import { search, cachedSearchKeyword } from '../service'
import { SearchBar, Toast, Popup, Radio, List, Tag } from 'antd-mobile'
import { color } from '../env'
import Icon from 'react-native-vector-icons/FontAwesome'
import settingStore from '../store/settingStore'
import moment from 'moment'

@observer
class Search extends Component {
  static navigationOptions = {
    header: null
  };

  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  @computed get dataSource () {
    return this.ds.cloneWithRows(this.bookList.slice())
  }
  @observable
  bookList = []

  @observable
  bookName = ''

  @computed get History () {
    const history = settingStore.searchHistory || []
    return history.slice()
  }

  componentWillMount () {
    this.init()
  }

  @action
  init = async () => {
    // this.history = await getSearchHistory() || []
  }

  @action
  handleSearch = async () => {
    try {
      settingStore.cacheSearchHistory(this.bookName)
      cachedSearchKeyword(this.bookName)
      let result = await search(this.bookName, settingStore.sourceName)
      if (result.length > 0) {
        runInAction(() => {
          this.bookList = result
        })
      } else {
        Toast.info('查找不到相关的数据', 0.7)
      }
    } catch (error) {
      Toast.fail('查找不到相关的数据', 0.7)
    }
  }

  @action
  handleChange = (v) => {
    this.bookName = v
  }

  @action
  handleCencel = () => {
    this.props.navigation.goBack()
  }

  onMaskClose = () => {

  }
  handleChangeSource = () => {
    Popup.show(<PopupContent onClose={() => Popup.hide()} />, { animationType: 'slide-up', onMaskClose: this.onMaskClose })
  }

  @action
  handleHistoryTagChange = (keyword) => {
    this.bookName = keyword
    this.handleSearch()
  }

  renderRow = (item) => {
    const rowItemPress = () => {
      this.props.navigation.navigate('book', { id: item.id, uri: item.uri, name: item.name })
    }

    return (
      <TouchableOpacity key={item.id} onPress={rowItemPress}>
        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', paddingVertical: 12, paddingLeft: 15, borderBottomWidth: 1, borderColor: '#cfcfcf' }}>
          <View style={{ width: 72, height: 90 }}>
            {item.thumbImage !== '' ? <Image source={{ uri: item.thumbImage }} style={{ width: 72, height: 90 }} /> : null}
          </View>
          <View style={{ flex: 1, paddingLeft: 15, justifyContent: 'space-around' }}>
            <View>
              <Text>
                <Text style={{ color: '#333', fontSize: 20 }}>{item.name}</Text>
              </Text>
              <Text style={{ color: '#999', fontSize: 14 }}>
                <Text >{item.author}</Text>
                {' | '}
                <Text >{item.type || '其他类型'}</Text>
                {' | '}
                <Text>{moment(item.updateAt, 'YYYY-MM-DD HH:mm:ss').fromNow()}更新</Text>
              </Text>
              <Text numberOfLines={1} style={{ fontSize: 16 }}>{item.desc}</Text>
              <Text>
                <Text style={{ fontSize: 14, color: '#999' }}>{item.latestChapter}</Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    const tags = this.History.map((item, index) => {
      return (
        <View key={index} style={{ padding: 5 }}>
          <Tag onChange={() => { this.handleHistoryTagChange(item.keyword) }}>{item.keyword}</Tag>
        </View>
      )
    })
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <StatusBar hidden={false} backgroundColor={color} barStyle='dark-content' />
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.handleChangeSource} style={{ width: 40, paddingLeft: 15, paddingRight: 5, justifyContent: 'center', backgroundColor: '#efeff4' }}>
            <Icon style={{ color }} name="reorder" size={20} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <SearchBar showCancelButton value={this.bookName} onChange={this.handleChange} onSubmit={this.handleSearch} onCancel={this.handleCencel} placeholder='请输入关键字' />
          </View>
        </View>
        {
          !this.bookName ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 5 }}>{tags}</View>
          ) : (
            <ListView
              style={{ flex: 1 }}
              initialListSize={50}
              enableEmptySections
              dataSource={this.dataSource}
              renderRow={this.renderRow}
            />
          )
        }

      </View>
    )
  }
}

class PopupContent extends React.Component {
  onSel = (sourceName) => {
    settingStore.saveSetting({sourceName})
    this.props.onClose()
  };
  render () {
    return (
      <List renderHeader={() => `请选择书源`}>
        {
          settingStore.sites.map(item => (
            <Radio.RadioItem key={item.value}
              checked={settingStore.sourceName === item.value} onChange={() => this.onSel(item.value)} >
              <Text>{item.label}</Text>
            </Radio.RadioItem>
          ))
        }
      </List>
    )
  }
}

export default Search
