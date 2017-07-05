import React from 'react'
import ScreenArea from '../viewer/ScreenArea'
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native'
import { observer } from 'mobx-react'
import { action, observable } from 'mobx'
const sliderWidth = Dimensions.get('window').width

const SCROLL_STATE = {
  idle: 'idle',
  settling: 'settling',
  dragging: 'dragging'
}

@observer
class Pager extends React.Component {
  handleLeftPress = () => {
    this.props.onLeftPress && this.props.onLeftPress()
  }
  handleRightPress = () => {
    this.paper.scrollToIndex({ viewPosition: 0, index: 2 })
    this.props.onRightPress && this.props.onRightPress()
  }
  handleCenterPress = () => {
    this.props.onCenterPress && this.props.onCenterPress()
  }

  _scrollState = SCROLL_STATE.idle

  _preScrollX = null
  @observable
  _isLeft = true

  @observable
  _currentPage = this.props.initPage

  @observable
  displayPage = this.props.initPage + 1

  @action
  handleScroll = (e) => {
    let { x } = e.nativeEvent.contentOffset
    let position = Math.floor(x / sliderWidth)
    if (x === this._preScrollX) return
    this._preScrollX = x
    if (position === this._currentPage && !(this._isLeft && this._currentPage === 0)) {
      this._isLeft = !this._isLeft
      this.displayPage = this._isLeft ? (position + 1) : (position + 2)
    } else {
      this.displayPage = position + 1
    }
    this._currentPage = position

    console.warn('isLeft', position, this._isLeft, this._currentPage)
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.pagerContainer}>
        <View style={styles.context}>
          <Text style={{ fontSize: 18, lineHeight: 30 }}>
            {item.context}
          </Text>
        </View>
        <ScreenArea
          onLeftPress={this.handleLeftPress}
          onRightPress={this.handleRightPress}
          onCenterPress={this.handleCenterPress} />
      </View>

    )
  }
  _getItemLayout = (data, index) => {
    return { length: sliderWidth, offset: sliderWidth * index, index }
  }

  render () {
    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          pagingEnabled
          ref={(ref) => { this.paper = ref }}
          initialNumToRender={1}
          initialScrollIndex={this.props.initPage}
          getItemLayout={this._getItemLayout}
          data={this.props.context}
          renderItem={this._renderItem}
          showsHorizontalScrollIndicator={false}
          onScrollEndDrag={this.handleScroll}
        />
        <View style={styles.footer} >
          <Text style={{ alignSelf: 'flex-end', color: '#696969' }}>{this.displayPage}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, height: '100%', width: '100%'
  },
  pagerContainer: {
    position: 'relative', width: sliderWidth, flex: 1
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
