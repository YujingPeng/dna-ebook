import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

class ScreenArea extends React.PureComponent {
  static propTypes = {
    onLeftPress: PropTypes.func,
    onCenterPress: PropTypes.func,
    onRightPress: PropTypes.func
  }
  render () {
    const { onLeftPress, onRightPress, onCenterPress } = this.props
    return (
      <View style={styles.container} >
        <TouchableOpacity style={styles.item} onPress={onLeftPress} />
        <View style={styles.item} >
          <TouchableOpacity onPress={onLeftPress} style={styles.item} />
          <TouchableOpacity onPress={onCenterPress} style={styles.item} />
          <TouchableOpacity onPress={onRightPress} style={styles.item} />
        </View>
        <TouchableOpacity onPress={onRightPress} style={styles.item} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, opacity: 0.3, height: '100%', width: '100%'
  },
  item: {
    flex: 1, flexDirection: 'row'
  }
})

export default ScreenArea
