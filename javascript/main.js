import { init as coffeeSpellInit} from "./coffeespell.js";
import { init as kbxInit} from "./kbx.js";
import { init as namusairoInit} from "./namusairo.js";
import { setHeader } from "./util/core.js";
import { saveHead } from "./util/handleFile.js";

const FILENAME = 'KBX_COFFEESPELL_NAMUSAIRO'

async function start() {
    let obj = new Map()
    obj.set("storename", '')
    let now = new Date();
    obj.set("today", now.getFullYear() + "." + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1) + "." + (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()))
    obj.set("url", '')
    saveHead(obj, setHeader(), FILENAME)
    
    console.log("> coffeeSpell 시작")
    await coffeeSpellInit()
    console.log("> coffeeSpell 종료")

    console.log("> kbx 시작")
    await kbxInit()
    console.log("> kbx 종료")

    console.log("> namusairo 시작")
    await namusairoInit()
    console.log("> namusairo 종료")
}
await start()