import React from 'react'
import ScreenArea from '../viewer/ScreenArea'
import { View, ListView, Text, StyleSheet, Dimensions } from 'react-native'

const ScreenWidth = Dimensions.get('window').width

class Pager extends React.Component {
  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  handleChangeVisibleRows = (visibleRows, changedRows) => {
    console.log('handleChangeVisibleRows', JSON.stringify(changedRows))
  }

  handleLeftPress = () => {
    this.props.onLeftPress && this.props.onLeftPress()
  }
  handleRightPress = () => {
    this.props.onRightPress && this.props.onRightPress()
  }
  handleCenterPress = () => {
    this.props.onCenterPress && this.props.onCenterPress()
  }

  handleScroll =(event) => {
    const offset = (
      event && event.nativeEvent && event.nativeEvent.contentOffset && event.nativeEvent.contentOffset['x']
    ) || 0
    console.warn(Math.ceil(offset / 180))
  }

  _renderItem = (item) => {
    return (
      <View style={styles.pagerContainer}>
        <View style={styles.context}>
          {item.context.map(context => (<Text {...context} />))}
        </View>
        <ScreenArea
          onLeftPress={this.handleLeftPress}
          onRightPress={this.handleRightPress}
          onCenterPress={this.handleCenterPress} />
      </View>

    )
  }

  /* showsHorizontalScrollIndicator={false} */
  render () {
    return (
      <View style={styles.container}>
        <ListView
          horizontal
          pagingEnabled
          enableEmptySections
          pageSize={1}
          initialListSize={1}
          dataSource={this.ds.cloneWithRows(this.props.context)}
          renderRow={this._renderItem}
          onScrollEndDrag={this.handleScroll}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, height: '100%', width: '100%'
  },
  pagerContainer: {
    position: 'relative', width: ScreenWidth, flex: 1
  },
  header: {
    paddingTop: 8, paddingLeft: 17, height: 30
  },
  footer: {
    paddingRight: 18, height: 30
  },
  context: {
    paddingLeft: 17, zIndex: -1, position: 'absolute'
  }
})

export default Pager
