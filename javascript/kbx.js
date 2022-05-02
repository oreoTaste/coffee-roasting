import { saveHead } from "./util/handleFile.js";
import { getNaverItemList, manageNaverPages } from "./util/naver.js";

const STORENAME = 'KBX'

async function init() {
    let obj = new Map()
    obj.set("storename", STORENAME)
    let now = new Date();
    obj.set("today", now.getFullYear() + "." + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1) + "." + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()))
    obj.set("url", 'https://smartstore.naver.com/cap')
    saveHead(obj, await getNaverItemList("", ""))

    manageNaverPages('아프리카', '생두', 'https://smartstore.naver.com/cap/category/dede5b58bc7b416eb62591892cec6a1b', obj)
    manageNaverPages('아메리카', '생두', 'https://smartstore.naver.com/cap/category/6e78c82902f44717a6da71a9d00c4e12', obj)
    manageNaverPages('아시아', '생두', 'https://smartstore.naver.com/cap/category/6cc038ba39ea49d09a31f9d42460190e', obj)
    manageNaverPages('세계3대', '생두', 'https://smartstore.naver.com/cap/category/1cd8b72d354d4f559c4772409922f205', obj)
    manageNaverPages('써티', '생두', 'https://smartstore.naver.com/cap/category/70cba7d725e84e4fb6ce5623b4d02e15', obj)
}

init();
