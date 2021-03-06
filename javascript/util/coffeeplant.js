import cheerio from "cheerio";
import { axiosEncoded, findCanBuyAttr, findImgAttr, findPriceText, findProdNameText, findTagAttr, findUrlAttr, inspectTitle, setHeader } from "./core.js";
import { save } from "./handleFile.js";

const findPagination = (article) => {
    return article('form[name="frmList"] > table:last-child > tbody > tr:last-child td').children()
}

async function getPageList (url) {
    
    let $ = cheerio.load(await axiosEncoded(url))
    let maxPage = findPagination($)
                        .map((i, el) => parseInt($(el).text().replace(/\[/g, '').replace(/\[/g, '')))
                        .toArray()
                        .sort((a,b) => b-a)[0]
    return Array.from(Array(maxPage), (_,i) => url + "&page=" + (i+1))                    
}

export async function getItemListFromFourParts(section, url) {
    if(!url) {
        return setHeader()
    }

    let $ = cheerio.load(await axiosEncoded(url))
    let itemList = []

    for(let article of $('form[name="frmList"] > table:last-child > tbody > tr:nth-child(5) table > tbody')
                        .children('tr')
                        .children('td')
                        .toArray()) {
        let divLength = $(article).children('div').length
        let curLink = url.slice(0, url.lastIndexOf('/') + 1)
        let item = new Map()
        item.set('section', section)
        item.set('img', curLink + findImgAttr($(article).find('div:nth-of-type(1)'), ''))

        // buy_url
        item.set('buy_url', curLink + findUrlAttr($(article), 'div:nth-of-type(1) > a:nth-child(1)'))

        let prodName = findProdNameText($(article).find(`div:nth-of-type(${divLength > 4 ? 3 : 2})`), ['a'])
        item.set('product name', prodName)

        // let detailBox = $(article).find('ul.xans-product')
        item.set('price', findPriceText($(article), [`div:nth-of-type(${divLength > 4 ? 4 : 3})`]) || 0)
    
        let [review, grade] = [0, 0]
        item.set('review', findTagAttr($(article), `div:nth-of-type(${divLength > 4 ? 5 : 4})> img[src$="good_icon_new.gif"]`, 'New')
                         + " "
                         + findTagAttr($(article), `div:nth-of-type(${divLength > 4 ? 5 : 4})> img[src$="good_icon_sale.gif"]`, 'Sale')
                         + " "
                         + findTagAttr($(article), `div:nth-of-type(${divLength > 4 ? 5 : 4})> img[src$="good_icon_popular.gif"]`, 'Popular')
                         + " "
                         + findTagAttr($(article), `div:nth-of-type(${divLength > 4 ? 5 : 4})> img[src$="good_icon_recomm.gif"]`, 'Recommend')
                         + " "
                         + findTagAttr($(article), `div:nth-of-type(${divLength > 4 ? 5 : 4})> img[src$="good_icon_special.gif"]`, 'Special offer')) // new, limited, ?????? ??? 'new, limited??? ??????'
        item.set('grade', grade)

        item.set('canBuy', findCanBuyAttr($(article), `div:nth-of-type(${divLength > 4 ? 2 : 100})> img[src$="good_icon_soldout.gif"]`))
        item.set('detail', '')
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

export async function getItemListFromTwoParts(section, url) {
    if(!url) {
        return setHeader()
    }

    let $ = cheerio.load(await axiosEncoded(url))
    let itemList = []

    for(let article of $('form[name="frmList"] > table:last-child > tbody > tr:nth-child(5) table > tbody')
                        .children('tr')
                        .children('td')
                        .toArray()) {
        let divLength = $(article).children('div').length
        let curLink = url.slice(0, url.lastIndexOf('/') + 1)
        let item = new Map()
        item.set('section', section)
        item.set('img', curLink + findImgAttr($(article).find('div:nth-of-type(1)'), ''))
        // buy_url
        item.set('buy_url', curLink + findUrlAttr($(article), 'div:nth-of-type(1) > a:nth-child(1)'))

        let detailBox = $(article).find('div:nth-of-type(2)')
        let prodName = findProdNameText($(detailBox).find(`div:nth-of-type(1)`), ['a'])
        item.set('product name', prodName)
        item.set('price', findPriceText($(detailBox), [`div:nth-of-type(2)`]) || 0)
    
        let [review, grade] = [0, 0]
        item.set('review', findTagAttr($(detailBox), `div img[src$="good_icon_new.gif"]`, 'New')
                         + " "
                         + findTagAttr($(detailBox), `div img[src$="good_icon_sale.gif"]`, 'Sale')
                         + " "
                         + findTagAttr($(detailBox), `div img[src$="good_icon_popular.gif"]`, 'Popular')
                         + " "
                         + findTagAttr($(detailBox), `div img[src$="good_icon_recomm.gif"]`, 'Recommend')
                         + " "
                         + findTagAttr($(detailBox), `div img[src$="good_icon_special.gif"]`, 'Special offer')) // new, limited, ?????? ??? 'new, limited??? ??????'
        item.set('grade', grade)

        item.set('canBuy', findCanBuyAttr($(detailBox), `div > img[src$="good_icon_soldout.gif"]`))
        item.set('detail', '')
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

export async function managePages(keyword, section, url, obj) {
    for(let page of await getPageList(url)) {
        console.log(`>> javascript.util.coffeeplant function managePages : ${page} ??????`)
        let itemList = []

        if(['????????????'].includes(keyword)) { // ??????????????? ?????? ????????? ??????
            itemList = await getItemListFromTwoParts(section, page)
        } else {
            itemList = await getItemListFromFourParts(section, page)
        }

        await save(keyword, page, obj, itemList)
        console.log(`${url} ??? ${page} ???`)    
    }
}

