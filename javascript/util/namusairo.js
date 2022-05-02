import axios from "axios";
import cheerio from "cheerio";

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

async function getItemList(section, url) {
    let soup = await axios.get(url)
    let $ = cheerio.load(soup.data)
    return $('ul.prdList').children('li')
}

export async function managePages(keyword, section, url, obj) {
    for(let page of await getPageList(url)) {
        console.log(page)
        let itemList = await getItemList(section, page)
        // save(keyword, page, obj, itemList)
    }
}

