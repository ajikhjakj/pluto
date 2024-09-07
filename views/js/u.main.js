let initString = function () {
    $('title').html(string('appName'))
    $('#tab_main').html(string('m_main'))
    $('#tab_store').html(string('m_store'))
    $('#tab_mine').html(string('m_mine'))
    $('#connect').html(string('connect'))
    $('#lineModalLabel').html(string('lineList'))
    $('#select1').html('<i class="fa fa-map-marker-alt"></i>&nbsp;&nbsp;&nbsp;' + string('selectLine1') +
        '&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-angle-right"></i>')
    $('#select2').html('<i class="fa fa-map-marker-alt"></i>&nbsp;&nbsp' + string('selectLine2') +
        '&nbsp;&nbsp;<i class="fa fa-angle-right"></i>')

    $('#settingModalLabel').html(string('setting'))
    $('#settingModal .route .title').html(string('settingRoute'))
    $('#settingModal .route .mode p').html(string('settingRouteMode'))
    $('#settingModal .route .mode .rmg').html(string('connect_global'))
    $('#settingModal .route .mode .rma').html(string('connect_auto'))
    $('#settingModal .route .tap p').html(string('settingTap'))
    $('#settingModal .route .tap .more').html(string('settingTapHint').toString().replace('Pluto', string('appName')))
    $('#settingModal .route .tun p').html(string('settingTun'))
    $('#settingModal .route .tun .more').html(string('settingTunHint').toString().replace('Pluto', string('appName')))
    $('#settingModal .route .tun .fixed').html(`&nbsp;${string('settingTunFix')}`)
    $('#settingModal .about .title').html(string('settingAbout'))
    $('#settingModal .about .version p').html(string('settingAboutVersion'))

    $('#classDay').html(string('userClassDay'))
    $('#classDayDesc').html('<span class="counter" id="classDayValue">0</span> ' + string('userClassDayUnit'))
    $('#classExpire').html('- ' + string('userClassExpire'))
    $('#trafficUsable').html(string('userTrafficUsable'))
    $('#trafficUsableDesc').html(' <span class="counter" id="trafficUsableValue">0</span> TB')
    $('#trafficToday').html(string('userTrafficToday') + '0MB')
    $('#balance').html(string('userBalance'))
    $('#balanceValue').html('0.00')
    $('#balanceAff').html(string('userBalanceAff'))
    $('#checkin i').html("&nbsp;&nbsp;" + string('dailySign'))
    $('#recharge i').html("&nbsp;&nbsp;" + string('recharge'))
    $('#reset i').html("&nbsp;&nbsp;" + string('resetTraffic'))
    $('#renew i').html("&nbsp;&nbsp;" + string('renew'))
    $('#invite i').html("&nbsp;&nbsp;" + string('aff'))
    $('#logout i').html("&nbsp;&nbsp;" + string('logout'))
    $('#noticeModal #noticeModalLabel').html(string('notice'))
    $('#noticeTitle').html('<i class="fas fa-bullhorn" style="color:#808A87"></i> ' + string('notice'));
    $('#aboutTitle').html('<i class="fas fa-info-circle" style="color:#808A87"></i> ' + string('about'));
    $('#btnWebsite').html('<i class="fa fa-info-circle">&nbsp;&nbsp;</i> ' + string('aboutWebsite'))
    $('#contactTitle').html(string('aboutContact'));
    $('#contactSec').html(string('aboutContactSec'));
    $('#contactEmail').html('<i class="fas fa-envelope" style="color:#808A87;"></i>&nbsp;&nbsp;' + string('aboutContactEmail'));
    $('#contactTg').html('<i class="fab fa-telegram-plane" style="color: dodgerblue;"></i>&nbsp;&nbsp;' + string('aboutContactTg'));
    $('#supportTitle').html(string('aboutSupport'));
    $('#supportSec').html(string('aboutSupportSec'));
    $('#supportShare').html('<i class="fas fa-share-alt" style="color: orangered;"></i>&nbsp;&nbsp;' + string('aboutSupportShare'));
    $('#moreTitle').html(string('aboutMore'))
    $('.promo').html(string('orderPromoHint'))
    $('#rechargeModalLabel').html(string('recharge'))
    $('#rechargeModalContent label').html(string('userBalanceHint'))
    $('#rechargeModalContent .tips p').html(string('tips'))
    $('#rechargeModalContent .tips').append(string('userBalanceTips'))


    $('#affModalLabel').html(string('aff'))
    $('#affModalContent .code').html(string('affCode'))
    $('#affModalContent .back').html(string('affList'))
    $('#affModalContent .back-list > .item .money').html(string('affMoney'))
    $('#affModalContent .back-list > .item .date').html(string('affDate'))
    $('#affTransferModalLabel').html(string('affTransfer'))
    $('#affTransferModalContent label').html(string('affTransferInput'))
    $('#affTransferModalContent > p').html(string('affTransferTip'))
    $('#affTransferModal .modal-footer a i').html(`&nbsp;&nbsp;${string('confirm')}`)
    $('#affWithdrawModalLabel').html(string('affWithdraw'))
    $('#affWithdrawModalContent label').html(string('affWithdrawAccount'))
    $('#affWithdrawModalContent .method p').html(string('affWithdrawMethod'))
    $('#affWithdrawModal .modal-footer a i').html(`&nbsp;&nbsp;${string('confirm')}`)

    $('#trafficLogsModalLabel').html(string('userTrafficLog'))
    $('#trafficLogsModalContent .logs-list > .item .date').html(string('userTrafficLogDate'))
    $('#trafficLogsModalContent .logs-list > .item .up').html(string('userTrafficLogUp'))
    $('#trafficLogsModalContent .logs-list > .item .down').html(string('userTrafficLogDown'))
    $('#trafficLogsModalContent .logs-list > .item .rate').html(string('userTrafficLogRate'))
    $('#trafficLogsModalContent .logs-list > .item .total').html(string('userTrafficLogTotal'))

    $('.errPage .btn').html(string('pageErr'))

    $('#proxyShareModalContent h5').html(string('proxyShareTips'))
    $('#proxyShareModalContent .row .host').html(string('proxyShareHost'))
    $('#proxyShareModalContent .row .port').html(string('proxySharePort'))

    $('#trafficResetModalLabel').html(string('resetTraffic'))
}
initString()

$('.left li').click(function () {
    let index = $('.left li').index($(this))

    if (isXmplus() && parseInt(index) === 1) {
        openWebsiteSource()
    } else {
        $('.right-item').each(function () {
            if ($('.right-item').index($(this)) === index) {
                $(this).css('z-index', 3)
            } else {
                $(this).css('z-index', 2)
            }
        })
        $('.left li.active').removeClass('active')
        $(this).addClass('active')
    }

    if (parseInt(index) === 2) reqUser()
})

$('#logout').click(() => reqLogout())
let $connectBtn = $('#conBtn')
$connectBtn.click(() => reqConnect())
$connectBtn.hover(() => {
    $('.conFg path').css('fill', '#285bcf')
}, () => {
    $('.conFg path').css('fill', '#247ef6')
})
$('#lineModal .btnRefresh').click(() => {
    reqLines()
    $('#lineModal .loadingPage').show()
    $('#lineModal .errPage').hide()
    $('#lineModal .scrollable').hide()
})
$('#checkin a').click(() => {
    reqCheckIn()
    showLoading()
})
$('#lineModal').on('hide.bs.modal', () => reqLineListClose())
$('#supportShare').click(() => {

})
$('#contactEmail').click(() => reqEmail())
$('#contactTg').click(() => reqTg())

$('#btnWebsite').click(() => openWebsiteSource())

// 聊天系统
$('.chatbox').click(() => openChatbox())


/******************** 监听事件 ********************/
/******************** 监听事件 ********************/
/******************** 监听事件 ********************/

let $newVersion = $('#settingModal .version i')
$newVersion.click(() => window.api.send('toMain', 'version.check'))
let canTap = true
let $switchTap = $('#settingModal .tap #switchTap')
$switchTap.change(() => {
    if (canTap && $switchTap.prop('checked')) reqCheckTap()
})
let canTun = true
let $switchTun = $('#settingModal .tun #switchTun')
$switchTun.change(() => {
    if (canTun) reqCheckTun($switchTun.prop('checked'))
})

onGetTips((msg) => {
    $('#tab-main .tips').html(msg)
})

onGetSettings((args) => {
    if (args['platform'] === 'darwin') {
        $('#settingModal .tap').hide()
        $('#settingModal .tun').hide()
    }
    if (args.hasOwnProperty('route')) $(`#settingModal .route .mode .radio input:radio[value="${args['route']}"]`).prop('checked', true)
    if (args.hasOwnProperty('version')) $('#settingModal .version .right p').html(`V${args['version']}`)
    if (args.hasOwnProperty('newVersion')) $newVersion.show()
    if (args.hasOwnProperty('tap')) {
        canTap = false
        $switchTap.prop('checked', args['tap'])
        canTap = true
    }
    if (args.hasOwnProperty('tun')) {
        canTun = false
        $switchTun.prop('checked', args['tun'])
        canTun = true
    }
})

onGetAdditional(() => getMalioStore())

onGetConfig(function (args) {
    if (isEmpty(args['tg']) && isEmpty(args['email'])) {
        $('.about .contact').hide()
    } else {
        if (isEmpty(args['tg'])) {
            $('.about .contact #contactTg').hide()
        }
        if (isEmpty(args['email'])) {
            $('.about .contact #contactEmail').hide()
        }
    }
    if (isEmpty(args['checkin']) || args['checkin'] !== 1) {
        $('#checkin').hide()
    }

    if (args['arch']) $('#moreArch').html(`${string('aboutMoreArch')}${args['arch']}`)

    // __setLocale(args['locale'])

    // hide for v2b
    if (isV2b()) {
        $('#checkin').hide()
        $('#recharge').hide()
        $('#reset').show()
        $('#renew').show()
        $('.traffic .logs').show()
    }

    if (isXmplus()) {
        $('#checkin').hide()
        $('#recharge').hide()
        $('#reset').hide()
        $('#renew').hide()
        $('#invite').hide()
        $('.traffic .logs').hide()
    }

    if (args['crisp']) initCrisp(args['crisp'])

    if (args['allowLan']) $('.proxyShare').show()
})

onGetAnimators(function (animators) {
    displayAnimator(animators)
})

function displayAnimator(animators) {
    $('#animator').empty()
    let animatorEvents = []
    animators?.forEach(item => {
        let style
        if (item.w === 1 && item.h === 1) {
            style = "width: 100%; height: 100%;"
        } else {
            let unit
            switch (item['ot']) {
                case 0:
                    unit = "px"
                    break
                case 1:
                    unit = "%"
                    break
                default:
                    unit = "px"
                    break
            }
            let tob
            switch (item.r) {
                case 1:
                    tob = `bottom:${item.y}${unit}; left:${item.x}${unit}`
                    break
                case 2:
                    tob = `bottom:${item.y}${unit}; right:${item.x}${unit}`
                    break
                case 3:
                    tob = `top:${item.y}${unit}; right:${item.x}${unit}`
                    break
                default:
                    tob = `top:${item.y}${unit}; left:${item.x}${unit}`
                    break
            }
            style = `width: ${item.w}px; height: ${item.h}px; ${tob};`
        }
        let lottieId = `LottiePluto${Math.floor(Math.random() * (100000 - 1) + 1)}`
        animatorEvents.push(lottieId)
        $('#animator').append(`<lottie-player class="${lottieId}" src="${item.p}" speed="${item.s}"  style="${style}" loop autoplay/>`)
    })
    console.log("animators " + animatorEvents)
    animatorEvents.forEach(key => $(`.${key}`).on('error', () => $(`.${key}`).remove()))
}

onGetProxyShare((args) => {
    console.log("---------" + JSON.stringify(args))
    $('#proxyShareModal #proxyShareModalContent #host').html(args['host'])
    $('#proxyShareModal #proxyShareModalContent #port').html(args['port'])
})

onGetNotice(function (args) {
    let notice = args[0]
    $('.noticeDesc').html(notice['content'])

    $('#noticeModal #noticeModalContent').html(notice['content'])
    $('#noticeModal .modal-footer p').html(notice['date'])

    if (args[1]) {
        $('#noticeModal').modal('show')
    }

    let _clicked = (e) => {
        openWeb($(e.target).attr('href'))
        return false
    }

    $('.noticeDesc a').click(e => _clicked(e))
    $('#noticeModal #noticeModalContent a').click(e => _clicked(e))

    // $('#noticeDesc a').on('click', function () {
    //     openWeb($(this).attr('href'))
    //     return false
    // })
    // $('#noticeModal #noticeModalContent a').on('click', function () {
    //     openWeb($(this).attr('href'))
    //     return false
    // })
})

onGetUser(function (user) {
    console.log("onGetUser-----------")

    $('.username').html(user['name'])
    $('#classDayValue').html(user['vipExpireDays'])
    $('#classExpire').html(string('userClassExpire') + user['vipExpireTime'])
    let traffic = user['traffic']
    let usable = formatTraffic2Unit(traffic[0] - traffic[1])
    $('#trafficUsableDesc').html('<span class="counter">' + usable[0] + '&nbsp;</span>' + usable[1])
    $('#trafficToday').html(isV2b() ? string('userTrafficTotal') + formatTraffic(traffic[2]) : (string('userTrafficToday') + formatTraffic(traffic[2])))
    $('#balanceValue').html(user['balance'])
    if (user['signIn'] && user['signIn'] === true) {
        $('#checkin a').addClass('disabled')
    } else {
        $('#checkin a').removeClass('disabled')
    }
    if (user['avatar']) {
        $('.avatar').attr('src', user['avatar'])
    } else {
        $('.avatar').attr('src', 'img/ic_logo.64.png')
    }

    if (isV2b()) $('#classDay').html(user.vipName)
    $('#renew').click(() => $(`#tab-store .grid input[value=${user.vip}]`).parent().find('.btn').click())
    $('#reset').click(() => onTrafficReset())

    // reqAdditional()
    // reqNotice()

    getMalioStore()
    updateCrisp(user)
})

onGetLine((args) => updateLineUI(args))

let linePageLoading = $('#lineModal .loadingPage')
let linePageErr = $('#lineModal .errPage')
let linePageContent = $('#lineModal .scrollable')
let lineLoading = () => {
    linePageLoading.show()
    linePageErr.hide()
    linePageContent.hide()
}
lineLoading()
$('#lineModal .errPage .btn').click(() => {
    lineLoading()
    reqLines()
})

onGetLinesNone(function () {
    console.log("onGetLinesNone ---------------->>>>>")
    lineName.html(string('line_none'))
})
onGetLines(function (args) {

    console.log("onGetLines ---------------->>>>>")
    if (args[1]) {
        linePageLoading.hide()
        linePageErr.show()
        linePageContent.hide()
        return
    }

    linePageLoading.hide()
    linePageErr.hide()
    linePageContent.show()

    let list = $('#lineModal .modal-body ul');
    list.empty()

    for (let item of args[0]) {
        let next = '<li>' +
            '  <div class="card">' +
            '      <div class="card-body">' +
            `          <input type="hidden" id="line" value="${encodeURIComponent(JSON.stringify(item))}"/>` +
            `          <input type="hidden" id="server" value="${item.server}"/>` +
            `          <img class="flag rounded-circle" src="${getFlagRes(item['flag'])}"/>` +
            `          <p id="name" class="name unselect" style="pointer-events: none">${item.name}</p>` +
            `          <p class="country unselect" style="pointer-events: none">${item.flag}</p>` +
            '          <div class="options req">' +
            '              <i class="fa ping" id="ping"><p class="unselect">Ping</p></i>' +
            '              <i class="fa fa-bolt speed unselect" id="speed"></i>' +
            '          </div>' +
            '          <div class="options result">' +
            '              <p class="ping unselect me-2" style="display: none"></p>' +
            '              <p class="speed unselect" style="display: none">&nbsp;&nbsp;&nbsp;&nbsp;</p>' +
            '          </div>' +
            '      </input>' +
            '  </div>' +
            '</li>'
        list.append(next)
    }

    $('.line-list li').click(function (e) {
        let line = JSON.parse(decodeURIComponent($(e.target).find('#line').val()))
        if (checkLineClick(line, getUser())) {
            let name = line['name']
            reqLineChanged(name)
            updateLineUI({name: name, flag: line['flag']})
            updateLineListSelected(name)
        }

        $('#lineModal').modal('hide')
        return false
    })
    $('.line-list li .ping').click(function (e) {
        e.stopPropagation()
        let $parent = $(this).parent().parent()
        $parent.find('#ping').html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>')
        reqLinePing($parent.find('#name').text(), $parent.find('#server').val())
    })
    $('.line-list li .speed').click(function (e) {
        e.stopPropagation()
        let $sr = $(e.target).parent().parent().find('.result .speed')
        $sr.html('')
        $sr.addClass('disabled')
        let $sb = $(e.target).parent().parent().find('#speed')
        $sb.empty()
        $sb.addClass('disabled')
        $sb.removeClass('fa-bolt')
        $sb.html('<span class="spinner-border spinner-border-sm me-3" role="status" aria-hidden="true"></span>')
        reqLineSpeed($(e.target).parent().parent().find('#name').text())
    })
    updateLineListSelected(lineName.text())
})

onGetLinePing(function (args) {
    if ($('#lineModal').css('display') !== 'block') {
        return;
    }
    $('.line-list li').each(function () {
        if ($(this).find('.name').text() === args['name']) {
            $(this).find('.ping').removeClass('disabled')
            $(this).find('.req .ping').css('display', 'none')
            $(this).find('.result .ping').css('display', 'block')
            $(this).find('.result .speed').css('display', 'block')
            $(this).find('.result .ping').html(formatDelay(args['delay']))
        }
    })
})

onGetLineSpeed(function (args) {
    if ($('#lineModal').css('display') !== 'block') {
        return;
    }
    $('.line-list li').each(function () {
        if ($(this).find('.name').text() === args['name']) {
            $(this).find('.speed').removeClass('disabled')
            $(this).find('.req .speed').empty()
            $(this).find('.result .speed').css('display', 'block')
            $(this).find('.result .speed').html(formatDelay(args['delay']))
        }
    })
})

onConnectedChanged(function (args) {
    if (args[1]) alertErr(args[1])
    let connect = args[0]
    connectChanged(connect)
    if (!connect) $('.left .btm .traffic').hide()
    else {
        $('.left .btm .traffic').show()
        $('.left .btm .traffic .up').html(` 0.00 KB`)
        $('.left .btm .traffic .down').html(` 0.00 KB`)
    }
})

onGetTraffic(data => {
    $('.left .btm .traffic .up').html(` ${formatTraffic2(data['up']).join(' ')}`)
    $('.left .btm .traffic .down').html(` ${formatTraffic2(data['down']).join(' ')}`)
})

onGetCheckIn(function (args, err) {
    hideLoading()
    if (err) {
        alertErr(err)
        return
    }
    $('#checkin a').addClass('disabled')
    alertSuccess(args)
})

let trafficLogsPageLoading = $('#trafficLogsModal .loadingPage')
let trafficLogsPageErr = $('#trafficLogsModal .errPage')
let trafficLogsPageContent = $('#trafficLogsModal .scrollable')

let trafficLogsLoading = () => {
    trafficLogsPageLoading.show()
    trafficLogsPageErr.hide()
    trafficLogsPageContent.hide()
    reqTrafficLogs()
}
$('#trafficLogsModal .errPage .btn').click(() => trafficLogsLoading())
$('#trafficLogsModal .btnRefresh').click(() => trafficLogsLoading())
onGetTrafficLogs(function (data) {
    trafficLogsPageLoading.hide()
    if (data[1]) {
        trafficLogsPageErr.show()
        trafficLogsPageContent.hide()
        return
    }
    trafficLogsPageErr.hide()
    trafficLogsPageContent.show()

    let _in = data[0]

    let $logs = $('#trafficLogsModal .logs-list ul')
    $logs.empty()
    for (let item of _in) {
        $logs.append(`<li><div class="item"><p class="date">${item.date}</p><p class="up">${formatTraffic(item.u / 1024)}</p><p class="down">${formatTraffic(item.d / 1024)}</p><p class="rate">${item['server_rate']}</p><p class="total">${formatTraffic((item.u + item.d) / 1024)}</p></div></li>`)
    }
})

let invitePageLoading = $('#affModal .loadingPage')
let invitePageErr = $('#affModal .errPage')
let invitePageContent = $('#affModal .scrollable')
let inviteLoading = () => {
    invitePageLoading.show()
    invitePageErr.hide()
    invitePageContent.hide()
    reqInvite()
}
$('#affModal .errPage .btn').click(() => inviteLoading())
$('#affModal .btnRefresh').click(() => inviteLoading())

onGetInvite((data) => {
    invitePageLoading.hide()
    if (data[1]) {
        invitePageErr.show()
        invitePageContent.hide()
        return
    }
    invitePageErr.hide()
    invitePageContent.show()
    let _in = data[0]
    if (isV2b()) {
        $('#affModalContent .desc').html(string('affDescV2b').replace('aaa', `${_in['inviteNum']}`).replace('bbb', `${_in['backRate']}%`).replace('ccc', _in['backSum']))
        let $curr = $('#affModalContent .curr')
        $curr.show()
        $curr.html(`
            <div><p>${string('affCurr').replace('aaa', _in['backCurr'])}</p> 
                <div class="copy">
                    <a class="btn btn-sm btn-danger me-2" data-mdb-toggle="modal" data-mdb-target="#affTransferModal">
                        <i class="fa fa-money-bill-transfer">&nbsp;&nbsp;</i>${string('affTransfer')}
                    </a>
                    <a class="btn btn-sm btn-dark" data-mdb-toggle="modal" data-mdb-target="#affWithdrawModal">
                        <i class="fa fa-sack-dollar">&nbsp;&nbsp;</i>${string('affWithdraw')}
                    </a>
                </div>
            </div>
        `)
        $('#affTransferModalContent .curr').html(`<p>${string('affCurr').replace('aaa', _in['backCurr'])}</p> `)
        $('#affWithdrawModalContent .curr').html(`<p>${string('affCurr').replace('aaa', _in['backCurr'])}</p> `)
    } else
        $('#affModalContent .desc').html(string('affDesc').replace('bbb', `${_in['backRate']}%`).replace('ccc', _in['backSum']))
    let $codes = $('#affModalContent .code-list ul')
    $codes.empty()
    for (let item of _in.code) {
        $codes.append(`
            <li><div><p>${item}</p> 
                <div class="copy">
                    <a class="btn btn-sm btn-info me-2"><i class="fa fa-copy">&nbsp;&nbsp;</i>${string('affCopyLink')}</a>
                    <a class="btn btn-sm btn-warning"><i class="fa fa-copy">&nbsp;&nbsp;</i>${string('affCopy')}</a>
                </div>
            </div></li>
        `)
    }
    let copy = (e, link = false) => {
        let code = $(e.target).parent().parent().find('p').html() || $(e.target).parent().parent().parent().find('p').html()
        navigator.clipboard.writeText(`${link ? _in.host : ''}${code}`)
        alertSuccess(string('affCopied'))
    }
    $('#affModalContent .code-list ul .btn-info').click(e => copy(e, true))
    $('#affModalContent .code-list ul .btn-warning').click(e => copy(e))
    let $backs = $('#affModalContent .back-list ul')
    $backs.empty()
    for (let item of _in.backList) {
        $backs.append(`<li><div class="item"><p class="id">${item.id}</p><p class="money">${item.back}</p><p class="date">${item.time}</p></div></li>`)
    }

    // 提现按钮
    $('#affTransferModal .modal-footer a').off('click').click(() => {
        btnLoading($('#affTransferModal .modal-footer a'))
        reqInviteBackTransfer($('#transferInput').val())
    })
})

onGetInviteBackConfig((data) => {
    if (data[1] || data[0]['withdraw_close'] !== 0 || !data[0]['withdraw_methods']) {
        $('#affWithdrawModal').modal('hide')
        alertErr(string('affWithdrawClosed'))
        return
    }

    let $methodGroup = $('#affWithdrawModalContent .methodGroup')
    $methodGroup.empty()
    data[0]['withdraw_methods'].forEach((item, index) => {
        $methodGroup.append('<div class="form-check form-check-inline"> ' +
            `<input class="form-check-input" type="radio" name="radioWithdrawMethod" id="rwm${index}" value="${item}"/>` +
            `<label class="form-check-label" for="rwm${index}">${item}</label></div>`)
    })
    $methodGroup.find('input:first').attr('checked', true)
    $('#affWithdrawModal .modal-footer a').off('click').click(() => {
        btnLoading($('#affWithdrawModal .modal-footer a'))
        reqInviteBackWithdraw($('#withdrawInput').val(), $('#affWithdrawModalContent .methodGroup input:radio:checked').val())
    })
})

onGetInviteBackTransfer((data) => {
    btnRecoverAll()
    if (data[1]) {
        alertErr(data[1])
        return
    }
    alertSuccess(string('optionSuccess'))
    $('#affTransferModal').modal('hide')
    reqInvite()
})

onGetInviteBackWithdraw((data) => {
    btnRecoverAll()
    if (data[1]) {
        alertErr(data[1])
        return
    }
    alertSuccess(string('optionSuccess'))
    $affWithdrawModal.modal('hide')
})

let storePageLoading = $('#tab-store .loadingPage')
let storePageErr = $('#tab-store .errPage')
let storePageContent = $('#tab-store .scrollable')
let storeLoading = () => {
    storePageLoading.show()
    storePageErr.hide()
    storePageContent.hide()
}
storeLoading()
$('#tab-store .errPage .btn').click(() => {
    storeLoading()
    reqStore()
})
onGetStoreList(function (args) {
    if (args[1]) {
        storePageLoading.hide()
        storePageErr.show()
        storePageContent.hide()
        return
    }
    storePageLoading.hide()
    storePageErr.hide()
    storePageContent.show()

    if (getMalioStore()) return;

    let target = $('#tab-store .grid')
    target.empty()
    for (let item of args[0]) {
        let data = `<div class="grid-item"><div class="card"><input class="planId" type="hidden" value="${item.id}"/>` +
            `<h6 class="planName">${item.name}</h6><p class="planPrice">￥${item.price}</p><div class="planDesc">`
        if (item.extra) {
            for (let e of item.extra) {
                data += '<div class="planDescItem">'
                let icon = e['icon'];
                if (icon) {
                    let bg = '';
                    if (['clear', 'close'].indexOf(icon) >= 0) {
                        bg = ' bg-danger '
                        icon = 'times'
                    }
                    data += `<div class="planDescItemIcon ${bg}"><i class="fas fa-${icon}"></i></div>`
                }
                data += e['content']
                data += '</div>'
            }
        }

        data += `</div><button class="btn btn-primary" onclick=onPurchaseStore(this);>${string('storePurchase')}</button></div></div>`
        let $data = $(data)
        target.append($data)
        planGrid.masonry('appended', $data).masonry()
    }
})

let getMalioStore = () => {
    if (!(getAdditional() && isMalioPlan() && malioReady())) {
        return false
    }
    let target = $('#tab-store .grid')
    target.empty()

    // free plan
    if (malioFree() && userLevel === -1) {
        let _store = getStoreList(malioFree())
        let data = `<div class="grid-item" id="malioFree" style="display: none"><div class="card"><input class="planId" type="hidden" value="${malioFree()}"/>` +
            `<h6 class="planName">${string('storeTrial')}</h6><p class="planPrice">${string('storeTrialPrice')}</p><div class="planDesc">`
        if (_store.extra) {
            for (let e of _store.extra) {
                data += '<div class="planDescItem">'
                let icon = e['icon'];
                if (icon) {
                    let bg = '';
                    if (['clear', 'close'].indexOf(icon) >= 0) {
                        bg = ' bg-danger '
                        icon = 'times'
                    }
                    data += `<div class="planDescItemIcon ${bg}"><i class="fas fa-${icon}"></i></div>`
                }
                data += e['content']
                data += '</div>'
            }
        }
        data += `</div><button class="btn btn-primary" onclick="createOrder(-1, this);">${string('storePurchaseNow')}</button></div></div>`
        let $data = $(data)
        target.append($data)
        planGrid.masonry('appended', $data).masonry()
    }

    for (let item of malioPlansInfo()) {
        let data = `<div class="grid-item"><div class="card"><input class="planId" type="hidden" value="${item.id}"/>` +
            `<h6 class="planName">${item.name}</h6><p class="planPrice">${item.currency}${item.price}</p><div class="planDesc">`
        if (item.features) {
            for (let e of item.features) {
                data += '<div class="planDescItem">'
                let bg = e['support'] ? 'bg-success' : 'bg-danger'
                let icon = e['support'] ? 'check' : 'times'
                data += `<div class="planDescItemIcon ${bg}"><i class="fas fa-${icon}"></i></div>`
                data += e['name']
                data += '</div>'
            }
        }

        data += `</div><button class="btn btn-primary" onclick=onPurchaseStore(this);>${string('storePurchase')}</button></div></div>`
        let $data = $(data)
        target.append($data)
        planGrid.masonry('appended', $data).masonry()
    }
    return true
}

onGetPromo(function (args) {
    btnRecoverAll()
    if (args[1]) {
        alertErr(args[1])
        return
    }
    updateOrderDesc()
})

onGetBalance(function (args) {
    $('#balanceValue').html(args)
    updateOrderDesc()
})

onGetOrder(function (args) {
    let status = args[0]
    switch (status) {
        case -1:
            alertErr(args[1])
            btnRecoverAll()
            break
        case 1:
            break
        case 2:
            $('#orderModal').modal('hide')
            $('#orderV2bModal').modal('hide')
            $('#orderMalioModal').modal('hide')
            $('#rechargeModal').modal('hide')
            alertSuccess(string('orderPaySuccess'))
            btnRecoverAll()
            break
    }
})

/******************** 监听事件OVER ********************/
/******************** 监听事件OVER ********************/
/******************** 监听事件OVER ********************/

let settingsModal = $('#settingModal')
settingsModal.on('show.bs.modal', () => reqSettings())
settingsModal.on('hide.bs.modal', () => saveSettings({
    route: $('#settingModal .route .mode .radio input:radio:checked').val(),
    tap: $switchTap.prop('checked'),
    tun: $switchTun.prop('checked'),
}))

let proxyShareModal = $('#proxyShareModal')
proxyShareModal.on('show.bs.modal', () => reqProxyShare())

let lineName = $('#line-name');
lineName.html(string('line_loading'))
let lineFlag = $('#line-flag')
const connects = [$('#connect'), $('#disconnect')]
let interval = null
let planGrid = $('#planGrid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 225
})

let orderModal = $('#orderModal')
orderModal.on('hide.bs.modal', function () {
    $('#orderModalPromo').val('')
    clearPromo()
})

let orderV2bModal = $('#orderV2bModal')
orderV2bModal.on('hide.bs.modal', function () {
    $('#orderV2bModalPromo').val('')
    clearPromo()
})

let orderMalioModal = $('#orderMalioModal')
orderMalioModal.on('hide.bs.modal', function () {
    $('#orderMalioModalModalPromo').val('')
    clearPromo()
})

$('#rechargeModal').on('show.bs.modal', () => updateRecharge())
$('#affModal').on('show.bs.modal', () => reqInvite())
let $affWithdrawModal = $('#affWithdrawModal')
$affWithdrawModal.on('show.bs.modal', () => reqInviteBackConfig())
$affWithdrawModal.on('hide.bs.modal', () => btnRecoverAll())
$('#trafficLogsModal').on('show.bs.modal', () => reqTrafficLogs())

/**
 *  Update Line UI
 *  @param line selected line
 */
function updateLineUI(line) {
    lineName.html(line['name'])
    lineFlag.attr('src', getFlagRes(line['flag']))
}

/**
 * Update Line list select
 * @param name selected line's name
 */
function updateLineListSelected(name) {
    let active = $('#lineModal .modal-body ul li.active')
    if (active) {
        active.removeClass("active")
    }
    $('#lineModal .modal-body ul li').each(function () {
        if ($(this).find('.name').text() === name) {
            $(this).addClass('active')
        }
    })
}

function connectChanged(connect) {
    const timer = $('#connectTime')
    if (connect) {
        let sec = function () {
            return new Date().getTime() / 1000;
        }
        let start = sec();
        connects[0].hide()
        connects[1].show()
        $('#select1').hide()
        $('#select2').show()
        timer.show()
        interval = setInterval(() => $('#connectTime').html(formatConnectTime(sec() - start)), 1000)
    } else {
        clearInterval(interval)
        connects[1].hide()
        connects[0].show()
        $('#select1').show()
        $('#select2').hide()
        timer.hide()
        timer.html("00:00:00")
    }
}

connectChanged(false)
updateLineListSelected('')

/**
 * On store plan item click, then show store Modal
 * @param event the store plan button event.
 */
function onPurchaseStore(event) {

    function post(input) {
        checkValidate(input, () => {
            console.log("promo 111")
            btnLoading($('.modal .promoGroup .promoCheck a'))
            reqPromo(input.val())
        })
    }

    $('.modal .promoGroup .promoCheck a').off('click').on('click', e => {
        let input = $(e.target).parent().parent().find('input')
        post(input)
    })

    $('.modal .promoGroup .promoCheck a i').off('click').on('click', e => {
        let input = $(e.target).parent().parent().parent().find('input')
        post(input)
    })

    let defaultOrder = () => {
        selectStore($(event).parent().find('.planId').val())
        $('#orderModalContentItems').html($(event).parent().find('.planDescItem').clone())
        $('#orderModalLabel').html($(event).parent().find('.planName').text())
        orderModal.modal('show')
    }
    switch (parseInt(getRemoteConfig('target'))) {
        case 1:
            selectStore($(event).parent().find('.planId').val())
            $('#orderV2bModalContentItems').html($(event).parent().find('.planDescItem').clone())
            $('#orderV2bModalLabel').html($(event).parent().find('.planName').text())
            orderV2bModal.modal('show')
            updateOrderV2bCycle()
            break
        case 2:
            if (isMalioPlan()) {
                malioPlansSelect($(event).parent().find('.planId').val())
                $('#orderMalioModalContentItems').html($(event).parent().find('.planDescItem').clone())
                $('#orderMalioModalLabel').html($(event).parent().find('.planName').text())
                orderMalioModal.modal('show')
                updateOrderMalioCycle()
            } else {
                defaultOrder()
            }
            break
        default:
            defaultOrder()
            break
    }

    reqBalance()
    updateOrderDesc()
}

function onTrafficReset() {
    let plan = getUser().plan
    selectStore(plan?.id)
    $('#trafficResetModalLabel').html(plan?.name)
    $('#trafficResetModalContentItems').html($(`#tab-store .grid input[value=${plan?.id}]`).parent().find('.planDescItem').clone())
    $('#trafficResetModal').modal('show')

    let $cycleTraffic = $('#trafficResetModal .cycleGroup')
    $cycleTraffic.empty()
    $cycleTraffic.append('<div class="form-check form-check-inline"> ' +
        '<input class="form-check-input" type="radio" name="radioV2b" id="rreset_price" value="' + CYCLE_RESET_TRAFFIC + '"/>' +
        '<label class="form-check-label" for="rreset_price">' + string('resetTraffic') + '</label></div>')
    $cycleTraffic.find('input:first').attr('checked', true)
    selectCycle(CYCLE_RESET_TRAFFIC)
    updateOrderDesc()
}

function createOrder(payType, event, recharge = false) {
    let req = function () {
        btnLoading(event)
        reqStoreOrder(payType, recharge, recharge ? $('#rechargeModal input').val() : 0)
    }
    if (recharge) {
        checkValidate($('#rechargeInput'), req)
    } else {
        req()
    }
}

function updateRecharge() {
    let $recharge = $('.modal .recharge')
    $recharge.empty()
    for (let item of getPayTypes()) {
        switch (item) {
            case 0:
                $recharge.append('<a href="#" onclick="createOrder(0, this, true)" class="btn btn-icon icon-left btn-primary"><i class="fas fa-shopping-bag"></i>'
                    + string('orderPurchaseCustom') + '</a>')
                break
            case 1:
                $recharge.append('<a href="#" onclick="createOrder(1, this, true)" class="btn btn-icon icon-left btn-info"><i class="fab fa-alipay"></i>'
                    + string('orderPurchaseAlipay') + '</a>')
                break
            case 2:
                $recharge.append('<a href="#" onclick="createOrder(2, this, true)" class="btn btn-icon icon-left btn-success"><i class="fab fa-weixin"></i>'
                    + string('orderPurchaseWechat') + '</a>')
                break
            case 3:
                $recharge.append('<a href="#" onclick="createOrder(3, this, true)" class="btn btn-icon icon-left btn-warning"><i class="fab fa-btc"></i>'
                    + string('orderPurchaseCrypto') + '</a>')
                break
        }
    }

    $('.modal #rechargeModalContent h6').html(string('userBalance') + ':&nbsp;' + getBalance())
    $('.modal #rechargeModalContent input').val('')
    $('.modal #rechargeModalContent input').removeClass('active')
}

function updateOrderV2bCycle() {
    let $cycleGroup = $('#orderV2bModal .cycleGroup')
    $cycleGroup.empty()
    let cycle = getStore().cycle;
    if (cycle) {
        for (let item of cycle) {
            if (item['display'] && item['display'] === 'none') continue
            $cycleGroup.append('<div class="form-check form-check-inline"> ' +
                '<input class="form-check-input" type="radio" name="radioV2b" id="r' + item.value + '" value="' + item.value + '"/>' +
                '<label class="form-check-label" for="r' + item.value + '">' + item.name + '</label></div>')
        }
        $cycleGroup.find('input:first').attr('checked', true)
        let onChecked = (val) => {
            selectCycle(val)
            updateOrderDesc()
        }
        $cycleGroup.find('input').click(e => onChecked($(e.target).val()))
        onChecked(cycle[0].value)
    }
}

let updateOrderMalioCycle = () => {
    let $cycleGroup = $('#orderMalioModal .cycleGroup')
    $cycleGroup.empty()
    let cycle = malioPlanCycle(getStoreList)
    if (cycle) {
        for (let item of cycle) {
            $cycleGroup.append('<div class="form-check form-check-inline"> ' +
                `<input class="form-check-input" type="radio" name="radioMalio" id="r${item.plan.id}" value="${item.plan.id}"/>` +
                `<label class="form-check-label" for="r${item.plan.id}">${item.name}</label></div>`)
        }
        $cycleGroup.find('input:first').attr('checked', true)
        let onChecked = (val) => {
            selectStore(val)
            updateOrderDesc()
        }
        $cycleGroup.find('input').click(e => onChecked($(e.target).val()))
        onChecked(cycle[0].plan.id)
    }
}

function updateOrderDesc() {
    // Update purchaseTypes Buttons
    let $purchase = $('.modal .purchase')
    $purchase.empty()

    for (let item of getPayTypes()) {
        switch (item) {
            case 0:
                $purchase.append('<a href="#" onclick="createOrder(0, this)" class="btn btn-icon icon-left btn-primary"><i class="fas fa-shopping-bag"></i>'
                    + string('orderPurchaseCustom') + '</a>')
                break
            case 1:
                $purchase.append('<a href="#" onclick="createOrder(1, this)" class="btn btn-icon icon-left btn-info"><i class="fab fa-alipay"></i>'
                    + string('orderPurchaseAlipay') + '</a>')
                break
            case 2:
                $purchase.append('<a href="#" onclick="createOrder(2, this)" class="btn btn-icon icon-left btn-success"><i class="fab fa-weixin"></i>'
                    + string('orderPurchaseWechat') + '</a>')
                break
            case 3:
                $purchase.append('<a href="#" onclick="createOrder(3, this)" class="btn btn-icon icon-left btn-warning"><i class="fab fa-btc"></i>'
                    + string('orderPurchaseCrypto') + '</a>')
                break
            default:
                $purchase.append(`<a href="#" onclick="createOrder('${item.method ? item.method : item.id}', this)" class="btn btn-icon icon-left btn-info">` +
                    `<i class="fas fa-shopping-bag"></i>${item.name}</a>`)
                break
        }
    }

    // Update price desc
    let info = getPriceDesc()
    let $purchaseDesc = $('.modal .priceDesc')
    $purchaseDesc.empty()
    $purchaseDesc.append('<div class="priceItem">' + string('orderPrice') + info.price + '</div>')
    if (info.discount > 0) {
        $purchaseDesc.append('<div class="priceItem text-danger">' + string('orderPricePromo') + '-' + info.discount + '</div>')
    }
    if (info.balance > 0) {
        $purchaseDesc.append('<div class="priceItem text-danger">' + string('orderPriceBal') + '-' + info.balance + '</div>')
    }
    $purchaseDesc.append('<div class="priceItem text-success">' + string('orderPriceAmount') + info.amount + '</div>')
    if (info.amount <= 0) {
        $purchase.prepend('<a href="#" onclick="createOrder(-1, this)" class="btn btn-icon icon-left btn-secondary"><i class="fas fa-piggy-bank"></i>'
            + string('orderPurchaseBal') + '</a>')
    }
}

$(document).ready(function () {
    reqMainShow()
    reqConfig()
    reqAdditional()
    reqNotice()
    reqStore()
})
