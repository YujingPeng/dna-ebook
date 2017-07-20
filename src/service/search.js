import urlencode from 'urlencode'
import db from '../database'
import {
  load, generateSearchModel
} from './utils'
/**
 * 根据关键字和站点查询
 * @param {String} name 关键字
 * @param {String} site 站点的名字
 */
export async function search (keyword, site) {
  try {
    let href = ''
    if (site.indexOf('http://zhannei.baidu.com') < 0) {
      href = site + urlencode(keyword, 'gbk')
    } else {
      href = site + keyword
    }
    const $body = await load(href)
    let result = generateSearchModel($body, site)

    return result
  } catch (error) {
    console.warn(error)
    return []
  }
}

/**
 * 保存查询关键字
 * @param {string} keyword 关键字
 */
export function cachedSearchKeyword (keyword) {
  db.write(() => {
    const history = db.objectForPrimaryKey('SearchHistory', keyword)
    if (history) {
      history.updateAt = new Date()
      history.times = history.times + 1
    } else {
      db.create('SearchHistory', { keyword })
    }
  })
}

export async function getSearchHistory () {
  return db.objects('SearchHistory').filtered(`isDeleted = false`).sorted('updateAt', true).slice(0, 10)
}
