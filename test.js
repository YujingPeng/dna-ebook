// const TextDecoder = require('text-encoding')
// const axios = require('axios')
// const cheerio = require('cheerio-without-node-native')

// async function test (params) {
//   const site = 'http://zhannei.baidu.com/cse/search?s=5334330359795686106&q=魔'
//   try {
//     const config = {
//       responseType: 'arraybuffer',
//       url: site
//     }
//     const encode = 'gbk'
//     const res = await axios(config)
//     const buffer = res.data
//     const decode = new TextDecoder.TextDecoder(encode)
//     const resHtml = decode.decode(buffer)
//     const $body = cheerio.load(resHtml)
//     const searchItem = '#results div.result-item'
//     const searchInfo = {
//       name: 'h3>a',
//       uri: {
//         selector: 'h3>a',
//         attr: 'href'
//       },
//       thumbImage: {
//         selector: 'img',
//         attr: 'src'
//       },
//       author: {
//         selector: '.result-game-item-info>p:nth-child(1)',
//         pattern: '作者：'
//       },
//       type: {
//         selector: '.result-game-item-info>p:nth-child(2)',
//         pattern: '类型：'
//       },
//       updateAt: {
//         selector: '.result-game-item-info>p:nth-child(3)',
//         pattern: '更新时间：'
//       },
//       latestChapter: {
//         selector: '.result-game-item-info>p:nth-child(4)',
//         pattern: '最新章节：'
//       },
//       desc: '.result-game-item-info>p:nth-child(4)'
//     }
//     let result = []
//     console.log($body(searchItem).length)
//     const keys = Object.entries(searchInfo)
//     $body(searchItem).each((index, item) => {
//       if (index <= 1) {
//         const $item = $body(item)
//         let self = {}
//         for (let [k, v] of keys) {
//           if (v.pattern) {
//             const text = $item.find(v.selector).text()
//             self[k] = text.replace(v.pattern, '')
//           } else if (v.attr) {
//             self[k] = $item.find(v.selector).attr(v.attr)
//           } else {
//             self[k] = $item.find(v).text()
//           }
//           result.push(self)
//         // let self = {
//         //   name: $item.find('h3>a').text(),
//         //   uri: $item.find('h3>a').attr('href'),
//         //   thumbImage: $item.find('img').attr('src'),
//         //   author: $item.find('p:nth-child(3)>i:nth-child(1)').text(),
//         //   type: '',
//         //   updateAt: $item.find('p:nth-child(4)>i:nth-child(2)').text(),
//         //   latestChapter: $item.find('p:nth-child(4)>a').text(),
//         //   desc: $item.find('p:nth-child(5)').text()
//         // }
//         // console.dir(self)
//         }
//       }
//     })
//     console.dir(result)
//   } catch (error) {
//     throw error
//   }
// }

// test()
// %CD%F2%B9%C5

// var urlencode = require('urlencode')
// console.log(urlencode('万古')) // default is utf8
// console.log(urlencode('万古', 'gbk')) // '%CB%D5%C7%A7'
