import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, StyleSheet } from 'react-native'

class Pager extends React.PureComponent {
  static propTypes = {
    themeColor: PropTypes.string.isRequired,
    dataSource: PropTypes.array.isRequired
  }
  render () {
    const {header, themeColor, dataSource, footer} = this.props
    const items = dataSource.map(item => (<Text key={item.key} style={[item.style, { color: themeColor }]} children={item.children} />))
    return (
      <View style={styles.container}>
        <View style={styles.header} >
          <Text style={{ color: '#696969' }}>{header}</Text>
        </View>
        <View style={styles.context}>
          {items}
        </View>
        <View style={styles.footer} >
          <Text style={{ alignSelf: 'flex-end', color: '#696969' }}>{footer}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, zIndex: -1, position: 'absolute', height: '100%', width: '100%'
  },
  header: {
    paddingTop: 8, paddingLeft: 17, height: 30
  },
  footer: {
    paddingRight: 18, height: 30
  },
  context: {
    paddingLeft: 17, flex: 1
  }
})

export default Pager
