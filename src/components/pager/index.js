import React, { PureComponent } from 'react'
import { View, ListView, Text, StyleSheet, Dimensions } from 'react-native'
import { observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'
import cheerio from 'cheerio-without-node-native'

import textcontent from '../../assets/text'

const ScreenWidth = Dimensions.get('window').width
const ScreenHeight = Dimensions.get('window').height

function zhcnCode (s) {
  return /[^\x00-\xff]/.test(s)
}

function AZCode (s) {
  return /[^\x41-\x5a]/.test(s)
}

/**
 * 获取一个字符的大小
 * @param {String} char 要判断的字符
 * @param {Number} fontSize 初始大小，以中文字大小为准
 */
function getCharSize (char, fontSize) {
  return zhcnCode(char) ? fontSize : AZCode(char) ? fontSize * 0.8 : fontSize * 0.6
}

const lineHeight = 30
let fontSize = 18

// 取整
const lineMax = Math.round((ScreenHeight - 70) / lineHeight)

const lineWidth = ScreenWidth - 18
const textStyles = {
  fontSize, lineHeight
}
const textFirstStyles = {
  fontSize, lineHeight, paddingLeft: fontSize * 2
}

/**
 *  字符串换行处理
 * @param {string} str 要拆分的字符串
 * @param {string} prefix key的数据的前缀
 */
function lineFeed (str: string, keyPrefix: string) {
  let result = []
  let chars = str.split('')
  let linefeed = 0
  // 第一次转换需要进行首航缩进
  let lineEnd = lineWidth - (fontSize * 2)
  if (!str && str === '') return result
  let start = 0
  let size = 0
  for (let i = 0, length = chars.length; i < length; i++) {
    size = getCharSize(chars[i], fontSize)
    if ((linefeed + size) >= lineEnd) {
      // i--
      if (result.length === 0) {
        result.push({
          key: keyPrefix + '_' + i,
          style: textFirstStyles,
          children: chars.slice(start, i).join('')
        })
        lineEnd = lineWidth
      } else {
        result.push({
          key: keyPrefix + '_' + i,
          style: textStyles,
          children: chars.slice(start, i).join('')
        })
      }
      start = i
      linefeed = size
    } else {
      linefeed += size
    }
  }
  result.push({
    key: keyPrefix + '_',
    style: result.length === 0 ? textFirstStyles : textStyles,
    children: chars.slice(start).join('')
  })
  return result
}

@observer
class Pager extends React.Component {
  constructor (props) {
    super(props)
    this.init()
  }

  @observable
  pagers = []

  @observable
  content = ''

  @observable
  lines = []

  @observable
  pageIndex = 1

  @observable
  total = 0

  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

  @computed get dataSource () {
    return this.ds.cloneWithRows(this.pagers.slice())
  }

  @action
  init = () => {
    const $body = cheerio.load(textcontent)
    let content = $body('#content').text()
    content = content.replace(/\r\n/g, '')
    content = content.replace(/\n/g, '')
    let contentArray = content.split('    ')
    let lines = []
    for (let i = 0; i < contentArray.length; i++) {
      lines = lines.concat(lineFeed(contentArray[i], 'row_' + i))
    }
    // this.lines.replace(lines)
    let pagers = []
    const total = Math.ceil(lines.length / lineMax)
    for (var i = 0; i < total; i++) {
      pagers.push({ key: 'page' + i, context: lines.slice(lineMax * i, lineMax * (i + 1)) })
    }
    // const _lines = lines.map(item => item.children)
    // console.warn(JSON.stringify(_lines))
    this.pagers.replace(pagers)
  }

  _renderItem = (item) => {
    return (
      <View style={styles.context}>
        {item.context.map(context => (<Text {...context} />))}
      </View>
    )
  }

  handleChangeVisibleRows=(visibleRows, changedRows) => {
    console.warn('handleChangeVisibleRows', JSON.stringify(changedRows))
  }

  render () {
    return (
      <View style={styles.container}>
        <ListView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          dataSource={this.dataSource}
          renderRow={this._renderItem}
          pageSize={1}
          onChangeVisibleRows={this.handleChangeVisibleRows}
        />
      </View>
    )
  }
}

class PagerItem extends PureComponent {
  render () {
    const { context } = this.props.context
    return (
      <View style={styles.context}>
        {context.map(props => (<Text {...props} />))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, width: '100%', height: '100%'
  },
  header: {
    paddingTop: 8, paddingLeft: 17, height: 30
  },
  footer: {
    paddingRight: 18, height: 30
  },
  context: {
    paddingLeft: 17, width: ScreenWidth, flex: 1
  }
})

export default Pager
