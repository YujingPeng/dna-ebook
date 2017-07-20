import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { View, Text, TouchableOpacity, Image } from 'react-native'

class SearchItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number,
    onPress: PropTypes.func
  }
  handlePress = () => {
    if (this.props.onPress) {
      const { item, index } = this.props
      this.props.onPress({ item, index })
    }
  }

  render () {
    const { item } = this.props
    return (
      <TouchableOpacity key={item.id} onPress={this.handlePress}>
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
                <Text>{item.updateAt ? moment(item.updateAt, 'YYYY-MM-DD HH:mm:ss').fromNow() + '更新' : '暂无更新时间'}</Text>
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
}

export default SearchItem
