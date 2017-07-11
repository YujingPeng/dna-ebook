import React from 'react'
import PropTypes from 'prop-types'
import { View, FlatList, Text, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react'

@observer
class ChapterList extends React.Component {
  handleItemPress = (props) => {
    if (this.props.onItemPress) {
      this.props.onItemPress(props)
    }
  }

  keyExtractor = (item, index) => item.id

  renderItem = (props) => <ListItem {...props} onPress={this.handleItemPress} />

  render () {
    return (
      <FlatList data={this.props.data} initialNumToRender={10} renderItem={this.renderItem} keyExtractor={this.keyExtractor} />
    )
  }
}

class ListItem extends React.PureComponent {
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

class ListViewItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onPress: PropTypes.func
  }
  handlePress = () => {
    if (this.props.onPress) {
      const { item, rowID } = this.props
      this.props.onPress({ item, rowID })
    }
  }

  render () {
    const { item } = this.props
    return (
      <TouchableOpacity key={item.id} onPress={this.handlePress}>
        <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#cfcfcf', marginHorizontal: 10 }}>
          <Text>{item.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export { ListViewItem, ListItem }
