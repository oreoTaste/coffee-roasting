import { saveHead } from "./handleFile.js";
import { findPagination, getItemList, getPageList, managePages } from "./util.js";

const STORENAME = 'COFFEESPELL'

async function init() {
    let obj = new Map()
    obj.set("storename", STORENAME)
    let now = new Date();
    obj.set("today", now.getFullYear() + "." + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1) + "." + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()))
    obj.set("url", 'https://smartstore.naver.com/coffeespell')
    saveHead(obj, await getItemList("", ""))

    managePages('아프리카', '생두', 'https://smartstore.naver.com/coffeespell/category/661f22e827554c198b452d437c66dc5e', obj)
    managePages('아프리카', '원두', 'https://smartstore.naver.com/coffeespell/category/ff37e49dadcc4f17b1148766d247b2bb', obj)

}

init();
