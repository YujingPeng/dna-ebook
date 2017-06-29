import { action, observable, runInAction, extendObservable } from 'mobx'
import { getSettings, saveSettings, getSearchHistory } from '../service'
import { rules } from '../env'

class SettingStore {
  constructor () {
    let host = []
    for (var key in rules) {
      if (rules.hasOwnProperty(key)) {
        host.push({
          label: rules[key].name,
          value: rules[key].searchUri
        })
      }
    }
    this.sourceName = host[0].value
    this.sites = host
    this.init()
  }

  id = 'settingId'

  @observable
  sites = []

  /** 亮度 */
  @observable
  brightness = 1
  /** 字体大小 */
  @observable
  fontSize = 20
  /** 字体 */
  @observable
  fontFamily = ''
  /** 行高 */
  @observable
  lineHight = 30
  /** 字体颜色灰度 */
  @observable
  grayScale = 1
  /** 夜间模式 */
  @observable
  nightMode = false
  /** 自动主题 */
  @observable
  autoChangeMode = true
  /** 当前书源 */
  @observable
  sourceName = ''

  /** 搜索历史 */
  @observable
   searchHistory = []

  @action
   async init () {
    const settings = await getSettings()
    const search = await getSearchHistory() || []
    runInAction(() => {
      extendObservable(this, settings)
      this.searchHistory.replace(search)
    })
  }

  @action
   cacheSearchHistory (keyword) {
    const index = this.searchHistory.findIndex(item => keyword === item.keyword)
    if (index >= 0) {
      this.searchHistory.splice(index, 1)
    }
    this.searchHistory.unshift({ keyword })
  }

  /** 保存设置 */
  @action
   async saveSetting (setting) {
    extendObservable(this, setting)
    setting.id = this.id
    saveSettings(setting)
  }
}

const settingStore = new SettingStore()

export default settingStore
