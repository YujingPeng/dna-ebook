/**
 * @Author: guanzhenjie
 * @Date:   2017-03-03T09:10:35+08:00
 * @Email:  guanzhenjie@ut.cn
 * @Last modified by:   guanzhenjie
 * @Last modified time: 2017-03-08T14:31:07+08:00
 * @Copyright: Unitech
 */

import React, { Component, PropTypes } from 'react'
import { Text } from 'react-native'
import { observer } from 'mobx-react/native'
import { InputItem, Toast } from 'antd-mobile'
import camelCase from 'camelcase'

@observer
class FormItem extends Component {
  static propTypes = {
    form: PropTypes.object,
    name: PropTypes.string.isRequired,
    autoFocus: PropTypes.bool,
    title: PropTypes.string,
    ...InputItem.propTypes
  }

  static contextTypes = {
    form: PropTypes.object
  }

  static defaultProps = {
    ...InputItem.defaultProps
  }

  state = {
    focused: this.props.autoFocus
  }

  form = this.context.form || this.props.form

  validateKey = camelCase('validateError', this.props.name)

  onFocus = () => {
    if (!this.state.focused) {
      this.setState({focused: true})
    }
  }

  showError = () => {
    Toast.fail(this.form[this.validateKey], 1)
  }

  onChangeText = (text) => {
    const {name} = this.props
    this.form[name] = text
  }

  render () {
    const {name, title, ...other} = this.props
    const {focused} = this.state
    const props = {
      ...other,
      onChange: this.onChangeText,
      error: !!this.form[this.validateKey] && focused,
      onErrorClick: this.showError,
      onFocus: this.onFocus,
      value: this.form[name]
    }
    if (title) {
      return (<InputItem {...props}><Text>{title}</Text></InputItem>)
    }
    return (<InputItem {...props} />)
  }
}

export default FormItem
