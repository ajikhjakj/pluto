// 获取
// 获取当前项目的package.json文件
 
// 打印package.json中的内容
 
// 访问特定的字段，例如版本号
strings = {
    appName: {
        zh: "X云加速pluto", 'zh-TW': 'X云加速pluto', en: "X云加速pluto", ru: "X云加速pluto"
    },
    unknownErr: {
        zh: '未知错误', 'zh-TW': '未知錯誤', en: 'Unknow error', ru: 'Неизвестная ошибка'
    },
    permissionErr: {
        zh: '<b>程序无法获取读写配置文件权限。</b><br>请"以管理员权限"重新运行程序，或卸载并重新安装到其他文件夹！',
        'zh-TW': '<b>程序無法獲取讀寫配置文件權限。 </b><br>請"以管理員權限"重新運行程序，或卸載並重新安裝到其他文件夾!',
        en: "<b> You don't have enough permissions to assign this yaml profile. Please run as Administrator or unistall our program and reinstall in the different folder！",
        ru: '<b>Программа не может получить разрешение на чтение или запись файла конфигурации. </b><br> Пожалуйста, запустите программу заново "с правами администратора" или удалите и заново установите ее в другую папку!'
    },
    coreErr: {
        zh: '<b>内核启动失败<b><br>',
        'zh-TW': '<b>內核啟動失敗<b><br>', en: '<b>Fail to start v2ray-core <b><br>', ru: '<b>Сбой загрузки ядра<b><br>'
    },
    configErr: {
        zh: '<b>配置加载失败，请重启应用再次尝试！<b><br>',
        'zh-TW': '<b>配置載入失敗，請重啓應用再次嘗試！<b><br>',
        en: '<b>Fail to load config, please restart app. <b><br>',
        ru: '<b>Fail to load config, please restart app.<b><br>'
    },
    pageErr: {
        zh: '加载出错，点击重试',
        'zh-TW': '加載出錯，點擊重試', en: 'Loading failed. Tap to retry', ru: 'Ошибка загрузки, нажмите повторить'
    },
    pageRetry: {
        zh: '重试',
        'zh-TW': '重試', en: 'Retry', ru: 'Повторная попытка'
    },
    optionSuccess: {zh: '操作成功', 'zh-TW': '操作成功', en: 'Done', ru: 'Done'},
    menuQuit: {
        zh: '退出',
        'zh-TW': '退出', en: 'Quit', ru: 'Вывод средств'
    },
    menuTipsConnected: {
        zh: '已连接至：',
        'zh-TW': '已連接至：', en: 'Connected to:', ru: 'Подключен к：'
    },
    menuOpenAtLogin: {
        zh: '开机自启',
        'zh-TW': '開機自啟', en: 'Run at startup ', ru: 'Самозагружающийся'
    },
    menuClearConfig: {
        zh: '清除配置并重启',
        'zh-TW': '清除配置並重啟', en: 'Clear config and reboot', ru: 'Очистить конфигурацию и перезагрузиться'
    },
    setting: {
        zh: '设置',
        'zh-TW': '設置', en: 'Settings', ru: 'Настройки'
    },
    settingRoute: {
        zh: '路由设置',
        'zh-TW': '路由設置', en: 'Route settings', ru: 'Настройки маршрутизации'
    },
    settingRouteMode: {
        zh: '路由模式',
        'zh-TW': '路由模式', en: 'Route mode', ru: 'Режим маршрутизации'
    },
    settingTap: {
        zh: 'Tap Device',
        'zh-TW': 'Tap Device', en: 'Tap Device', ru: 'Tap Device'
    },
    settingTapHint: {
        zh: `开启<b>Tap Device</b>可以将您的数据由“Pluto”代理。<br>该操作可能需要安装一个虚拟网卡，如有窗口弹出，请一直点击<b>“下一步”</b>直至窗口消失`,
        'zh-TW': `開啟<b>Tap Device</b>可以將您的數據由“Xray-S”代理。 <br>該操作可能需要安裝一個虛擬網卡，如有窗口彈出，請一直點擊<b>“下一步”</b>直至窗口消失`,
        en: `Open<b>Tap Device</b>Your data will be routed by "Xray-S".<br> This action may require installing a virtual network adapter.If the installation box pops up<b>“Next step”</b>keep clicking Next untill the installation is completed.`,
        ru: `Откройте <b>Устройство прослушивания</b> Ваши данные будут направлены через "Xray-S".<br>Если в окне установки появится надпись<b>"Следующий шаг"</b>, продолжайте нажимать кнопку Next до тех пор, пока установка не будет завершена.`
    },
    settingTun: {
        zh: 'TUN代理模式',
        'zh-TW': 'TUN代理模式', en: 'TUN proxy mode', ru: 'TUNПрокси-модель'
    },
    settingTunHint: {
        zh: `开启TUN代理后，本地数据将由“Pluto”代理。在您<b>连接</b>和<b>断开</b>时，请允许我们对您计算机网络设备的更改！`,
        'zh-TW': `開啟TUN代理後，本地數據將由“Xray-S”代理。在您<b>連接</b>和<b>斷開</b>時，請允許我們對您計算機網絡設備的更改!`,
        en: ` Xray-S will route your data after enabling TUN Mode.When you<b>Connect </b>And<b>Disconnect</b>,Please allow us to make changes to your computer network equipment!`,
        ru: `Когда прокси TUN включен, локальные данные будут проксироваться "Xray-S". Когда При<b>подключении</b>и<b>отключении</b>,Пожалуйста, разрешите нам внести изменения в оборудование вашей компьютерной сети!`
    },
    settingTunFix: {
        zh: '修复',
        'zh-TW': '修復', en: 'Fix', ru: 'Исправить'
    },
    settingAbout: {
        zh: '关于',
        'zh-TW': '關於', en: 'About', ru: 'О сайте'
    },
    settingAboutVersion: {
        zh: '版本',
        'zh-TW': '版本', en: 'Version', ru: 'Версия'
    },
    proxyShare: {
        zh: '代理共享',
        'zh-TW': '代理共享', en: 'Proxies Sharing', ru: 'Совместное использование прокси'
    },
    proxyShareHost: {
        zh: '主机名',
        'zh-TW': '主機名', en: 'Local host', ru: 'Локальный хост'
    },
    proxySharePort: {
        zh: '端口',
        'zh-TW': '端口', en: 'Port', ru: 'Порт'
    },
    proxyShareTips: {
        zh: '通过局域网或者热点共享代理给其他设备使用,并手动配置代理主机名和端口如下：',
        'zh-TW': '通過局域網或者熱點共享代理給其他設備使用,並手動配置代理主機名和端口如下：',
        en: 'Share proxies to other deivces via LAN or hotspot. Manually configure Local host and port：',
        ru: 'Предоставление общего доступа к прокси другим устройствам через локальную сеть или точку доступа. Вручную настройте локальный хост и порт：'
    },
    invadeInput: {
        zh: '无效的输入',
        'zh-TW': '無效的輸入', en: 'Invalid input ', ru: 'Неверный ввод '
    },
    wel: {
        zh: '欢迎使用',
        'zh-TW': '歡迎使用', en: 'Welcome', ru: 'Welcome'
    },
    init: {
        zh: '初始化配置中...',
        'zh-TW': '初始化配置中...',
        en: 'Initializing the configuration......',
        ru: 'Инициализация конфигурации......'
    },
    confirm: {zh: '确认', 'zh-TW': '確認', en: 'Confirm', ru: 'Подтвердить'},
    cancel: {zh: '取消', 'zh-TW': '取消', en: 'Cancel', ru: 'Отмена'},
    nickname: {zh: "昵称", 'zh-TW': "暱稱", en: "Nickname", ru: "Никнейм"},
    email: {zh: "邮箱", 'zh-TW': "郵箱", en: "Email", ru: "Email"},
    password: {zh: "密码", 'zh-TW': "密碼", en: "Password", ru: "Пароль"},
    _2step: {
        zh: "两步验证码(未设置忽略)",
        'zh-TW': "兩步驗證碼(未設置忽略)",
        en: "2-step verification(Not set to ignore)",
        ru: "Двухэтапная проверка (не задано игнорировать)"
    },
    emailCode: {zh: "验证码", 'zh-TW': "驗證碼", en: "Verification code", ru: "Код верификации"},
    emailCodeSend: {
        zh: '发送验证码',
        'zh-TW': '發送驗證碼',
        en: 'Get verification codes',
        ru: 'Получить коды верификации'
    },
    invite_l: {
        zh: '邀请码（非必填）',
        'zh-TW': '邀請碼（非必填）',
        en: 'Invitation code (Optional)',
        ru: 'Код приглашения (необязательно)'
    },
    forget: {zh: "找回密码", 'zh-TW': "找回密碼", en: "Reset password", ru: "Сбросить пароль"},
    forget_l: {zh: "忘记密码?", 'zh-TW': "忘記密碼?", en: "Forget password?", ru: "Забыли пароль?"},
    forget_login: {zh: '返回登录页', 'zh-TW': '返回登錄頁', en: 'Back to login', ru: 'Вернуться к логину'},
    forget_success_1: {
        zh: '密码重置成功，点击确认按钮跳转登陆页面',
        'zh-TW': '密碼重置成功，點擊確認按鈕跳轉登陸頁面',
        en: 'The password is reset successfully, click the button to back to login.',
        ru: 'Пароль успешно сброшен, нажмите кнопку, чтобы вернуться к входу в систему'
    },
    login: {zh: "登录", 'zh-TW': "登錄", en: "Login", ru: "Вход"},
    register: {zh: "注册", 'zh-TW': "註冊", en: "Register", ru: "Регистрация"},
    register_l: {
        zh: "还没有账号？现在注册",
        'zh-TW': "還沒有賬號？現在註冊",
        en: "No account yet? Register now",
        ru: "Еще нет аккаунта? Зарегистрируйтесь сейчас"
    },
    register_login: {zh: "返回登录", 'zh-TW': "返回登錄", en: "Back to login", ru: "Вернуться к регистрации"},
    m_main: {zh: '首页', 'zh-TW': '首頁', en: 'Home', ru: 'Главная страница'},
    m_store: {zh: '商城', 'zh-TW': '商城', en: 'Store', ru: 'Магазин'},
    m_mine: {zh: '我的', 'zh-TW': '我的', en: 'My', ru: 'Мой'},
    line_none: {
        zh: '无可用线路，请先升级套餐',
        'zh-TW': '無可用線路，請先升級套餐',
        en: 'No proxies available, please purchase the subscription',
        ru: 'Нет доступных прокси, пожалуйста, приобретите подписку'
    },
    line_none_select: {
        zh: '请先选择线路',
        'zh-TW': '請先選擇線路',
        en: 'Please select the proxy',
        ru: 'Пожалуйста, выберите прокси'
    },
    line_none_tap: {
        zh: '请先升级套餐',
        'zh-TW': '請-rTW先升級套餐',
        en: 'Please upgrade your subscription',
        ru: 'Пожалуйста, обновите подписку'
    },
    line_loading: {
        zh: '线路加载中...',
        'zh-TW': '綫路載入中...',
        en: 'Loading Lines...',
        ru: 'Пожалуйста, обновите подписку'
    },
    connect: {zh: '连接', 'zh-TW': '連接', en: 'Connect', ru: 'Подключайтесь'},
    disconnect: {zh: '断开', 'zh-TW': '斷開', en: 'Disconnect', ru: 'Отключить'},
    connect_auto: {zh: '智能', 'zh-TW': '智能', en: 'Auto', ru: 'Авто'},
    connect_global: {zh: '全局', 'zh-TW': '全局', en: 'Global', ru: 'Глобальный'},
    connect_close: {zh: '关闭', 'zh-TW': '關閉', en: 'Turn off', ru: 'Выключить'},
    connectNone: {
        zh: '请先选择线路',
        'zh-TW': '請先選擇線路',
        en: 'Please select proxy',
        ru: 'Пожалуйста, выберите прокси'
    },
    selectLine1: {zh: '选择线路', 'zh-TW': '選擇線路', en: 'Select proxy', ru: 'Выберите прокси'},
    selectLine2: {zh: '其他线路', 'zh-TW': '其他線路', en: 'Other proxies', ru: 'Другие прокси'},
    lineList: {zh: '线路列表', 'zh-TW': '線路列表', en: 'List', ru: 'Список'},
    userClassDay: {zh: '会员时长', 'zh-TW': '會員時長', en: 'Membership', ru: 'Членство'},
    userClassDayUnit: {zh: '天', 'zh-TW': '天', en: 'Days', ru: 'Дни'},
    userClassExpire: {zh: '到期时间：', 'zh-TW': '到期時間：', en: 'Expired date', ru: 'Дата истечения срока действия：'},
    userClassExpireTimeNone: {zh: '无', 'zh-TW': '無', en: 'None', ru: 'Нет'},
    userClassExpireTimeUnlimited: {zh: '不限时长', 'zh-TW': '不限時長', en: 'Unlimited', ru: 'Неограниченное'},
    userTrafficUsable: {zh: '剩余流量', 'zh-TW': '剩餘流量', en: 'Usage', ru: 'Остаточный поток'},
    userTrafficToday: {zh: '今日已用：', 'zh-TW': '今日已用：', en: 'Used today', ru: 'Используется сегодня：'},
    userTrafficTotal: {zh: '总流量：', 'zh-TW': '總流量：', en: 'Total traffic', ru: 'Весь трафик：'},
    userTrafficLog: {zh: '流量明细', 'zh-TW': '流量明細', en: 'Traffic Logs', ru: 'Traffic Logs'},
    userTrafficLogDate: {zh: '日期', 'zh-TW': '日期', en: 'Date', ru: 'Date'},
    userTrafficLogUp: {zh: '上行', 'zh-TW': '上行', en: 'Up', ru: 'Up'},
    userTrafficLogDown: {zh: '下行', 'zh-TW': '下行', en: 'Down', ru: 'Down'},
    userTrafficLogRate: {zh: '倍率', 'zh-TW': '倍率', en: 'Rate', ru: 'Rate'},
    userTrafficLogTotal: {zh: '总计', 'zh-TW': '總計', en: 'Total', ru: 'Total'},
    userBalance: {zh: '钱包余额', 'zh-TW': '錢包餘額', en: 'Wallet balance', ru: 'Баланс кошелька：'},
    userBalanceAff: {
        zh: '邀请返利可增加余额',
        'zh-TW': '邀請返利可增加餘額',
        en: 'Commission rate',
        ru: 'Размер комиссии'
    },
    userBalanceHint: {
        zh: '请输入充值金额',
        'zh-TW': '請輸入充值金額',
        en: 'Please enter the recharge amount',
        ru: 'Пожалуйста, введите сумму пополнения'
    },
    tips: {zh: '注意事项', 'zh-TW': '注意事項', en: 'Notes', ru: 'Предостережения'},
    userBalanceTips: {
        zh: '充值完成后需刷新以查看余额，通常一分钟内到账。 <br/>因余额不足而未能完成的自动续费，在余额足够时会自动划扣续费。',
        'zh-TW': '充值完成後需刷新以查看餘額，通常一分鐘內到賬。 <br/>因餘額不足而未能完成的自動續費，在餘額足夠時會自動劃扣續費。',
        en: 'Please refresh to check the balance after the recharge is completed, which is usually received within one minute. <br/>For automatic renewals that cannot be completed due to insufficient balance, the renewal fee will be automatically deducted when the balance is sufficient.',
        ru: 'Пожалуйста, обновите баланс после завершения пополнения, которое обычно происходит в течение одной минуты. <br/>Если вы не сможете завершить автоматическое продление из-за недостаточного баланса, с вас будет автоматически снята плата за продление, когда баланс будет достаточным.'
    },
    userVipExpireSoon: {
        zh: '您的套餐即将到期，请及时续费',
        'zh-TW': '您的套餐即將過期，請及時續費',
        en: 'Your plan is about to expire, please renew in time',
        ru: 'Срок действия вашего пакета истекает, пожалуйста, обновите вовремя'
    },
    userVipExpired: {
        zh: '您当前没有可用套餐或套餐已过期，请先开通或续费套餐',
        'zh-TW': '您當前沒有可用套餐或套餐已過期，請先開通或續費套餐',
        en: 'You currently have no available plan or the plan has expired, please open or renew the plan first!',
        ru: 'Ваша текущая подписка недоступна'
    },
    userTrafficOutSoon: {
        zh: '您的流量即将用尽，请及时重置流量或购买新套餐',
        'zh-TW': '您的流量即將用盡，請及時重置流量或購買新套餐',
        en: 'Your traffic is about to run out, please reset the traffic or buy a new plan in time',
        ru: 'Ваш трафик вот-вот закончится, пожалуйста, сбросьте трафик или купите новый пакет вовремя'
    },
    userTrafficOut: {
        zh: '您的流量已用尽，请先重置流量或购买新套餐',
        'zh-TW': '您的流量已用盡，請先重置流量或購買新套餐',
        en: 'Your traffic has been exhausted, please reset the traffic or buy a new plan',
        ru: 'Ваш трафик вот-вот закончится, пожалуйста, сбросьте трафик или купите новый пакет вовремя'
    },
    dailySign: {zh: '每日签到', 'zh-TW': '每日簽到', en: 'Daily Sign In', ru: 'Ежедневный вход в систему'},
    logout: {zh: '退出登录', 'zh-TW': '退出登錄', en: 'Log out', ru: 'Выйти из системы'},
    recharge: {zh: '余额充值', 'zh-TW': '餘額充值', en: 'Recharge balance', ru: 'Пополнить баланс'},
    resetTraffic: {zh: '重置流量', 'zh-TW': '重置流量', en: 'Reset Traffic', ru: 'Сбросить трафик'},
    renew: {zh: '套餐续订', 'zh-TW': '套餐續訂', en: 'Package renewal', ru: 'Продление подписки'},
    notice: {zh: '公告', 'zh-TW': '公告', en: 'Notice', ru: 'Циркуляры'},
    aff: {zh: '邀请返利', 'zh-TW': '邀請返利', en: 'Commission', ru: 'План комиссии'},
    affDesc: {
        zh: '返利比例：<font color="#999999">bbb</font>&nbsp;&nbsp;&nbsp;&nbsp;累计返利：<font color="#999999">ccc</font>',
        'zh-TW': '返利比例：<font color="#999999">bbb</font>&nbsp;&nbsp;&nbsp;&nbsp;累計返利：<font color="#999999">ccc</font>',
        en: 'Rebate Proportion：<font color="#999999">aaa</font>&nbsp;&nbsp;&nbsp;&nbsp;cumulative rebate：<font color="#999999">ccc</font>',
        ru: 'Пропорция возврата：<font color="#999999">bbb</font>&nbsp;&nbsp;&nbsp;&nbsp;совокупный возврат：<font color="#999999">ccc</font>'
    },
    affDescV2b: {
        zh: '注册人数：<font color="#999999">aaa</font>&nbsp;&nbsp;&nbsp;&nbsp;返利比例：<font color="#999999">bbb</font>&nbsp;&nbsp;&nbsp;&nbsp;累计返利：<font color="#999999">ccc</font>',
        'zh-TW': '註冊人數：<font color="#999999">aaa</font>&nbsp;&nbsp;&nbsp;&nbsp;返利比例：<font color="#999999">bbb</font>&nbsp;&nbsp;&nbsp;&nbsp;累計返利：<font color="#999999">ccc</font>',
        en: 'Registered：<font color="#999999">aaa</font>&nbsp;&nbsp;&nbsp;&nbsp;Rebate Proportion：<font color="#999999">aaa</font>&nbsp;&nbsp;&nbsp;&nbsp;cumulative rebate：<font color="#999999">ccc</font>',
        ru: 'Зарегистрировано：<font color="#999999">aaa</font>&nbsp;&nbsp;&nbsp;&nbsp;Пропорция возврата：<font color="#999999">bbb</font>&nbsp;&nbsp;&nbsp;&nbsp;совокупный возврат：<font color="#999999">ccc</font>'
    },
    affCurr: {
        zh: '剩余佣金：<font color="#999999">aaa</font>',
        'zh-TW': '剩餘佣金：<font color="#999999">aaa</font>',
        en: 'Usable: <font color="#999999">aaa</font>',
        ru: 'Usable: <font color="#999999">aaa</font>'
    },
    affTransfer: {zh: '划转', 'zh-TW': '劃轉', en: 'Transfer', ru: 'Transfer'},
    affTransferTip: {
        zh: '划转后的余额仅用于本站消费使用',
        'zh-TW': '劃轉後的餘額僅用於本站消費使用',
        en: 'The balance after the transfer is only used for consumption on this site',
        ru: 'The balance after the transfer is only used for consumption on this site'
    },
    affTransferInput: {
        zh: '请输入划转金额',
        'zh-TW': '請輸入劃轉金額',
        en: 'Input transfer amount',
        ru: 'Input transfer amount'
    },
    affWithdraw: {zh: '提现', 'zh-TW': '提現', en: 'Withdraw', ru: 'Withdraw'},
    affWithdrawClosed: {
        zh: '佣金提现暂未开放',
        'zh-TW': '佣金提現暫未開放',
        en: 'Withdraw not enable',
        ru: 'Withdraw not enable'
    },
    affWithdrawMethod: {zh: '提现方式', 'zh-TW': '提現方式', en: 'Withdraw Method', ru: 'Withdraw Method'},
    affWithdrawAccount: {zh: '提现账号', 'zh-TW': '提現賬號', en: 'Withdraw Account', ru: 'Withdraw Account'},
    affCode: {zh: '邀请码', 'zh-TW': '邀請碼', en: 'Invitation code', ru: 'Код приглашения'},
    affList: {zh: '返利列表', 'zh-TW': '返利列表', en: 'Rebate list', ru: 'Список комиссии'},
    affCopy: {zh: '复制邀请码', 'zh-TW': '複製邀請碼', en: 'Copy invitation code', ru: 'Копировать код приглашения'},
    affCopyLink: {zh: '复制链接', 'zh-TW': '複製鏈接', en: 'Copy link', ru: 'Копировать ссылку'},
    affCopied: {zh: '复制成功', 'zh-TW': '複製成功', en: 'Copy successfully', ru: 'Успешно скопировано'},
    affMoney: {zh: '金额', 'zh-TW': '金額', en: 'Amount', ru: 'Сумма'},
    affDate: {zh: '日期', 'zh-TW': '日期', en: 'Date', ru: 'Дата'},
    about: {zh: '关于', 'zh-TW': '關於', en: 'About', ru: 'О сайте'},
    aboutSupport: {zh: '支持我们', 'zh-TW': '支持我們', en: 'Support us', ru: 'Поддержите нас'},
    aboutSupportSec: {
        zh: "您的支持就是我们最大的动力！",
        'zh-TW': "您的支持就是我們最大的動力！",
        en: "Your support is our greatest motivation!",
        ru: "Ваша поддержка - наша самая" +
            " большая мотивация!"
    },
    aboutSupportShare: {zh: '分享', 'zh-TW': '分享', en: 'Share', ru: 'Поделиться',},
    aboutContact: {zh: "联系我们", 'zh-TW': "聯繫我們", en: "Contact us", ru: "Свяжитесь с нами"},
    aboutContactSec: {
        zh: "若有任何问题、建议，请联系我们",
        'zh-TW': "若有任何問題、建議，請聯繫我們",
        en: "Please contact us if you have any questions or suggestions",
        ru: "Пожалуйста, свяжитесь с нами, если у вас есть вопросы или предложения"
    },
    aboutContactEmail: {zh: "发送电子邮件", 'zh-TW': "發送電子郵件", en: "Send Email", ru: "Отправить письмо"},
    aboutContactTg: {
        zh: "加入Telegram群",
        'zh-TW': "加入Telegram群",
        en: "Join our Telegram group",
        ru: "Присоединяйтесь к группе Telegram"
    },
    aboutMore: {zh: "其他信息", 'zh-TW': "其他信息", en: "Additional Information", ru: "Дополнительная информация"},
    aboutMoreArch: {zh: '设备型号：', 'zh-TW': '設備型號：', en: 'Device model', ru: 'Модель устройства:'},
    aboutWebsite: {zh: '访问官网', 'zh-TW': '訪問官網', en: 'Visit Website', ru: 'Visit Website'},
    storePurchase: {zh: "订阅", 'zh-TW': "訂閱", en: "Subscription", ru: "Уже подписался"},
    storePurchaseNow: {zh: "立即订阅", 'zh-TW': "立即訂閱", en: "Subscribe Now", ru: "Купить сейчас"},
    storeTrial: {zh: '免费体验套餐', 'zh-TW': '免費體驗套餐', en: 'Free Trial Package', ru: 'Бесплатный пробный пакет'},
    storeTrialPrice: {zh: '免费', 'zh-TW': '免費', en: 'Free', ru: 'Бесплатно'},
    orderPromoHint: {zh: '输入优惠码', 'zh-TW': '輸入優惠碼', en: 'Enter the discount code', ru: 'Введите код скидки'},
    orderPurchaseBal: {zh: '余额支付', 'zh-TW': '餘額支付', en: 'Pay back balance', ru: 'Оплатить баланс'},
    orderPurchaseCustom: {zh: '融合支付', 'zh-TW': '融合支付', en: 'Pay in fusion', ru: 'Оплатить фьюжн'},
    orderPurchaseAlipay: {zh: '支付宝', 'zh-TW': '支付寶', en: 'Alipay', ru: 'Alipay'},
    orderPurchaseWechat: {zh: '微信', 'zh-TW': '微信支付', en: 'WeChat pay', ru: 'WeChat pay'},
    orderPurchaseCrypto: {zh: 'USDT-Trc20', 'zh-TW': 'USDT-Trc20', en: 'USDT-Trc20', ru: 'USDT-Trc20'},
    orderPrice: {zh: '套餐价格：', 'zh-TW': '套餐價格：', en: 'Package price', ru: 'Цена пакета：'},
    orderPricePromo: {zh: '折扣：', 'zh-TW': '折扣：', en: 'Discount', ru: 'Скидка：'},
    orderPriceBal: {zh: '余额：', 'zh-TW': '餘額：', en: 'Balance：', ru: 'Баланс：'},
    orderPriceAmount: {zh: '总计：', 'zh-TW': '總計：', en: 'Total：', ru: 'Итого：'},
    orderErr: {
        zh: '创建订单失败',
        'zh-TW': '創建訂單失敗',
        en: 'Failed to create the order',
        ru: 'Не удалось создать заказ'
    },
    orderPayErr: {
        zh: '订单查询失败，若您已成功支付，请核对个人信息',
        'zh-TW': '訂單查詢失敗，若您已成功支付，請核對個人信息',
        en: 'Order query failed, if you have successfully paid, please check your personal information',
        ru: 'Запрос заказа не удался, если вы успешно оплатили, проверьте, пожалуйста, вашу личную информацию'
    },
    orderPaySuccess: {
        zh: '订单支付成功，请核对个人信息',
        'zh-TW': '訂單支付成功，請核對個人信息',
        en: 'Order payment succeeded, please check your personal information',
        ru: 'Оплата заказа прошла успешно, пожалуйста, проверьте вашу личную информацию'
    },
    orderQrcode: {zh: '扫码支付', 'zh-TW': '掃碼支付', en: 'Scan code payment', ru: 'Оплата по скан-коду'},
    orderQrcodeTips: {
        zh: '支付成功后，请关闭该窗口！',
        'zh-TW': '支付成功後，請關閉該窗口！',
        en: 'Please close this window after the payment succeeded!',
        ru: 'Пожалуйста, закройте это окно после успешной оплаты!'
    },
    versionNew: {zh: '发现新版本：', 'zh-TW': '發現新版本：', en: 'New version found：', ru: 'Найдена новая версия：'},
    versionUpdateReq: {zh: '是否现在下载？', 'zh-TW': '是否現在下載？', en: 'Download now?', ru: 'Загрузить сейчас?'},
    versionForce: {
        zh: '<b>注意：需要更新到该版本才能继续正常使用！</b>',
        'zh-TW': '<b>注意：需要更新到該版本才能繼續正常使用！</b>',
        en: '<b>Note: You need to update to this version to continue to work properly! </b>',
        ru: '<b>Note: You need to update to this version to continue to work properly! </b>'
    },
    versionInstallReq: {
        zh: '新版本安装包下载完成，是否现在安装？',
        'zh-TW': '新版本安裝包下載完成，是否現在安裝？',
        en: 'The installation package of the new version has been downloaded, do you want to install it now?',
        ru: 'Установочный пакет новой версии был загружен, хотите ли вы установить его сейчас?'
    },
    versionCancel: {zh: '取消', 'zh-TW': '取消', en: 'Cancel', ru: 'отменить'},
    versionDownload: {zh: '立即下载', 'zh-TW': '立即下載', en: 'Download now', ru: 'Скачать сейчас'},
    versionInstall: {zh: '立即安装', 'zh-TW': '立即安裝', en: 'Install now', ru: 'Установить сейчас'},
    proxyGroupAuto: {zh: '自动选择', 'zh-TW': '自動選擇', en: 'Auto select', ru: 'Автоматический выбор'},
    proxyGroupAutoFlag: {
        zh: '自动选择延迟最低线路，但不一定速度最快',
        'zh-TW': '自動選擇延遲最低線路，但不一定速度最快',
        en: 'Automatically select the proxy with the lowest delay, but not necessarily the fastest',
        ru: 'Автоматически выбирает прокси с наименьшей задержкой, но не обязательно самый быстрый'
    },
    proxyGroupFallback: {zh: '故障转移', 'zh-TW': '故障轉移', en: 'Failover', ru: 'Обход отказа'},
    proxyGroupFallbackFlag: {
        zh: '自动切换可用线路',
        'zh-TW': '自動切換可用線路',
        en: 'Automatically switch available proxies',
        ru: 'Автоматическое переключение доступных' +
            ' прокси'
    },
    proxyOpenErrWin: {
        zh: '尝试开启系统代理失败，使用快捷键“Win+I”打开Windows设置页面-网络和Internet-代理，然后检测使用代理服务器开关是否已打开。<br/>' +
            '若您点击连接后但是该开关没有正常打开，一般为权限不足导致，您可以在点击连接后手动打开上述代理服务器开关，然后尝试是否可以正常使用。<br/><br/>报错内容为：<br/>',
        'zh-TW': '嘗試開啟系統代理失敗，使用快捷鍵“Win+I”打開Windows設置頁面-網絡和Internet-代理，然後檢測使用代理服務器開關是否已打開。 <br/>' +
            '若您點擊連接後但是該開關沒有正常打開，一般為權限不足導致，您可以在點擊連接後手動打開上述代理服務器開關，然後嘗試是否可以正常使用。 <br/><br/>報錯內容為：<br/>',
        en: 'The attempt to enable the system proxy failed, use the shortcut key "Win+I" to open the Windows settings page - network and Internet - proxy, and then check whether the use of proxy server switch is turned on <br/>' +
            'If the switch is not turned on normally after you clicked the link, it is generally caused by limited permissions. You can manually turn on the above proxy server switch after clicking the link, and then try to see whether it can be used normally.    <br/><br/>The error message is：<br/>',
        ru: 'Попытка включить системный прокси-сервер не удалась, воспользуйтесь сочетанием клавиш "Win+I", чтобы открыть страницу настроек Windows - сеть и Интернет - прокси-сервер, а затем проверьте, включен ли переключатель использования прокси-сервера. <br/>' +
            'Если переключатель не включается нормально после того, как вы щелкнули по ссылке, это обычно вызвано ограниченными правами. Вы можете вручную включить вышеуказанный переключатель прокси-сервера после перехода по ссылке, а затем попробовать, можно ли его нормально использовать.<br/><br/>Сообщение об ошибке：<br/>'
    },
    proxyOpenErrMac: {
        zh: '尝试开启系统代理失败。<br/><br/>报错内容为：<br/>',
        'zh-TW': '嘗試開啟系統代理失敗。 <br/><br/>報錯內容為：<br/>',
        en: 'The attempt to open the system proxy failed.<br/><br/>The error message is：<br/>',
        ru: 'Попытка открыть системный прокси-сервер не удалась.<br/><br/>Сообщение об ошибке：<br/>'
    },
}

const LOCALE_DEFAULT = 'zh'
let __locale

let __setLocale = (loc) => {
    __locale = loc
    try {
        sessionStorage.setItem("locale", loc)
    } catch (e) {
    }
}

let string = (key, language = __locale ?? sessionStorage.getItem("locale")) => {
    return strings[key][language] ?? strings[key][LOCALE_DEFAULT]
}

try {

    function STR() {

    }

    STR.getString = (key) => string(key)
    STR._setLocale = (loc) => __setLocale(loc)
    //
    // exports.getString = (key) => string(key)
    // exports._setLocale = (loc) => __setLocale(loc)

    module.exports = STR

} catch (e) {
}