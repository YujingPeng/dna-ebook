import cheerio from 'cheerio-without-node-native'
import uuid from 'react-native-uuid'
import { TextDecoder } from 'text-encoding'
import axios from 'axios'
import db from '../database'

const config = {
  headers: {
    'User-Agent:': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50'
  },
  responseType: 'arraybuffer'
}

async function fetchData (uri) {
  try {
    return await axios.get(uri)
  } catch (error) {
    throw error
  }
}

async function load (uri) {
  try {
    const rule = matchHost(uri) || {}
    const encode = rule.encode || 'utf-8'
    const res = await axios({ ...config, url: uri })
    const buffer = res.data
    const decode = new TextDecoder(encode)
    const resHtml = decode.decode(buffer)
    return cheerio.load(resHtml)
  } catch (error) {
    throw error
  }
}
export async function search (name, site) {
  let uri = `http://zhannei.baidu.com/cse/site?q=${name}&cc=${site}&stp=1`
  const $ = await load(uri)
  let result = []
  $('#results>div.result').each((i, item) => {
    const $name = $(item).find('h3>a')
    const uri = $name.attr('href')
    result.push({
      id: uuid.v4(),
      name: $name.text(),
      uri: uri,
      thumbImage: getSearchThumbUri(site, uri)
    })
  })
  return result
}

export async function newBook (id, uri) {
  // console.warn('爬取页面', uri)
  const rule = matchHost(uri)
  // console.warn('爬取页面', rule)
  if (!rule) return null
  const $ = await load(uri)
  let data = translator(rule, $) || {}
  data.id = id
  data.uri = uri
  data.chapterList = translatorChapterMenu(rule, $, data.id) || []
  // 详细页面点击收藏再保存到缓存
  return data
}

export function saveBook (model) {
  const { ...book } = model

  db.write(() => {
    db.create('Book', book)
  })
}

export async function getBookList (params) {
  return db.objects('Book')
}

const rules = {
  'baidu.com': {
    host: 'http://zhannei.baidu.com',
    encode: 'utf-8'
  },
  'biquge.com': {
    host: 'http://www.biquge.com',
    encode: 'utf-8',
    info: {
      name: '#info > h1',
      author: {
        selector: '#info > p:nth-child(2)',
        pattern: '作    者：'
      },
      updateAt: {
        selector: '#info > p:nth-child(4)',
        pattern: '最后更新：'
      },
      latestChapter: {
        selector: '#info > p:nth-child(5) > a',
        pattern: '最新章节：'
      },
      desc: '#intro'
    },
    thumbImage: '#fmimg > img',
    searchThumbImage: (host, parm1, parm2) => `${host}/files/article/image/${parm1}/${parm2}/${parm2}.jpg`,
    chapterMenu: '#list > dl > dd > a',
    content: '#content'
  },
  'biqudu.com': {
    host: 'http://www.biqudu.com',
    encode: 'utf-8',
    info: {
      name: '#info > h1',
      author: {
        selector: '#info > p:nth-child(2)',
        pattern: '作    者：'
      },
      updateAt: {
        selector: '#info > p:nth-child(4)',
        pattern: '最后更新：'
      },
      latestChapter: {
        selector: '#info > p:nth-child(5) > a',
        pattern: '最新章节：'
      },
      desc: '#intro'
    },
    thumbImage: '#fmimg > img',
    searchThumbImage: (host, parm1, parm2) => `${host}/files/article/image/${parm1}/${parm2}/${parm2}.jpg`,
    chapterMenu: '#list > dl > dd > a',
    content: '#content'
  },
  'booktxt.net': {
    host: 'http://www.booktxt.net',
    encode: 'gbk',
    info: {
      name: '#info > h1',
      author: {
        selector: '#info > p:nth-child(2)',
        pattern: '作    者：'
      },
      updateAt: {
        selector: '#info > p:nth-child(4)',
        pattern: '最后更新：'
      },
      latestChapter: {
        selector: '#info > p:nth-child(5) > a',
        pattern: '最新章节：'
      },
      desc: '#intro'
    },
    thumbImage: '#fmimg > img',
    searchThumbImage: (host, parm1, parm2) => `${host}/files/article/image/${parm1}/${parm2}/${parm2}s.jpg`,
    chapterMenu: '#list > dl > dd > a',
    content: '#content'
  }
}

function matchHost (uri) {
  return Object.values(rules).find(item => uri.indexOf(item.host) >= 0)
}

function translator (rule, $) {
  const self = {}
  const { info, thumbImage, host } = rule
  for (let [k, v] of Object.entries(info)) {
    if (v.pattern) {
      const text = $(v.selector).text()
      self[k] = text.replace(v.pattern, '')
    } else {
      self[k] = $(v).text()
    }
  }
  self.thumbImage = `${host}${$(thumbImage).attr('src')}`
  return self
}

function translatorChapterMenu (rule, $, bookId) {
  const { host } = rule
  let list = []
  $('#list>dl>dd>a').each((i, item) => {
    const $elem = $(item)
    let uri = host + $elem.attr('href')
    let text = $elem.text()
    const index = list.findIndex(item => item.uri === uri)
    if (!!text && !!uri && index < 0) {
      list.push({
        id: uuid.v4(), uri, text, bookId
      })
    }
  })

  const len = list.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (list[i].uri < list[j].uri) {
        let temp = list[i]
        list[i] = list[j]
        list[j] = temp
      }
    }
  }

  return list
}

/** 获取搜索列表预览图片 */
function getSearchThumbUri (site, bookUri) {
  const rule = rules[site]
  if (!bookUri) return ''
  let params = bookUri.split('/')
  let bookHostId = params[params.length - 2]
  let bookParams = bookHostId.split('_')
  // let uri = `${rule.host}${rule.searchThumbImage}/${parseInt(bookParams[0]) + 1}/${bookParams[1]}/${bookParams[1]}.jpg`
  let uri = rule.searchThumbImage(rule.host, (parseInt(bookParams[0]) + 1), bookParams[1])
  return uri
}
