import React from 'react'
import PropTypes from 'prop-types'
import {View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import moment from 'moment'

class BookItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onPress: PropTypes.func
  }
  handlePress = () => {
    if (this.props.onPress) {
      const {item, index} = this.props
      this.props.onPress({item, index})
    }
  }

  handleLongPress = () => {
    if (this.props.onLongPress) {
      const {item, index} = this.props
      this.props.onLongPress({item, index})
    }
  }

  render () {
    const {item} = this.props
    const time = moment(item.updateAt, 'YYYY-MM-DD HH:mm:ss')
    return (
      <TouchableOpacity onPress={this.handlePress} style={styles.listItem} onLongPress={this.handleLongPress}  activeOpacity={0.6}>
        <View style={styles.listItemContent}>
          <View style={styles.itemImgContent}>
            {item.thumbImage !== '' ? <Image source={{uri: item.thumbImage}} style={styles.itemImg} /> : null}
          </View>
          <View style={{flex: 1, paddingLeft: 10, paddingRight: 10}}>
            <Text style={{color: '#333', fontSize: 16}}>
              {item.name}
            </Text>
            <Text style={styles.itemDesc}>
              <Text>{item.author}</Text>
              <Text> | 已读 {((item.discoverChapterIndex + 1) / item.totalChapter * 100).toFixed(2)}%</Text>
            </Text>
            <Text style={styles.itemDesc}>{time.isValid() && time.fromNow()}更新 | {item.latestChapter}</Text>
          </View>
        </View>
      </TouchableOpacity>

    )
  }
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#fff',
    paddingRight: 10,
  },
  listItemContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e7e7e7',
    flexWrap: 'wrap',
    width: Dimensions.get('window').width
  },
  itemImgContent: {
    width: 60,
    height: 80,
    borderWidth: 1,
    borderColor: '#e7e7e7',
    backgroundColor: 'black',
    elevation: 15,
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 3
  },
  itemImg: {
    width: '100%',
    height: '100%'
  },
  itemDesc: {
    fontSize: 13,
    color: '#999',
    paddingTop: 4
  },

})

export default BookItem
