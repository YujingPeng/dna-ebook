import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, SwipeAction, Image } from 'react-native'
import moment from 'moment'

class BookItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
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
    const time = moment(item.updateAt, 'YYYY-MM-DD HH:mm:ss')
    return (
      <TouchableOpacity onPress={this.handlePress} style={{ backgroundColor: '#F5F5F5' }}>
        <View style={{ flex: 1, marginLeft: 15, flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#e7e7e7' }}>
          <View style={{ width: 40, height: 50, borderWidth: 1, borderColor: '#e7e7e7' }}>
            {item.thumbImage !== '' ? <Image source={{ uri: item.thumbImage }} style={{ width: 40, height: 50 }} /> : null}
          </View>
          <View style={{ marginHorizontal: 10, justifyContent: 'space-around' }}>
            <Text style={{ color: '#333', fontSize: 18 }}>
              {item.name}
              <Text style={{ color: '#999', fontSize: 12 }}> {item.author} {((item.discoverChapterIndex + 1) / item.totalChapter * 100).toFixed(2)}%</Text>
            </Text>
            <Text numberOfLines={1}><Text style={{ color: '#999', fontSize: 12 }}>{time.isValid() && time.fromNow()}更新：</Text>{item.latestChapter}</Text>
          </View>
        </View>
      </TouchableOpacity>

    )
  }
}

export default BookItem
