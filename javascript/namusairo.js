import { setHeader } from "./util/core.js";
import { saveHead } from "./util/handleFile.js";
import { managePages } from "./util/namusairo.js";

const STORENAME = 'NAMUSAIRO'

export async function init() {
    let obj = new Map()
    obj.set("storename", STORENAME)
    let now = new Date();
    obj.set("today", now.getFullYear() + "." + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1) + "." + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()))
    obj.set("url", 'https://www.namusairo.com/')
    // saveHead(obj, setHeader())

    await managePages('아프리카', '생두', 'https://namusairo.green/product/list.html?cate_no=24', obj)
    await managePages('아프리카', '원두', 'https://namusairo.com/product/list.html?cate_no=25', obj)

}

// init();
