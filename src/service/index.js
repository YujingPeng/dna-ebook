import cheerio from 'cheerio-without-node-native'
import uuid from 'react-native-uuid'
import { TextDecoder } from 'text-encoding'
import axios from 'axios'
import database from '../database'

async function fetch (uri) {
  try {
    return await axios.get(uri)
  } catch (error) {
    throw error
  }
}

async function jquery (uri) {
  try {
    const res = await axios.get(uri)
    return cheerio.load(res.data)
  } catch (error) {
    throw error
  }
}

export async function newBook (id, uri) {
  console.log('爬取页面', uri)
  const $ = await jquery(uri)
  let data = translator($) || {}
  data.id = id
  data.uri = uri
  data.chapterList = translatorChapterMenu($) || []
  // 详细页面点击收藏再保存到缓存
  return data
}

export function saveBook (model) {
  const {chapterList, discover, ...book} = model
  database.write(() => {
    database.create('Book', book)
    database.create('DisCover', discover)
  })
}

export async function getBookList (params) {

}

const rules = {
  'biquge': {
    host: 'http://www.biquge.com',
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
    searchThumbImage: '/files/article/image',
    chapterMenu: '#list > dl > dd > a',
    content: '#content'
  },
  'biqudu': {
    host: 'http://www.biqudu.com',
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
    searchThumbImage: '/files/article/image',
    chapterMenu: '#list > dl > dd > a',
    content: '#content'
  }
}

function translator ($) {
  const self = {}
  const { info, thumbImage, host } = rules.biquge
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

function translatorChapterMenu ($) {
  const { host } = rules.biquge
  let list = []
  $('#list>dl>dd>a').each((i, item) => {
    const $elem = $(item)
    let uri = host + $elem.attr('href')
    let text = $elem.text()
    const index = list.findIndex(item => item.uri === uri)
    if (!!text && !!uri && index < 0) {
      list.push({
        id: Date.now(), uri, text
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
function getSearchThumbUri (host, bookUri) {
  const rule = rules[host]
  let params = bookUri.split('/')
  let bookHostId = params[params.length - 2]
  let bookParams = bookHostId.split('_')
  let uri = `${rule.host}${rule.searchThumbImage}/${parseInt(bookParams[0]) + 1}/${bookParams[1]}/${bookParams[1]}.jpg`
  return uri
}
