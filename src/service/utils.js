import axios from 'axios'
import cheerio from 'cheerio-without-node-native'
import uuid from 'react-native-uuid'
import { TextDecoder } from 'text-encoding'
import { rules } from '../env'

axios.defaults.responseType = 'arraybuffer'
axios.defaults.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50'
/** 处理网络请求的相应错误 */
axios.interceptors.response.use(function (response) {
  // Do something with response data
  const rule = matchRule(response.config.url) || {}
  const encode = rule.encode || 'utf-8'
  const buffer = response.data
  const decode = new TextDecoder(encode)
  const resHtml = decode.decode(buffer)
  response.data = resHtml
  return response
}, function (error) {
  // Do something with response error
  let message = error.message
  if (error.toString() === 'Error:Network Error') {
    message = '无可用的网络！'
  }
  return Promise.reject(new Error(message))
})

/** 拉取数据 */
export async function fetchData (uri) {
  try {
    return await axios.get(uri)
  } catch (error) {
    throw error
  }
}

/**
 * 加载页面内容
 * @param {String} uri 页面地址
 */
export async function load (url) {
  try {
    const res = await axios({url})
    return cheerio.load(res.data)
  } catch (error) {
    throw error
  }
}

/** 预览图片
 * @param {String} bookUri 书地址
 */
export function generateThumbUri (bookUri) {
  if (!bookUri) return ''
  const rule = matchRule(bookUri)
  if (rule) {
    let params = bookUri.split('/')
    let bookHostId = params[params.length - 1] === '' ? params[params.length - 2] : params[params.length - 1]
    let bookParams = bookHostId.split('_')
    let uri = rule.searchThumbImage(rule.host, bookParams[0], bookParams[1])
    return uri
  } else {
    return ''
  }
}

/**
 * 匹配规则
 * @param {String} uri 要匹配的地址
 */
export function matchRule (uri) {
  return Object.values(rules).find(item => uri.indexOf(item.host) >= 0)
}

// 转换详细
export function generateBookModel ($body, rule, uri) {
  const self = {}
  const { info, thumbImage, chapterMenuUri } = rule
  for (let [k, v] of Object.entries(info)) {
    if (v.pattern) {
      const text = $body(v.selector).text()
      self[k] = text.replace(v.pattern, '').trim()
    } else if (v.attr) {
      self[k] = $body(v.selector).attr(v.attr)
    } else {
      self[k] = $body(v).text().trim()
    }
  }

  self.chapterMenuUri = chapterMenuUri ? $body(chapterMenuUri).attr('href') : uri
  let thumbImageUri = $body(thumbImage).attr('src')
  if (!thumbImageUri) {
    self.thumbImage = generateThumbUri(uri)
  } else {
    self.thumbImage = `$body{host}$body{thumbImageUri}`
  }

  return self
}

// 转换目录
export function generateChapters ($body, rule, bookId) {
  const { host, firstChapterIndex } = rule
  let list = []
  $body('#list>dl>dd>a').each((i, item) => {
    if (i >= firstChapterIndex) {
      const $bodyelem = $body(item)
      let uri = host + $bodyelem.attr('href')
      let text = $bodyelem.text()
      const index = list.findIndex(item => item.uri === uri)
      if (!!text && !!uri && index < 0) {
        list.push({
          id: uuid.v4(), uri, text, bookId, cached: false
        })
      }
    }
  })
  return list
}

/**
 * 生成查询列表模型
 * @param {Object} $body cheerio上下文
 */
export function otherGenerateSearchModel ($body) {
  try {
    const $name = $body.find('h3>a')
    const uri = $name.attr('href')
    return {
      id: uuid.v4(),
      name: $name.text().trim(),
      uri: uri,
      thumbImage: generateThumbUri(uri),
      author: $body.find('.result-game-item-info>p:nth-child(1)').text().replace('作者：', '').trim(),
      type: $body.find('.result-game-item-info>p:nth-child(2)').text().replace('类型：', '').trim(),
      updateAt: $body.find('.result-game-item-info>p:nth-child(3)').text().replace('更新时间：', '').trim(),
      latestChapter: $body.find('.result-game-item-info>p:nth-child(4)').text().replace('最新章节：', '').trim(),
      desc: $body.find('.result-game-item-desc').text()
    }
  } catch (error) {
    return null
  }
}

/**
 *
 * @param {*} params
 */
export function generateSearchModel ($body, site) {
  try {
    const rule = Object.values(rules).find(item => item.searchUri === site)
    const { searchItem, searchInfo } = rule
    let result = []
    const keys = Object.entries(searchInfo)
    $body(searchItem).each((i, item) => {
      const $item = $body(item)
      let self = { id: uuid.v4() }
      for (let [k, v] of keys) {
        if (v.pattern) {
          const text = $item.find(v.selector).text()
          self[k] = text.replace(v.pattern, '').trim()
        } else if (v.attr) {
          self[k] = $item.find(v.selector).attr(v.attr)
        } else {
          self[k] = $item.find(v).text().trim()
        }
      }
      result.push(self)
    })
    return result
  } catch (error) {
    return null
  }
}

/**
 * @deprecated 根据关键字和站点查询
 * @param {String} name 关键字
 * @param {String} site 站点的名字
 */
export async function search (name, site) {
  // http://zhannei.baidu.com/cse/search?q=&click=1&s=5334330359795686106&nsid=
  let uri = `http://zhannei.baidu.com/cse/site?q=${name}&cc=${site}&stp=1`
  const $ = await load(uri)
  let result = []
  $('#results>div.result').each((i, item) => {
    const $name = $(item).find('h3>a')
    const names = $name.text().split('_')
    const name = names[0].replace('最新章节', '')
    const uri = $name.attr('href')
    result.push({
      id: uuid.v4(),
      name,
      siteName: names[names.length - 1],
      uri: uri,
      thumbImage: generateThumbUri(uri)
    })
  })
  return result
}
