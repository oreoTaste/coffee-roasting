import axios from "axios";
import cheerio from "cheerio";
import { findCanBuyAttr, findImgAttr, findPriceText, findProdNameText, findUrlAttr, inspectTitle, prodDetailText, reviewBody, reviewText, setHeader } from "./core.js";
import { save } from "./handleFile.js";

export const findNaverPagination = (article) => {
    return article('div._1HJarNZHiI._2UJrM31-Ry')
}

export async function getNaverItemList(section, url) {
    let itemList = []
    if(!url) {
        return setHeader()
    }

    let soup = await axios.get(url)
    let $ = cheerio.load(soup.data)

    for(let article of $('div#CategoryProducts > ul > li')) {
        let item = new Map()
        item.set('section', section)
        item.set('img', findImgAttr($(article), '._25CKxIKjAk', 'src'))
        // buy_url
        item.set('buy_url', findUrlAttr($(article), 'a.linkAnchor', url))

        let prodName = findProdNameText($(article), ['strong.QNNliuiAk3', 'strong._1Zvjahn0GA'])
        item.set('product name', prodName)
        item.set('price', findPriceText($(article), ['div._23DThs7PLJ strong span.nIAdxeTzhx', 'span._3_9J443eIx']))

        let [review, grade] = [0, 0]
        let body = reviewBody($(article), ['em._1dH1kEDaAZ', 'em.Q0Wp1oqBAs'])
        if(body.length == 2) {
            [review, grade] = $(body).map((i, el) => $(el).text()).toArray()
        } else if(body.length == 1) {
            if(reviewText($(article), ['span._1ah-_dNSCu']) == '리뷰') {
                review = $(body).text()
            } else {
                grade = $(body).text()
            }
        }
        item.set('review', review)
        item.set('grade', grade)

        item.set('canBuy', findCanBuyAttr($(article), 'span._3Btky8fCyp'))
        item.set('detail', prodDetailText($(article), ['p.vChbm1yu9U', 'p._1jGpq7xfIB']))
        item.set('extra', inspectTitle(prodName))
        let p = parseInt(item.get('price') || 0)
        let w = item.get('extra').get('weight')
        // pricePerCup(20g)
        if(p == 0 || w == 0) {
            item.get('extra').set('pricePerCup(20g)', 0)
        } else {
            item.get('extra').set('pricePerCup(20g)', p / w * 20)
        }        
        itemList.push(item)
    }
    return itemList
}

export async function getNaverPageList(url, obj) {
    let soup = await axios.get(url)
    let $ = cheerio.load(soup.data)

    let re = new RegExp(/[^0-9]/g)
    let maxPage = findNaverPagination($)
                        .children('a')
                        .map((i, el) => re.test($(el).text()) ? null : parseInt($(el).text()))
                        .toArray()
                        .sort((a,b) => b-a)[0]

    let answer = Array.from(Array(maxPage), (_,i) => url + "?cp=" + (i+1))
    if(['KBX'].includes(obj.get('storename'))) {
        answer = Array.from(Array(maxPage), (_,i) => url + "&page=" + (i+1))
    }
    return answer
}

export async function manageNaverPages(keyword, section, url, obj) {
    for(let page of await getNaverPageList(url, obj)) {
        let itemList = await getNaverItemList(section, page)
        await save(keyword, page, obj, itemList).then((_) => {
            console.log(`${url} 중 ${page} 끝`)
        })
    }
}