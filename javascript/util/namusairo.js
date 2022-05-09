import axios from "axios";
import cheerio from "cheerio";
import { findCanBuyAttr, findIfLimitedAttr, findIfNewAttr, findImgAttr, findPriceText, findProdNameText, findUrlAttr, inspectTitle, prodDetailText, setHeader } from "./core.js";
import { save } from "./handleFile.js";

const findPagination = (article) => {
    return article('div.xans-product-normalpaging ol li')
}

async function getPageList (url) {
    let soup = await axios.get(url)
    let $ = cheerio.load(soup.data)

    let re = new RegExp(/[^0-9]/g)
    let maxPage = findPagination($)
                        .map((i, el) => re.test($(el).text()) ? null : parseInt($(el).text()))
                        .toArray()
                        .sort((a,b) => b-a)[0]

    return Array.from(Array(maxPage), (_,i) => url + "&page=" + (i+1))                    
}

export async function getItemList(section, url) {
    if(!url) {
        return setHeader()
    }

    let soup = await axios.get(url)
    let $ = cheerio.load(soup.data)
    let itemList = []

    for(let article of $('ul.prdList').children('li')) {
        let item = new Map()
        item.set('section', section)
        item.set('img', findImgAttr($(article), '.thumb'))

        // buy_url
        item.set('buy_url', url.slice(0, url.replace('//', '__').indexOf('/')) + findUrlAttr($(article), 'div.box > a:nth-child(2)'))

        let prodName = findProdNameText($(article).find('p.name'), ['span:nth-child(2)'])
        item.set('product name', prodName)

        let detailBox = $(article).find('ul.xans-product')
        item.set('price', findPriceText($(detailBox), ['li:nth-child(2) > span:nth-child(2)']) || 0)
    
        let [review, grade] = [0, 0]
        item.set('review', findIfNewAttr($(article), 'div.status > div.icon > img[src$="icon_global_01.gif"]')
                         + " "
                         + findIfLimitedAttr($(article), 'div.status > div.icon > img[src$="icon_global_09.gif"]')) // new, limited, 품절 중 'new, limited만 표기'
        item.set('grade', grade)
    
        item.set('canBuy', findCanBuyAttr($(article), 'div.status > div.icon > img[src$="soldout.gif"]'))
        item.set('detail', prodDetailText($(detailBox), ['li:nth-child(3) > span']))
        item.set('extra', inspectTitle(prodName + " 1kg"))
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

export async function managePages(keyword, section, url, obj) {
    for(let page of await getPageList(url)) {
        console.log(`>> javascript.util.namusairo function managePages : ${page} 시작`)
        let itemList = await getItemList(section, page)
        await save(keyword, page, obj, itemList)
        console.log(`${url} 중 ${page} 끝`)
    }
}

