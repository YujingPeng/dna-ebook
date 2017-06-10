import React from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const DockItem = ({onPress, icon, size = 18, text, style = styles.dockText}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.dockItem} >
      <Icon name={icon} size={size} style={style} />
      <Text style={style}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  dockItem: {
    alignItems: 'center', flex: 1
  },
  dockText: {
    color: '#ffffff'
  }
})

DockItem.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  size: PropTypes.number,
  style: PropTypes.object
}

export default DockItem
