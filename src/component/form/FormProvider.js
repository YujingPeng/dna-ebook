/**
 * Created by cooclsee on 2017/3/8.
 */

import React, { Component, PropTypes } from 'react'

/**
 * 表单处理类
 */
export default class FormProvider extends Component {
  static propType = {
    form: PropTypes.object,
    children: PropTypes.element.isRequired
  }

  static childContextTypes = {
    form: PropTypes.object
  }

  getChildContext () {
    return {
      form: this.props.form
    }
  }

  render () {
    return React.Children.only(this.props.children)
  }
}
