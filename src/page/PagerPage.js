import React, { Component } from 'react'
import { View, Text } from 'react-native'
import Pager from '../components/pager'

export default class PagerPage extends Component {
  static navigationOptions = ({ navigation }) => {
    return { header: null }
  }
  render () {
    return (
      <View style={{ flex: 1 }}>
        <Pager />
      </View>
    )
  }
}
