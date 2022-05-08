import { save } from "./handleFile.js";

export const findImg = (article, selector) => {
    return article.find(`img${selector}`).attr('src')
}
export const findProdName = (article, selectorList) => {
    let prodName = ''
    for(let selector of selectorList) {
        prodName += article.find(selector).text()
    }
    return prodName.replace(/,/g, '').replace(/_/g, ' ').replace(/\(/g, ' ').replace(/\)/g, ' ').replace(/\[/g, ' ').replace(/\]/g, ' ')
}
export const findPrice = (article, selectorList) => {
    let price = ''
    for(let selector of selectorList) {
        price += article.find(selector).text()
    }
    return price.replace(/,/g, '').replace(/원/g, '')
}
export const findIfNew = (article, selector) => {
    return article.find(selector).length > 0 ? "New" : ""//new 태그 확인
}

export const findIfLimited = (article, selector) => {
    return article.find(selector).length > 0 ? "Limited" : ""//limited 태그 확인
}
export const findCanBuy = (article, selector) => {
    return article.find(selector).length > 0 ? "N" : "Y"//품절 태그 확인
}
export const prodDetail = (article, selectorList) => {
    let detail = ''
    for(let selector of selectorList) {
        detail += article.find(selector).text()
    }
    return detail.replace(/,/g, '')
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
