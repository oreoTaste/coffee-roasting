import fs from 'fs'

export function saveHead(obj, values) {
    // header
    let header = [...obj.keys()]
    values.forEach((el) => {
        let elKey = [...el.keys()]
        header.push(...elKey.filter(k => !header.includes(k)))
    })

    if(header.includes('extra')) {
        header.splice(header.indexOf('extra'), 1)
        header.push('country', 'region', 'process', 'grade', 'weight')
    }

    // file
    let fileName = obj.get('today') + "_" + obj.get('storename') + ".csv"
    fs.appendFile(fileName, header.join(', ') + '\n', (err) => console.log(err, 'head 출력'));
} 

export function save(keyword, page, obj, values) {
    // header
    // let header = [...obj.keys()]
    // values.forEach((el) => {
    //     let elKey = [...el.keys()]
    //     header.push(...elKey.filter(k => !header.includes(k)))
    // })

    // if(header.includes('extra')) {
    //     header.splice(header.indexOf('extra'), 1)
    //     header.push('country', 'region', 'process', 'grade', 'weight')
    // }

    // body
    let body = []
    values.forEach((el) => {
        let bodyLet = []
        bodyLet.push(...obj.values())
        let val = [...el.values()]
        bodyLet.push(...val?.map(el => typeof(el) == "object" ? [...el.values()].join(', ') : el))
        body.push(bodyLet)
    })

    // file
    let fileName = obj.get('today') + "_" + obj.get('storename') + ".csv"
    fs.appendFile(fileName, body.join('\n') + '\n', (err) => console.log(err, 'body 출력 : ' + keyword + " :: " + page));
} 