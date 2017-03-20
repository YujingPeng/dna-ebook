import React, { Component } from 'react'
import { View } from 'react-native'
import { observable } from 'mobx'
import { observer } from 'mobx-react/native'
import { FormProvider, FormItem } from '../components/form'
import { List } from 'antd-mobile'
class TestModel {
  @observable
  name = ''

  constructor (name) {
    this.name = name
  }
}

@observer
class Search extends Component {
  static navigationOptions = {
    title: `搜索`
  };

  form = new TestModel('名字')

  render () {
    return (
      <View>
        <List>
          <FormProvider form={this.form}>
            <FormItem name='name' />
          </FormProvider>
        </List>
      </View>
    )
  }
}

export default Search
