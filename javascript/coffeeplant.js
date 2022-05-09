import { setHeader } from "./util/core.js";
import { saveHead } from "./util/handleFile.js";
import { managePages } from "./util/coffeeplant.js";

const STORENAME = 'COFFEEPLANT'

export async function init() {
    console.log("> coffeePlant 시작")
    let obj = new Map()
    obj.set("storename", STORENAME)
    let now = new Date();
    obj.set("today", now.getFullYear() + "." + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1) + "." + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()))
    obj.set("url", 'https://www.coffeeplant.co.kr')
    // saveHead(obj, setHeader(), STORENAME)

    await managePages('아프리카', '생두', 'https://www.coffeeplant.co.kr/shop/goods/goods_list.php?category=021&sort=goods_link.sort1&page_num=48', obj)
    // await managePages('중남미', '생두', 'https://www.coffeeplant.co.kr/shop/goods/goods_list.php?category=020&sort=goods_link.sort1&page_num=48', obj)
    // await managePages('아시아태평양', '생두', 'https://www.coffeeplant.co.kr/shop/goods/goods_list.php?category=019&sort=goods_link.sort1&page_num=48', obj)
    // await managePages('스페셜', '생두', 'https://www.coffeeplant.co.kr/shop/goods/goods_list.php?category=018&sort=goods_link.sort1&page_num=48', obj)
    // await managePages('디카페인', '생두', 'https://www.coffeeplant.co.kr/shop/goods/goods_list.php?category=025&sort=goods_link.sort1&page_num=48', obj)
    console.log("> coffeePlant 종료")
}

init();
