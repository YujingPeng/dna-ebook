import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity } from 'react-native'

class ChapterItem extends React.PureComponent {
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
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#cfcfcf', marginHorizontal: 10, height: 40, justifyContent: 'center' }}>
          <Text>{item.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default ChapterItem
