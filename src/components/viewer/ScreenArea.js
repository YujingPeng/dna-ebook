import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

const ScreenArea = ({onLeftPress, onRightPress, onCenterPress}) => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1, opacity: 0.3, height: '100%', width: '100%', flexDirection: 'row'
  },
  item: {
    flex: 1
  }
})

ScreenArea.propTypes = {
  onLeftPress: PropTypes.func,
  onCenterPress: PropTypes.func,
  onRightPress: PropTypes.func
}

export default ScreenArea
