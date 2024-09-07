let append = false;

function initCrisp(id) {

    // Web形式的chatbox
    if (id.startsWith("https://")) {
        $('.chatbox').show()
        return
    }

    if (id.startsWith('chatra://')) {
        // $('.chatbox').show()
        displayChatra(id.replace("chatra://", ''))
        return;
    }

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = id;
}

function updateCrisp(user) {
    if (window.CRISP_WEBSITE_ID) {
        if (user) {
            CRISP_TOKEN_ID = user.email
            $crisp.push(["set", "user:email", [user.email.indexOf('@') !== -1 ? user.email : '']])
            $crisp.push(["set", "user:nickname", [user.name]])
            $crisp.push(["set", "user:avatar", [user.avatar]])

            $crisp.push(['set', 'session:data', [[
                ['Device', user.device + ' V' + user.version],
                ['Class', user.vip],
                // ['剩余', `${user.vipExpireDays}天`],
                ['Expire', user.vipExpireTime],
                ['Balance', user.balance],
                ['Traffic', `${formatTraffic2Unit(user.traffic[1])} / ${formatTraffic2Unit(user.traffic[0])}`],
            ]]])
        }

        if (append || !window.CRISP_WEBSITE_ID) return;

        let d = document;
        let s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);

        append = true
    }

    if (window.ChatraID) {
        if (user) {
            /* Anywhere after Chatra widget code */
            Chatra('updateIntegrationData', {
                name: `${user.email.split('@')[0]} ${string("appName")}`,
                email: user.email.indexOf('@') !== -1 ? user.email : '', /* e-mail changed */
                phone: null,
                notes:`套餐：${user.vip}\n到期：${user.vipExpireTime}\n余额：${user.balance}\n流量：${formatTraffic2Unit(user.traffic[1])} / ${formatTraffic2Unit(user.traffic[0])}`
            });
        }
        append = true
    }
}

function displayChatra(id) {

    if (append) return

    <!-- Chatra {literal} -->
    (function (d, w, c) {
        w.ChatraID = id;
        var s = d.createElement('script');
        w[c] = w[c] || function () {
            (w[c].q = w[c].q || []).push(arguments);
        };
        s.async = true;
        s.src = 'https://call.chatra.io/chatra.js';
        if (d.head) d.head.appendChild(s);
    })(document, window, 'Chatra');
    <!-- /Chatra {/literal} -->

    append = true
}