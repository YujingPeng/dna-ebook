import { observable, action, computed } from 'mobx';
import html from './html';
import html2 from './html2';
import cheerio from 'cheerio-without-node-native';
import { tmpl } from '../../assets/html';

// https://www.baidu.com/s?q1=%E9%AD%94%E5%A4%A9%E8%AE%B0&q2=&q3=&q4=&rn=10&lm=0&ct=0&ft=&q5=&q6=biquge.com&tn=baidulocal

const rules = {
  'biquge': {
    host: 'http://www.biquge.com',
    url: 'http://www.biquge.com/43_43821',
    info: {
      name: '#info > h1',
      author: {
        selector: '#info > p:nth-child(2)',
        regex: '作    者：'
      },
      updateAt: {
        selector: '#info > p:nth-child(4)',
        regex: '最后更新：',
      },
      latestChapter: {
        selector: '#info > p:nth-child(5) > a',
        regex: '最新章节：'
      },
      desc: '#intro',
    },
    thumbImage: '#fmimg > img',
    chapterMenu: '#list > dl > dd > a',
    content: '#content'
  }
}

export default class BookService {
  static rules = rules;

  static fetchData = async (url) => {
    let origin = url;
    let headers = {
      'Proxy-Connection': 'keep-alive',
      // 'Cache-Control': 'max-age=0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      // 'Origin': origin,
      // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // 'Accept-Encoding': 'compress,gzip,deflate,sdch',
      'Accept-Language': 'zh-CN,zh;q=0.8',
      // 'Accept-Charset': 'GBK,utf-8;q=0.7,*;q=0.3'
    };
    const option = {
      method: 'GET',
      headers: headers
    };
    const res = await fetch(url, option);
    const resHtml = await res.text();
    // console.log(resHtml);
    return cheerio.load(resHtml);
  }
}
