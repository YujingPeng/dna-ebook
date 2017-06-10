import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text } from 'react-native'
import Item from './Item'

class Dock extends React.PureComponent {
  static Item = Item
  render () {
    const { children, visible, renderItemView } = this.props
    if (visible) {
      return (
        <View style={styles.container}>
          <View>
            {renderItemView}
          </View>
          <View style={styles.dock}>
            {children}
          </View>
        </View>
      )
    } else {
      return null
    }
  }
}

Dock.propTypes = {
  visible: PropTypes.bool.isRequired
}

Dock.defaultProps = {
  visible: false
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    bottom: 0,
    opacity: 0.8,
    position: 'absolute',
    width: '100%',
    zIndex: 100
  },
  dock: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 50
  },
  dockItem: {
    alignItems: 'center', flex: 1
  },
  dockText: {
    color: '#ffffff'
  }
})

export default Dock
