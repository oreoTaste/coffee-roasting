import axios from "axios";
import cheerio from "cheerio";
import save from "./handleFile.js";
import inspectTitle from "./util.js";

const STORENAME = 'COFFEESPELL'

async function getItemList(section, url) {
    let itemList = []
    let soup = await axios.get(url)
    let $ = cheerio.load(soup.data)

    for(let article of $('li.-qHwcFXhj0')) {
        let item = new Map()
        item.set('section', section)
        item.set('img', $(article).find('img._25CKxIKjAk').attr('src'))
        let prodName = $(article).find('strong.QNNliuiAk3').text().replace(',', ' ').replace('_', ' ').replace('(', ' ').replace(')', ' ').replace('[', ' ').replace(']', ' ')
        item.set('product name', prodName)
        item.set('price', parseInt($(article).find('span.nIAdxeTzhx').text().replace(',', '')))

        let [review, grade] = [0, 0]
        let body = $(article).find('em._1dH1kEDaAZ')
        if(body.length == 2) {
            [review, grade] = $(body).map((i, el) => $(el).text()).toArray()
        } else if(body.length == 1) {
            if($(article).find('span._1ah-_dNSCu').text() == '리뷰') {
                review = $(body).text()
            } else {
                grade = $(body).text()
            }
        }
        item.set('review', review)
        item.set('grade', grade)

        item.set('canBuy', $(article).find('span._3Btky8fCyp').length > 0 ? "N" : "Y")
        item.set('detail', ($(article).find('p.vChbm1yu9U').text() || '').replace(',', ' '))
        item.set('extra', inspectTitle(prodName))
        itemList.push(item)
    }
    return itemList
}

async function getPageList(url) {
    let soup = await axios.get(url)
    let $ = cheerio.load(soup.data)
    
    let re = new RegExp(/[^0-9]/g)
    let maxPage = $('div._1HJarNZHiI._2UJrM31-Ry')
                        .children('a')
                        .map((i, el) => re.test($(el).text()) ? null : parseInt($(el).text()))
                        .toArray()
                        .sort((a,b) => b-a)[0]

    return Array.from(Array(maxPage), (_,i) => url + "?cp=" + (i+1))                    
}

async function init() {
    let obj = new Map()
    obj.set("storename", STORENAME)
    let now = new Date();
    obj.set("today", now.getFullYear() + "." + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1) + "." + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()))
    obj.set("url", 'https://smartstore.naver.com/coffeespell')

    let 생두pages = await getPageList('https://smartstore.naver.com/coffeespell/category/661f22e827554c198b452d437c66dc5e')
    for(let page of 생두pages) {
        save(obj, await getItemList('생두', page))
    }

    let 원두pages = await getPageList('https://smartstore.naver.com/coffeespell/category/ff37e49dadcc4f17b1148766d247b2bb')
    for(let page of 원두pages) {
        save(obj, await getItemList('원두', page))
    }

}

init();
