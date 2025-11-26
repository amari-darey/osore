export const REVERS_DICE = {
    1: 20,
    2: 19,
    3: 18,
    4: 17,
    5: 16,
    6: 15,
    7: 14,
    8: 13,
    9: 12,
    10: 11,
    11: 10,
    12: 9,
    13: 8,
    14: 7,
    15: 6,
    16: 5,
    17: 4,
    18: 3,
    19: 2,
    20: 1,
}

export const SCHEME = {
    1: {
        "link1":["occupation", "startPosition"],
        "link2":["goal", "look"],
        "link3":["behaviour", "interests"]
    },
    2: {
        "link1":["goal", "occupation"],
        "link2":["interests", "look"],
        "link3":["behaviour", "startPosition"]
    },
    3: {
        "link1":["occupation", "interests"],
        "link2":["goal", "behaviour"],
        "link3":["startPosition", "interests"]
    },
    4: "pass",
    5: {
        "link1":["occupation", "behaviour"],
        "link2":["goal", "look"],
        "link3":["startPosition", "interests"]
    },
    6: {
        "link1":["occupation", "look"],
        "link2":["goal", "startPosition"],
        "link3":["behaviour", "interests"]
    },
    7: {
        "link1":["occupation", "startPosition"],
        "link2":["goal", "interests"],
        "link3":["behaviour", "look"]
    },
    8: "pass",
    9: {
        "link1":["occupation", "interests"],
        "link2":["goal", "look"],
        "link3":["behaviour", "startPosition"]
    },
    10: {
        "link1":["goal", "startPosition"],
        "link2":["occupation", "startPosition"],
        "link3":["interests", "look"]
    },
    11: {
        "link1":["goal", "occupation"],
        "link2":["behaviour", "interests"],
        "link3":["startPosition", "look"]
    },
    12: "pass",
    13: {
        "link1":["occupation", "interests"],
        "link2":["goal", "startPosition"],
        "link3":["behaviour", "look"]
    },
    14: {
        "link1":["occupation", "behaviour"],
        "link2":["goal", "interests"],
        "link3":["startPosition", "look"]
    },
    15: {
        "link1":["occupation", "behaviour"],
        "link2":["goal", "startPosition"],
        "link3":["interests", "look"]
    },
    16: "pass",
    17: {
        "link1":["occupation", "look"],
        "link2":["goal", "interests"],
        "link3":["behaviour", "startPosition"]
    },
    18: {
        "link1":["goal", "behaviour"],
        "link2":["occupation", "look"],
        "link3":["startPosition", "interests"]
    },
    19: {
        "link1":["occupation", "goal"],
        "link2":["behaviour", "look"],
        "link3":["startPosition", "interests"]
    },
    20: "pass"
}

const OCCUPATION = {
    1: {"value": "Инвалид", "modified": "-2complexion"},
    2: {"value": "Безработный", "modified": "-1endurance"},
    3: {"value": "Работник общепита", "modified": "-1mind"},
    4: {"value": "Офисный служащий", "modified": "-1complexion"},
    5: {"value": "Мангака", "modified": "-1complexion"},
    6: {"value": "Заключенный", "modified": "-1character"},
    7: {"value": "Домохозяйка", "modified": "-1endurance"},
    8: {"value": "Хост (содержанец)", "modified": ""},
    9: {"value": "Школьник", "modified": ""},
    10: {"value": "Рок музыкант", "modified": ""},
    11: {"value": "Горничная", "modified": ""},
    12: {"value": "Политик", "modified": ""},
    13: {"value": "Бизнесмен", "modified": ""},
    14: {"value": "Медсестра", "modified": "+1mind"},
    15: {"value": "Айдол", "modified": "+1character"},
    16: {"value": "Якудза", "modified": "+1complexion"},
    17: {"value": "Учитель", "modified": "+1mind"},
    18: {"value": "Спортсмен", "modified": "+1complexion"},
    19: {"value": "Полицейский", "modified": "+1endurance"},
    20: {"value": "Выживальщик", "modified": "+1all"},
}

const LOOK = {
    1: {"value": "Уродливый", "modified": "-2character"},
    2: {"value": "Пухлый", "modified": "-1complexion"},
    3: {"value": "Качок", "modified": "-1mind"},
    4: {"value": "В шрамах", "modified": "-1character"},
    5: {"value": "Невзрачный", "modified": "-1character"},
    6: {"value": "Болезненный вид", "modified": "-1endurance"},
    7: {"value": "Непропорциональный", "modified": "-1complexion"},
    8: {"value": "Худой", "modified": ""},
    9: {"value": "Грубое лицо", "modified": ""},
    10: {"value": "Неформал", "modified": ""},
    11: {"value": "Неестественная внешность", "modified": ""},
    12: {"value": "Сексуальный", "modified": ""},
    13: {"value": "Сутулый", "modified": ""},
    14: {"value": "Крутой", "modified": "+1endurance"},
    15: {"value": "Ухоженный", "modified": "+1endurance"},
    16: {"value": "Ботаник", "modified": "+1mind"},
    17: {"value": "Симпатичный", "modified": "+1character"},
    18: {"value": "Милый", "modified": "+1character"},
    19: {"value": "Спортивный", "modified": "+1complexion"},
    20: {"value": "Обычный", "modified": "+1all"},
}

const BEHAVIOUR = {
    1: {"value": "Яндаре", "modified": "-2mind"},
    2: {"value": "Цундере", "modified": "-1character"},
    3: {"value": "Глуповатый", "modified": "-1mind"},
    4: {"value": "Раздражительный", "modified": "-1character"},
    5: {"value": "Развратный", "modified": "-1endurance"},
    6: {"value": "Инфантильный", "modified": "-1complexion"},
    7: {"value": "Пугливый", "modified": "-1endurance"},
    8: {"value": "Замкнутый", "modified": ""},
    9: {"value": "Мачо", "modified": ""},
    10: {"value": "Равнодушный", "modified": ""},
    11: {"value": "Героический", "modified": ""},
    12: {"value": "Опасный", "modified": ""},
    13: {"value": "Лидер", "modified": ""},
    14: {"value": "Спокойный", "modified": "+1endurance"},
    15: {"value": "Хитрый", "modified": "+1mind"},
    16: {"value": "Заботливый", "modified": "+1character"},
    17: {"value": "Активный", "modified": "+1complexion"},
    18: {"value": "Кокетливый", "modified": "+1character"},
    19: {"value": "Позитивный", "modified": "+1endurance"},
    20: {"value": "Осторожный", "modified": "+1all"},
}

const INTERESTS = {
    1: {"value": "Наркотики", "modified": "-2endurance"},
    2: {"value": "Садизм", "modified": "-1mind"},
    3: {"value": "Саморазрушение", "modified": "-1endurance"},
    4: {"value": "Хейтай", "modified": "-1character"},
    5: {"value": "Манги и аниме", "modified": "-1character"},
    6: {"value": "Еда", "modified": "-1complexion"},
    7: {"value": "Компьютерные игры", "modified": "-1mind"},
    8: {"value": "Ниндзюцу", "modified": ""},
    9: {"value": "Садоводство", "modified": ""},
    10: {"value": "История", "modified": ""},
    11: {"value": "Фотография", "modified": ""},
    12: {"value": "Литература", "modified": ""},
    13: {"value": "Музыка", "modified": ""},
    14: {"value": "Шахматы", "modified": "+1mind"},
    15: {"value": "Стрельба из лука", "modified": "+1complexion"},
    16: {"value": "Наука", "modified": "+1mind"},
    17: {"value": "Спорт", "modified": "+1complexion"},
    18: {"value": "Фехтование", "modified": "+1endurance"},
    19: {"value": "Огнестрел", "modified": "+1character"},
    20: {"value": "Выживание", "modified": "+1all"},
}

const GOAL = {
    1: {"value": "Сходить с ума", "modified": "-2"},
    2: {"value": "Убежать и спрятаться", "modified": "-1endurance"},
    3: {"value": "Украсть желаемый предмет", "modified": "-1endurance"},
    4: {"value": "Помогать монстрам", "modified": "-1mind"},
    5: {"value": "Изнасиловать объект обожания", "modified": "-1character"},
    6: {"value": "Наслаждаться апокалипсисом", "modified": "-1mind"},
    7: {"value": "Убить своего врага", "modified": "-1complexion"},
    8: {"value": "Найти спасателей", "modified": ""},
    9: {"value": "Спасти всех", "modified": ""},
    10: {"value": "Защитить кого то в группе", "modified": ""},
    11: {"value": "Дебоширить", "modified": ""},
    12: {"value": "Найти ребёнка", "modified": ""},
    13: {"value": "Найти родителей", "modified": ""},
    14: {"value": "Найти любимого", "modified": "+1endurance"},
    15: {"value": "Найти лучшее оружие", "modified": "+1endurance"},
    16: {"value": "Признаться в любви", "modified": "+1character"},
    17: {"value": "Возглавить отряд спасения", "modified": "+1character"},
    18: {"value": "Узнать причину происходящего", "modified": "+1mind"},
    19: {"value": "Найти убежище", "modified": "+1complexion"},
    20: {"value": "Выжить", "modified": "+1all"},
}

const START_POSITION = {
    1: {"value": "Разрушенное убежище", "modified": "-2endurance"},
    2: {"value": "Туалет", "modified": "-1endurance"},
    3: {"value": "Тюрьма", "modified": "-1character"},
    4: {"value": "Канализация", "modified": "-1mind"},
    5: {"value": "Офис", "modified": "-1mind"},
    6: {"value": "Кафе", "modified": "-1complexion"},
    7: {"value": "Метро", "modified": "-1complexion"},
    8: {"value": "Дом", "modified": ""},
    9: {"value": "Отель", "modified": ""},
    10: {"value": "Парк", "modified": ""},
    11: {"value": "Магизин", "modified": ""},
    12: {"value": "Фестиваль", "modified": ""},
    13: {"value": "Гос. учереждение", "modified": ""},
    14: {"value": "Школа", "modified": "+1mind"},
    15: {"value": "Улица", "modified": "+1endurance"},
    16: {"value": "Пляж", "modified": "+1character"},
    17: {"value": "Полицейский участок", "modified": "+1complexion"},
    18: {"value": "Спортзал", "modified": "+1complexion"},
    19: {"value": "Библиотека", "modified": "+1mind"},
    20: {"value": "Обустроенная база", "modified": "+1all"},
}

export const PARAMETRS = {
    "occupation": OCCUPATION,
    "look": LOOK,
    "behaviour": BEHAVIOUR,
    "interests": INTERESTS,
    "goal": GOAL,
    "startPosition": START_POSITION
}
