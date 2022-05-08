import axios from "axios";
import cheerio from "cheerio";
import { findCanBuy, findIfLimited, findIfNew, findImg, findPrice, findProdName, inspectTitle, prodDetail, setHeader } from "./core.js";
import { save } from "./handleFile.js";

const findPagination = (article) => {
    return article('div.xans-product-normalpaging').find('ol')
}

async function getPageList (url) {
    let soup = await axios.get(url)
    let $ = cheerio.load(soup.data)

    let re = new RegExp(/[^0-9]/g)
    let maxPage = findPagination($)
                        .children('li')
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
        item.set('img', findImg($(article), '.thumb'))

        let prodName = findProdName($(article).find('p.name'), ['span:nth-child(2)'])
        item.set('product name', prodName)

        let detailBox = $(article).find('ul.xans-product')
        item.set('price', findPrice($(detailBox), ['li:nth-child(2) > span:nth-child(2)']))
    
        let [review, grade] = [0, 0]
        item.set('review', findIfNew($(article), 'div.status > div.icon > img[src$="icon_global_01.gif"]')
                         + " "
                         + findIfLimited($(article), 'div.status > div.icon > img[src$="icon_global_09.gif"]')) // new, limited, 품절 중 'new, limited만 표기'
        item.set('grade', grade)
    
        item.set('canBuy', findCanBuy($(article), 'div.status > div.icon > img[src$="soldout.gif"]'))
        item.set('detail', prodDetail($(detailBox), ['li:nth-child(3) > span']))
        item.set('extra', inspectTitle(prodName + " 1kg"))
        itemList.push(item)
    }

    return itemList
}

export async function managePages(keyword, section, url, obj) {
    for(let page of await getPageList(url)) {
        console.log(page)
        let itemList = await getItemList(section, page)
        save(keyword, page, obj, itemList)
    }
}

