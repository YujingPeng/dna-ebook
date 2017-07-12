import React, {Component, PropTypes } from 'react'
import {
  View,
  Animated,
  Image,
  Dimensions
} from 'react-native'
var WINDOW_WIDTH = Dimensions.get('window').width

export default class Splash extends Component {
    static propTypes = {
      // 图片资源
      source: Image.source,
      // 动画执行完毕回调
      animateEnd: PropTypes.func
    }

    constructor (props) {
    super(props)
    this.state = {
      fadeAnim: new Animated.Value(0.4)
    }
  }

    componentDidMount () {
    const {animateEnd} = this.props
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 1500
      }
    ).start(() => {
      // 动画执行完毕
      if (animateEnd) {
        animateEnd()
      }
    })
  }

    render () {
    const {source} = this.props
    return (
      <View style={{flex: 1}}>
        <Animated.Image style={{flex: 1, width: WINDOW_WIDTH, height: 1, opacity: this.state.fadeAnim}}
          source={source} />
      </View>
    )
  }
}
