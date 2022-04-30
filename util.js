const checkWeight = (list, titleList) => {
    for(let titleLet of titleList) {
        titleLet = titleLet.toLowerCase()
        for(let item of list) {
            if(titleLet.includes(item)) {
                if(item == 'kg') {
                    return parseInt(titleLet.replace('kg', '')) * 1000
                } else if(item == '0g') {
                    return parseInt(titleLet.replace('0g', '0')) * 1000
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
export default function inspectTitle (title) {
    let titleList = title.split(' ')
    let obj = new Map()
    let countryList = ['블렌드', '블랜드', '케냐', '에티오피아', '태국', '카메룬', '브라질', '콜롬비아', '인도네시아', '파나마', '인도', '탄자니아', '자메이카', '코스타리카', '베트남', '하와이', '페루', '에콰도르', '슬리남', '가이아나', '베네수엘라', '니카라구아', '엘살바도르', '과테말라', '온두라스', '멕시코', '예멘', '르완다', '우간다', '리베리아', '도고', '카멜룬', '콩고', '짐바브웨', '앙골라', '남아프리카공화국', '쿠바', '하이치', '도미니카', '중국', '베트남', '필리핀', '대만', '일본', '파푸아뉴기니', '뉴칼레도니아', '마다가스카르']
    let regionList = ['구지', '시다모', '예가체프', '안티구아', '음베야', '아체', '가요', '아체가요', '따라주', '키리냐가']
    let processList = ['washed', '워시드', 'natural', '내추럴', '펄프드', '허니']
    let gradeList = ['G1', 'G2', 'G3', 'G4', 'SHB', 'AA', 'TOP']
    let weightList = ['kg', '0g']
 
    obj.set('country', checkParam(countryList, titleList))
    obj.set('region', checkParam(regionList, titleList))
    obj.set('process', checkParam(processList, titleList))
    obj.set('grade', checkParam(gradeList, titleList))
    obj.set('weight', checkWeight(weightList, titleList))
    return obj
}
