let malioConfigs, malioPlans, _malioPlansSelected

let malioReady = () => malioConfigs
let malioUpdateConfig = (data) => malioConfigs = data
let malioUpdatePlans = (data) => malioPlans = data

let malioFree = () => malioConfigs['trial_plan_id']

let malioPlansInfo = (lang = 'zh-cn') => {
    if (!malioReady()) return null
    for (let item of malioConfigs['plans_info']) {
        if (item.lang === lang) {
            return item.items
        }
    }
}

let malioPlansSelect = (id) => {
    _malioPlansSelected = null
    if (!malioReady()) return
    for (let item of malioConfigs['plans_id']) {
        if (item.key.toString() === id) {
            _malioPlansSelected = id
            return
        }
    }
}

let malioPlanCycle = (plan) => {
    if (!_malioPlansSelected) return null
    for (let item of malioConfigs['plans_id']) {
        if (item.key.toString() === _malioPlansSelected) {
            let cycles = []
            for (let c in item.values) {
                cycles.push({
                    name: _malioCycleName(c),
                    plan: plan(item.values[c])
                })
            }
            return cycles
        }
    }
}

let _malioCycleName = (key) => {
    let value
    switch (key) {
        case '1day':
            value = '1天'
            break
        case '7day':
            value = '1周'
            break
        case '1month':
            value = '1个月'
            break
        case '3month':
            value = '3个月'
            break
        case '6month':
            value = '半年'
            break
        case '12month':
            value = '1年'
            break
    }
    return value
}