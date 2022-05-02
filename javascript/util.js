import axios from "axios";
import cheerio from "cheerio";
import { save } from "./handleFile.js";

export async function managePages(keyword, section, url, obj) {
    for(let page of await getPageList(url)) {
        let itemList = await getItemList(section, page)
        save(keyword, page, obj, itemList)
    }
}

export async function getPageList(url) {
    let soup = await axios.get(url)
    let $ = cheerio.load(soup.data)

    let re = new RegExp(/[^0-9]/g)
    let maxPage = findPagination($)
                        .children('a')
                        .map((i, el) => re.test($(el).text()) ? null : parseInt($(el).text()))
                        .toArray()
                        .sort((a,b) => b-a)[0]

    return Array.from(Array(maxPage), (_,i) => url + "?cp=" + (i+1))                    
}

export async function getItemList(section, url) {
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

export const setHeader = () => {
    let item = new Map()
    item.set('section', '')
    item.set('img', '')
    item.set('product name', '')
    item.set('price', '')
    item.set('review', '')
    item.set('grade', '')
    item.set('canBuy', '')
    item.set('detail', '')
    
    let obj = new Map()
    obj.set('country', '')
    obj.set('region', '')
    obj.set('process', '')
    obj.set('grade', '')
    obj.set('weight', '')
    item.set('extra', obj)        
    return [item]
}

export const findPagination = (article) => {
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
    console.log(article.find('em.Q0Wp1oqBAs'))
    return [...article.find('em._1dH1kEDaAZ'), ...article.find('em.Q0Wp1oqBAs')]
}
export const prodDetail = (article) => {
    return article.find('p.vChbm1yu9U').text().replace(/,/g, '') + '' + article.find('p._1jGpq7xfIB').text().replace(/,/g, '')
}
export const findCanBuy = (article) => {
    return article.find('span._3Btky8fCyp')
}

const checkWeight = (list, titleList) => {
    for(let titleLet of titleList) {
        titleLet = titleLet.toLowerCase()
        for(let item of list) {
            if(titleLet.includes(item)) {
                if(item == 'kg') {
                    return parseInt(titleLet.replace(/kg/g, '')) * 1000
                } else if(item == '0g') {
                    return parseInt(titleLet.replace(/0g/g, '0'))
                } else {
                    return 0
                }
            }
        }    
    }
    return 0
}
const checkParam = (list, titleList) => {
    for(let titleLet of titleList) {
        for(let item of list) {
            if(titleLet.includes(item)) {
                return titleLet
            }
        }    
    }
    return ''
}

export const inspectTitle = (title) => {
    let titleList = title.split(' ')
    let obj = new Map()
    let countryList = ['블렌드', '블랜드', '케냐', '에디오피아', '에티오피아', '태국', '카메룬', '브라질', '콜롬비아', '인도네시아', '파나마', '인도', '탄자니아', '자메이카', '코스타리카', '베트남', '하와이', '페루', '에콰도르', '슬리남', '가이아나', '베네수엘라', '니카라구아', '엘살바도르', '과테말라', '온두라스', '멕시코', '예멘', '르완다', '우간다', '리베리아', '도고', '카멜룬', '콩고', '짐바브웨', '앙골라', '남아프리카공화국', '쿠바', '하이치', '도미니카', '중국', '베트남', '필리핀', '대만', '일본', '파푸아뉴기니', '뉴칼레도니아', '마다가스카르']
    let regionList = ['구지', '시다모', '예가체프', '안티구아', '음베야', '아체', '가요', '아체가요', '따라주', '키리냐가']
    let processList = ['washed', '워시드', 'natural', '내추럴', '펄프드', '허니']
    let gradeList = ['G1', 'G2', 'G3', 'G4', 'SHB', 'AA', 'TOP', 'NY2', 'FC', 'NO.2', 'GC', 'SS']
    let weightList = ['kg', '0g']
 
    obj.set('country', checkParam(countryList, titleList))
    obj.set('region', checkParam(regionList, titleList))
    obj.set('process', checkParam(processList, titleList))
    obj.set('grade', checkParam(gradeList, titleList))
    obj.set('weight', checkWeight(weightList, titleList))
    return obj
}
