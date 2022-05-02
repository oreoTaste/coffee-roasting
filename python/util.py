def inspectTitle(title):
    title = title.replace('_', ' ').replace('(', ' ').replace(')', ' ').replace('[', ' ').replace(']', ' ')
    country = ['블렌드', '블랜드', '케냐', '에티오피아', '태국', '카메룬', '브라질', '콜롬비아', '인도네시아', '파나마', '인도', '탄자니아', '자메이카', '코스타리카', '베트남', '하와이', '페루', '에콰도르', '슬리남', '가이아나', '베네수엘라', '니카라구아', '엘살바도르', '과테말라', '온두라스', '멕시코', '예멘', '르완다', '우간다', '리베리아', '도고', '카멜룬', '콩고', '짐바브웨', '앙골라', '남아프리카공화국', '쿠바', '하이치', '도미니카', '중국', '베트남', '필리핀', '대만', '일본', '파푸아뉴기니', '뉴칼레도니아', '마다가스카르']
    region = ['구지', '시다모', '예가체프', '안티구아', '음베야', '아체', '가요', '아체가요', '따라주', '키리냐가']
    process = ['washed', '워시드', 'natural', '내추럴', '펄프드', '허니']
    grade = ['G1', 'G2', 'G3', 'G4', 'SHB', 'AA', 'TOP']
    weight = ['kg', '0g']
    character = {}
    character['country'] = ' , '
    character['region'] = ' , '
    character['process'] = ' , '
    character['grade'] = ' , '
    character['weight'] = ' , '
    bool = {}
    bool['country'] = True
    bool['region'] = True
    bool['process'] = True
    bool['grade'] = True
    bool['weight'] = True
    for t in title.split(' '):
        if bool['country']:
            for c in country:
                if(c in t):
                    character['country'] = t + character['country']
                    bool['country'] = False
                    pass
        if bool['region']:
            for r in region:
                if(r in t):
                    character['region'] = t + character['region']
                    bool['region'] = False
                    pass
        if bool['process']:
            for p in process:
                if(p in t):
                    character['process'] = t + character['process']
                    bool['process'] = False
                    pass
        if bool['grade']:
            for g in grade:
                if(g in t):
                    character['grade'] = t + character['grade']
                    bool['grade'] = False
                    pass
        if bool['weight']:
            for w in weight:
                if(w in t.lower()):
                    character['weight'] = t.lower().replace('kg', '000').replace('g', '') + character['weight']
                    bool['weight'] = False
                    pass
    return character