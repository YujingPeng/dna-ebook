import { observable, action } from 'mobx';
import html from './html';
import html2 from './html2';
import cheerio from 'cheerio-without-node-native';

const rules = {
    'biquge': {
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
        content: '#content'
    }
}

export class BookModel {


    @observable
    name = '';

    @observable
    desc = '';

    @observable
    author = ''

    @observable
    updateAt = ''

    @observable
    latestChapter = ''

    @observable
    thumbImage = ''

    @action
    async get() {
        const $ = await BookService.fetchData('http://www.biquge.com/43_43821/');
        this.translator($);
        // console.log(this);
    }


    translator($) {
        const self = this;
        const {info, thumbImage} = rules.biquge;
        for (let [k, v] of Object.entries(info)) {
            if (v.regex) {
                const text = $(v.selector).text();
                self[k] = text.replace(v.regex, '');
            }
            else {
                self[k] = $(v).text();
            }
        }
        this.thumbImage = `http://www.biquge.com${$(thumbImage).attr('src')}`;
        console.log(this.thumbImage);
    }
}

export class ChapterModel {
    @observable
    name = '屠海龙'

    @observable
    numbers = '第二百一十四章'

    @observable
    content = ''

    uri = 'http://www.biquge.com/43_43821/2663276.html'

    async get() {
        // const $ = await BookService.fetchData(this.uri);
        const $ = cheerio.load(html2);
        const rule = rules.biquge;
        this.content = $(rule.content).html();
    }

}

class BookService {
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
        // const res = await fetch(url, option);
        // const resHtml = await res.text();
        // console.log(resHtml);
        return cheerio.load(html);
    }
}