import axios from "axios";
import cheerio from "cheerio";
import { inspectTitle, setHeader } from "./core.js";
import { save } from "./handleFile.js";

export const findNaverPagination = (article) => {
    return article('div._1HJarNZHiI._2UJrM31-Ry')
}
export const findImg = (article) => {
    return article.find('img._25CKxIKjAk').attr('src')
}
export const findProdName = (article) => {
    let prodName = article.find('strong.QNNliuiAk3').text() + "" + article.find('strong._1Zvjahn0GA').text()
    return prodName.replace(/,/g, '').replace(/_/g, ' ').replace(/\(/g, ' ').replace(/\)/g, ' ').replace(/\[/g, ' ').replace(/\]/g, ' ')
}

export const findPrice = (article) => {
    let price = article.find('div._23DThs7PLJ').find('strong').find('span.nIAdxeTzhx').text() + "" + article.find('span._3_9J443eIx').text()
    return price.replace(/,/g, '')
}

export const reviewHead = (article) => {
    return article.find('span._1ah-_dNSCu').text()
}
export const reviewBody = (article) => {
    return [...article.find('em._1dH1kEDaAZ'), ...article.find('em.Q0Wp1oqBAs')]
}
export const prodDetail = (article) => {
    return article.find('p.vChbm1yu9U').text().replace(/,/g, '') + '' + article.find('p._1jGpq7xfIB').text().replace(/,/g, '')
}
export const findCanBuy = (article) => {
    return article.find('span._3Btky8fCyp')
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
        item.set('img', findImg($(article)))
        let prodName = findProdName($(article))
        item.set('product name', prodName)
        item.set('price', findPrice($(article)))

        let [review, grade] = [0, 0]
        let body = reviewBody($(article))
        if(body.length == 2) {
            [review, grade] = $(body).map((i, el) => $(el).text()).toArray()
        } else if(body.length == 1) {
            if(reviewHead($(article)) == '리뷰') {
                review = $(body).text()
            } else {
                grade = $(body).text()
            }
        }
        item.set('review', review)
        item.set('grade', grade)

        item.set('canBuy', findCanBuy($(article)).length > 0 ? "N" : "Y")
        item.set('detail', (prodDetail($(article)) || '').replace(',', ' '))
        item.set('extra', inspectTitle(prodName))
        itemList.push(item)
    }
    return itemList
}

export async function getNaverPageList(url) {
    let soup = await axios.get(url)
    let $ = cheerio.load(soup.data)

    let re = new RegExp(/[^0-9]/g)
    let maxPage = findNaverPagination($)
                        .children('a')
                        .map((i, el) => re.test($(el).text()) ? null : parseInt($(el).text()))
                        .toArray()
                        .sort((a,b) => b-a)[0]

    return Array.from(Array(maxPage), (_,i) => url + "?cp=" + (i+1))                    
}

export async function manageNaverPages(keyword, section, url, obj) {
    for(let page of await getNaverPageList(url)) {
        let itemList = await getNaverItemList(section, page)
        save(keyword, page, obj, itemList)
    }
}