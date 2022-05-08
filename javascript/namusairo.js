import { setHeader } from "./util/core.js";
import { saveHead } from "./util/handleFile.js";
import { managePages, getItemList } from "./util/namusairo.js";

const STORENAME = 'NAMUSAIRO'

async function init() {
    let obj = new Map()
    obj.set("storename", STORENAME)
    let now = new Date();
    obj.set("today", now.getFullYear() + "." + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1) + "." + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()))
    obj.set("url", 'https://www.namusairo.com/')
    saveHead(obj, setHeader())

    managePages('아프리카', '생두', 'https://namusairo.green/product/list.html?cate_no=24', obj)
    managePages('아프리카', '원두', 'https://namusairo.com/product/list.html?cate_no=25', obj)

}

init();
