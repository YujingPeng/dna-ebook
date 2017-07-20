import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import settingStore from '../../store/settingStore'

export class SettingsDock extends PureComponent {
  handleSizePlus = () => {
    settingStore.saveSetting({ fontSize: settingStore.fontSize + 2 })
  }

  handleSizeMinus = () => {
    settingStore.saveSetting({ fontSize: settingStore.fontSize - 2 })
  }

  handleLineHeightLoose = () => {
    settingStore.saveSetting({ lineHight: 1.5 })
  }

  handleLineHeightCrowded = () => {
    settingStore.saveSetting({ lineHight: 1 })
  }

  handleShowTouchArea = () => {

  }

  handleAutoChange = () => {

  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <TouchableOpacity style={styles.item} onPress={this.handleSizeMinus}>
            <Text style={{ color: '#fff' }}>Aa-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={this.handleSizePlus}>
            <Text style={{ color: '#fff' }}>Aa+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={this.handleLineHeightCrowded}>
            <Icon style={{ color: '#fff' }} name="align-justify" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={this.handleLineHeightLoose}>
            <Icon style={{ color: '#fff' }} name="reorder" />
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <TouchableOpacity style={styles.item} onPress={this.handleShowTouchArea}>
            <Text style={{ color: '#fff' }}>显示触控区域</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={this.handleAutoChange}>
            <Text style={{ color: '#fff' }}>自动切换日夜间主题</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export class DownloadDock extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func.isRequired
  }

  handleAll = () => {
    this.props.onPress(1)
  }

  handle10 = () => {
    this.props.onPress(null, 10)
  }

  handle100 = () => {
    this.props.onPress(null, 100)
  }

  handleAfterAll = () => {
    this.props.onPress()
  }

  render () {
    return (
      <View style={[styles.container, styles.box]}>
        <TouchableOpacity onPress={this.handleAll} style={styles.item} >
          <Text style={{ color: '#fff' }}>全本</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handle10} style={styles.item}>
          <Text style={{ color: '#fff' }}>10章</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handle100} style={styles.item}>
          <Text style={{ color: '#fff' }}>100章</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleAfterAll} style={styles.item}>
          <Text style={{ color: '#fff' }}>后面全部</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: '#e7e7e7',
    borderBottomWidth: 1
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    marginHorizontal: 15,
    marginTop: 10,
    justifyContent: 'space-between',
    paddingBottom: 10
  },
  item: {
    alignItems: 'center',
    borderColor: '#e7e7e7',
    borderRadius: 3,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5
  }
})
