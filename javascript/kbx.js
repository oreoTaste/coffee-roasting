import { setHeader } from "./util/core.js";
import { saveHead } from "./util/handleFile.js";
import { manageNaverPages } from "./util/naver.js";

const STORENAME = 'KBX'

export async function init() {
    console.log("> kbx 시작")
    let obj = new Map()
    obj.set("storename", STORENAME)
    let now = new Date();
    obj.set("today", now.getFullYear() + "." + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1) + "." + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()))
    obj.set("url", 'https://smartstore.naver.com/cap')
    // saveHead(obj, setHeader())

    await manageNaverPages('아프리카', '생두', 'https://smartstore.naver.com/cap/category/dede5b58bc7b416eb62591892cec6a1b?st=RECENT&free=false&dt=BIG_IMAGE&size=80', obj)
    await manageNaverPages('아메리카', '생두', 'https://smartstore.naver.com/cap/category/6e78c82902f44717a6da71a9d00c4e12?st=RECENT&free=false&dt=BIG_IMAGE&size=80', obj)
    await manageNaverPages('아시아', '생두', 'https://smartstore.naver.com/cap/category/6cc038ba39ea49d09a31f9d42460190e?st=RECENT&free=false&dt=BIG_IMAGE&size=80', obj)
    await manageNaverPages('세계3대', '생두', 'https://smartstore.naver.com/cap/category/1cd8b72d354d4f559c4772409922f205?st=RECENT&free=false&dt=BIG_IMAGE&size=80', obj)
    await manageNaverPages('써티', '생두', 'https://smartstore.naver.com/cap/category/70cba7d725e84e4fb6ce5623b4d02e15?st=RECENT&free=false&dt=BIG_IMAGE&size=80', obj)
    console.log("> kbx 종료")
}

// init();
