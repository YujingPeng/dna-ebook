/**
 * Created by adam on 2017/3/1.
 */
import React from 'react'
import { View, Text } from 'react-native'
import Spinner from 'react-native-spinkit'

const CommonSpinner = ({ isVisible = true, size = 50, type = 'ChasingDots', color = '#00ced1', children }) => {
  if (isVisible) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner isVisible={isVisible} size={size} type={type} color={color} />
        <Text style={{ paddingTop: 10 }}>加载中...</Text>
      </View>
    )
  } else {
    return children
  }
}

export default CommonSpinner
