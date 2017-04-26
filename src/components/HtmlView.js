import React, { Component } from 'react'
import { WebView } from 'react-native'

export default class HtmlView extends Component {
  static propTypes={
    onMessage: React.PropTypes.func.isRequired,
    content: React.PropTypes.string.isRequired
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.content != this.props.content) {
      this.webviewRef.reload()
    }
  }

  _renderHtmlView = (content) => {
    return `renderInit('${content}')`
  }

  render () {
    return (
      <WebView
        ref={(ref) => this.webviewRef = ref}
        onMessage={this.props.onMessage}
        source={require('../assets/tmpl.html')}
        style={{ backgroundColor: '#ececec', flex: 1 }}
        javaScriptEnabled
        injectedJavaScript={this._renderHtmlView(this.props.content)}
      />
    )
  }
}
