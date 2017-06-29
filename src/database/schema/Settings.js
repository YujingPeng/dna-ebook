export default {
  name: 'Settings',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    // 亮度
    brightness: {type: 'int', default: 1},
    // 字体大小
    fontSize: {type: 'int', default: 20},
    // 字体
    fontFamily: {type: 'string', default: ''},
    // 行高
    lineHight: {type: 'int', default: 1.5},
    // 字体颜色灰度
    grayScale: {type: 'int', default: 1},
    // 夜间模式
    nightMode: {type: 'bool', default: false},
    // 自动主题
    autoChangeMode: {type: 'bool', default: true},
    // 当前书源
    sourceName: {type: 'string', default: ''}
  }
}
