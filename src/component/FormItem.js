import React, { Component } from 'react';
import { View } from 'react-native';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import { InputItem, Toast } from 'antd-mobile';

class FormItem extends React.PureComponent {
  static propTypes = {
    form: React.PropTypes.object.isRequired,
    key: React.PropTypes.string.isRequired,
  }

  get validateError() {
    const k = 'validateError' + this.props.key.slice(0, 1).toUpperCase() + this.props.key.slice(1);
    return this.form[k];
  }

  showErro = () => {
    const error = this.validateError;
    Toast.error(this.props.form[error]);
  }

  handldChange = (v) => {
    this.props.form[this.props.key] = v;
  }

  render() {
    const props = { onChange: this.handldChange, value: this.props.value, error: this.validateError };
    return (
      <View style={{ flex: 1 }}>
        <InputItem {...props}/>
      </View>
    );
  }
}

export default FormItem;
