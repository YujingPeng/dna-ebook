export default {
  name: 'Settings',
  properties: {
    // 亮度
    brightness: {type: 'int', default: 1},
    // 字体大小
    fontSize: {type: 'int', default: 20},
    // 字体
    fontFamily: {type: 'int', default: 20},
    // 行高
    lineHight: 'int',
    // 字体颜色灰度
    grayScale: 'int',
    // 夜间模式
    nightMode: 'bool',
    // 自动主题
    autoChangeMode: 'bool'
  }
}
