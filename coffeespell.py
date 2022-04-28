import requests
from bs4 import BeautifulSoup
import datetime

STORENAME = 'COFFEESPELL'

def checkInt(i):
    try:
        int(i)
        return True
    except:
        return False


def conquerPage(section, url):
    itemList = []
    soup = BeautifulSoup(requests.get(url).text, 'html.parser')
    article = soup.find_all("li", {"class": '-qHwcFXhj0'})
    for a in article:
        item = {}
        # 구분 : 원두, 생두 등
        item["section"] = section
        # 이미지
        item['img'] =a.find("img", {"class": "_25CKxIKjAk"})['src']
        # 상품명
        prodName = a.find('strong', {'class': 'QNNliuiAk3'}).text.replace(',', '')
        item['product name'] = prodName
        
        item['weight'] = 0
        for n in prodName.replace('-', ' ').replace('_', ' ').split(' '):
            if 'kg' in n or 'Kg' in n or 'KG' in n:
                item['weight'] = int(n.replace('kg', '').replace('Kg', '').replace('KG', ''))*1000
            elif '0g' in n or '0G' in n:
                item['weight'] = n.replace('0G', '0').replace('0g', '0')
        print(item['weight'])
        # 가격
        item['price'] = a.find('span', {'class': 'nIAdxeTzhx'}).text.replace(',', '')
        # 리뷰수, 평점 : a.find('em', {'class': '_1dH1kEDaAZ'})
        [review, grade] = [0, 0]
        title = [r.text for r in a.find_all('span', {'class': '_1ah-_dNSCu'})]
        body = [r.text for r in a.find_all('em', {'class': '_1dH1kEDaAZ'})]
        if len(body) == 2:
            [review, grade] = body
        elif len(body) == 1:
            if title[0] == '리뷰':
                [review, grade] = [body[0], 0]
            else:
                [review, grade] = [0, body[0]]
        item['review'] = review
        item['grade'] = grade

        # 품절/재고 여부
        item['canBuy'] = 'N' if a.find('span', {'class': '_3Btky8fCyp'}) else 'Y'
        # 상세 설명
        item['detail'] = a.find('p', {'class', 'vChbm1yu9U'}).text.replace(',', '') if a.find('p', {'class', 'vChbm1yu9U'}) else 0
        itemList.append(item)
    return itemList

def conqureSection(section, url):
    itemList = []
    soup = BeautifulSoup(requests.get(url).text, 'html.parser')
    pagination = soup.find('div', {'class': '_1HJarNZHiI _2UJrM31-Ry'})
    p = sorted(filter(checkInt, [a.text for a in pagination.find_all('a')]), reverse=True)
    urlParam = int(p[0])

    for ind in range(1, urlParam + 1):
        eachUrl = url + '?cp=' + str(ind)
        itemList += conquerPage(section, eachUrl)
    return itemList

def save(obj):
    f = open(datetime.datetime.now().strftime('%Y.%m.%d_%H%M') + '_' + obj['storename'] + ".csv", "a")
    for item in obj['itemList']:
        f.write("{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}\n".format(obj['storename'], obj['today'], item['section'], item['img'], item['product name'], item['weight'], item['price'], item['review'], item['grade'], item['canBuy'], item['detail']))
    f.close()

def main():
    obj = {"storename" : STORENAME }
    obj["today"] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    obj["url"] = 'https://smartstore.naver.com/coffeespell'

    itemList = []
    url = 'https://smartstore.naver.com/coffeespell/category/661f22e827554c198b452d437c66dc5e' # 생두
    itemList += conqureSection('생두', url)
    url = 'https://smartstore.naver.com/coffeespell/category/ff37e49dadcc4f17b1148766d247b2bb' # 원두
    itemList += conqureSection('원두', url)
    obj["itemList"] = itemList
    # save(obj)


main()