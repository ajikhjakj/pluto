/**
 * 检测当前是否可以选择线路
 * @param line
 * @param user
 * @returns {boolean}
 */
function checkLineClick(line, user) {
    if (!line || !line.name || !user) return false
    
    return true
}

function getFlagRes(flag) {
    let resId = 'img/ic_logo.64.png'
    switch (flag) {
        case string("proxyGroupAutoFlag"):
            resId = "img/flags/ic_flag__auto.png"
            break
        case string("proxyGroupFallbackFlag"):
            resId = "img/flags/ic_flag__fallback.png"
            break
        case "安道尔共和国" :
        case "安道尔" :
        case "安道爾" :
        case "Andorra":
        case "AD":
            resId = "img/flags/ic_flag_ad.png"
            break;
        case "阿拉伯联合酋长国" :
        case "阿拉伯聯合酋長國" :
        case "United Arab Emirates" :
        case "Arab Emirates" :
        case "AE":
            resId = "img/flags/ic_flag_ae.png"
            break;
        case "阿富汗" :
        case "Afghanistan" :
        case "AFG" :
        case "AF":
            resId = "img/flags/ic_flag_af.png"
            break;
        case "阿尔巴尼亚" :
        case "阿爾巴尼亞" :
        case "Albania" :
        case "ALB" :
        case "AL":
            resId = "img/flags/ic_flag_al.png"
            break;
        case "亚美尼亚" :
        case "亞美尼亞" :
        case "Armenia" :
        case "ARM" :
        case "AM":
            resId = "img/flags/ic_flag_am.png"
            break;
        case "阿根廷":
        case "Argentina" :
        case "ARG":
        case "AR" :
            resId = "img/flags/ic_flag_ar.png"
            break;
        case "奥地利" :
        case "奧地利" :
        case "Austria" :
        case "AUT" :
        case "AT":
            resId = "img/flags/ic_flag_at.png"
            break;
        case "澳大利亚" :
        case "澳大利亞" :
        case "Australia" :
        case "AUS" :
        case "AU":
            resId = "img/flags/ic_flag_au.png"
            break;
        case "阿塞拜疆" :
        case "Azerbaijan" :
        case "AZ" :
            resId = "img/flags/ic_flag_az.png"
            break;
        case "孟加拉国" :
        case "孟加拉國" :
        case "Bangladesh" :
        case "BGD" :
        case "BD":
            resId = "img/flags/ic_flag_bd.png"
            break;
        case "比利时" :
        case "比利時" :
        case "Belgium" :
        case "BEL" :
        case "BE":
            resId = "img/flags/ic_flag_be.png"
            break;
        case "保加利亚" :
        case "保加利亞" :
        case "Bulgaria" :
        case "BGR" :
        case "BG":
            resId = "img/flags/ic_flag_bg.png"
            break;
        case "巴林":
        case "Bahrain":
        case "BH":
            resId = "img/flags/ic_flag_bh.png"
            break
        case "波斯尼亚和黑塞哥维那" :
        case "波黑" :
        case "Bosnia and Herzegovina" :
        case "Bosnia":
        case "BIH":
            resId = "img/flags/ic_flag_bih.png"
            break
        case "巴西" :
        case "Brazil" :
        case "BRA" :
        case "BR":
            resId = "img/flags/ic_flag_br.png"
            break;
        case "白俄罗斯" :
        case "白俄羅斯" :
        case "Belarus" :
        case "BY":
            resId = "img/flags/ic_flag_by.png"
            break;
        case "加拿大" :
        case "Canada" :
        case "CAN" :
        case "CA":
            resId = "img/flags/ic_flag_ca.png"
            break;
        case "瑞士" :
        case "Switzerland" :
        case "CHE" :
        case "CH":
            resId = "img/flags/ic_flag_ch.png"
            break;
        case "智利" :
        case "Chile" :
        case "CL":
            resId = "img/flags/ic_flag_cl.png"
            break
        case "中国" :
        case "中國" :
        case "China" :
        case "CHN" :
        case "CN":
            resId = "img/flags/ic_flag_cn.png"
            break;
        case "哥伦比亚" :
        case "哥倫比亞" :
        case "Colombia" :
        case "COL" :
        case "CO":
            resId = "img/flags/ic_flag_co.png"
            break;
        case "哥斯达黎加" :
        case "Costa Rica" :
        case "CR":
            resId = "img/flags/ic_flag_cr.png"
            break;
        case "塞浦路斯" :
        case "Cyprus" :
        case "CY":
            resId = "img/flags/ic_flag_cy.png"
            break;
        case "捷克" :
        case "Czech Republic" :
        case "CZE" :
        case "CZ":
            resId = "img/flags/ic_flag_cz.png"
            break;
        case "库拉索" :
        case "Curaçao" :
        case "Curacao" :
            resId = "img/flags/ic_flag_cur.png"
            break
        case "德国" :
        case "德國" :
        case "Germany" :
        case "DEU" :
        case "DE":
            resId = "img/flags/ic_flag_de.png"
            break;
        case "丹麦" :
        case "丹麥" :
        case "Denmark" :
        case "DNK" :
        case "DK":
            resId = "img/flags/ic_flag_dk.png"
            break;
        case "多米尼加" :
        case "Dominican Republic" :
        case "DOM" :
        case "DO":
            resId = "img/flags/ic_flag_do.png"
            break;
        case "厄瓜多尔" :
        case "Ecuador" :
        case "EC":
            resId = "img/flags/ic_flag_ec.png"
            break
        case "爱沙尼亚" :
        case "愛沙尼亞" :
        case "Estonia" :
        case "EST" :
        case "EE":
            resId = "img/flags/ic_flag_ee.png"
            break;
        case "埃及" :
        case "Egypt" :
        case "EGY" :
        case "EG":
            resId = "img/flags/ic_flag_eg.png"
            break;
        case "西班牙" :
        case "Spain" :
        case "ESP" :
        case "ES":
            resId = "img/flags/ic_flag_es.png"
            break;
        case "芬兰" :
        case "芬蘭" :
        case "Finland" :
        case "FIN" :
        case "FI":
            resId = "img/flags/ic_flag_fi.png"
            break;
        case "法国" :
        case "法國" :
        case "France" :
        case "FRA" :
        case "FR":
            resId = "img/flags/ic_flag_fr.png"
            break;
        case "英国" :
        case "英國" :
        case "English" :
        case "England" :
        case "United Kingdom" :
        case "The United Kingdom" :
        case "GBR" :
        case "GB":
            resId = "img/flags/ic_flag_gb.png"
            break;
        case "格鲁吉亚" :
        case "Georgia" :
        case "GE":
            resId = "img/flags/ic_flag_ge.png"
            break;
        case "希腊" :
        case "希臘" :
        case "Greece" :
        case "GRC" :
        case "GR":
            resId = "img/flags/ic_flag_gr.png"
            break;
        case "香港" :
        case "香港(中国)" :
        case "香港(中國)" :
        case "Hong Kong" :
        case "HongKong" :
        case "HKG" :
        case "HK":
            resId = "img/flags/ic_flag_hk.png"
            break;
        case "克罗地亚" :
        case "克羅地亞" :
        case "Croatia" :
        case "HR":
            resId = "img/flags/ic_flag_hr.png"
            break;
        case "匈牙利" :
        case "Hungary" :
        case "HUN" :
        case "HU":
            resId = "img/flags/ic_flag_hu.png"
            break;
        case "印度尼西亚" :
        case "印度尼西亞" :
        case "Indonesia" :
        case "IDN" :
        case "ID":
            resId = "img/flags/ic_flag_id.png"
            break;
        case "爱尔兰" :
        case "愛爾蘭" :
        case "Ireland" :
        case "IRL" :
        case "IE":
            resId = "img/flags/ic_flag_ie.png"
            break;
        case "以色列" :
        case "Israel" :
        case "ISR" :
        case "IL":
            resId = "img/flags/ic_flag_il.png"
            break;
        case "印度" :
        case "India" :
        case "LND" :
        case "IN":
            resId = "img/flags/ic_flag_in.png"
            break;
        case "伊拉克" :
        case "Iraq" :
        case "IRQ" :
        case "IQ":
            resId = "img/flags/ic_flag_iq.png"
            break;
        case "伊朗" :
        case "Iran" :
        case "IRN" :
        case "IR":
            resId = "img/flags/ic_flag_ir.png"
            break;
        case "冰岛" :
        case "冰島" :
        case "Iceland" :
        case "IS":
            resId = "img/flags/ic_flag_is.png"
            break;
        case "意大利" :
        case "Italy" :
        case "ITA" :
        case "IT":
            resId = "img/flags/ic_flag_it.png"
            break;
        case "日本" :
        case "Japan" :
        case "JPN" :
        case "JP":
            resId = "img/flags/ic_flag_jp.png"
            break;
        case "牙买加" :
        case "牙買加" :
        case "Jamaica" :
        case "JAM" :
        case "JM":
            resId = "img/flags/ic_flag_jm.png"
            break;
        case "约旦" :
        case "約旦" :
        case "Jordan" :
        case "JOR" :
        case "JO":
            resId = "img/flags/ic_flag_jo.png"
            break;
        case "肯尼亚" :
        case "肯尼亞" :
        case "Kenya" :
        case "KEN" :
        case "KE":
            resId = "img/flags/ic_flag_ke.png"
            break;
        case "吉尔吉斯斯坦" :
        case "吉爾吉斯斯坦" :
        case "吉尔吉斯" :
        case "Kyrgyzstan" :
        case "KG":
            resId = "img/flags/ic_flag_kg.png"
            break;
        case "柬埔寨" :
        case "Cambodia" :
        case "KHM" :
        case "KH":
            resId = "img/flags/ic_flag_kh.png"
            break;
        case "朝鲜" :
        case "朝鮮" :
        case "PRK" :
        case "KP":
            resId = "img/flags/ic_flag_kp.png"
            break;
        case "韩国" :
        case "韓國" :
        case "Korea" :
        case "South Korea":
        case "KOR" :
        case "KR":
            resId = "img/flags/ic_flag_kr.png"
            break;
        case "哈萨克斯坦" :
        case "哈薩克斯坦" :
        case "Kazakhstan" :
        case "KAZ" :
        case "KZ":
            resId = "img/flags/ic_flag_kz.png"
            break;
        case "老挝" :
        case "老撾" :
        case "the Lao People's Democratic Republic" :
        case "LAO" :
        case "LA":
            resId = "img/flags/ic_flag_la.png"
            break;
        case "黎巴嫩" :
        case "Lebanon" :
        case "LBN" :
        case "LB":
            resId = "img/flags/ic_flag_lb.png"
            break;
        case "立陶宛" :
        case "Lithuania" :
        case "LTU" :
        case "LT":
            resId = "img/flags/ic_flag_lt.png"
            break;
        case "卢森堡" :
        case "盧森堡" :
        case "Luxembourg" :
        case "LUX" :
        case "LU":
            resId = "img/flags/ic_flag_lu.png"
            break;
        case "拉脱维亚" :
        case "拉脫維亞" :
        case "Latvia" :
        case "LVA" :
        case "LV":
            resId = "img/flags/ic_flag_lv.png"
            break;
        case "利比亚" :
        case "利比亞" :
        case "Libyan" :
        case "LBY" :
        case "LY":
            resId = "img/flags/ic_flag_ly.png"
            break;
        case "摩洛哥" :
        case "Morocco" :
        case "MAR" :
        case "MA":
            resId = "img/flags/ic_flag_ma.png"
            break;
        case "摩纳哥" :
        case "摩納哥" :
        case "Monaco" :
        case "MCO" :
        case "MC":
            resId = "img/flags/ic_flag_mc.png"
            break;
        case "摩尔多瓦" :
        case "摩爾多瓦" :
        case "Moldova" :
        case "MD":
            resId = "img/flags/ic_flag_md.png"
            break;
        case "黑山" :
        case "Montenegro" :
        case "MNE" :
        case "ME":
            resId = "img/flags/ic_flag_me.png"
            break;
        case "北马其顿" :
        case "北馬其頓" :
        case "North Macedonia" :
        case "Macedonia" :
        case "MK":
            resId = "img/flags/ic_flag_mk.png"
            break;
        case "缅甸" :
        case "緬甸" :
        case "Myanmar" :
        case "MMR" :
        case "MM":
            resId = "img/flags/ic_flag_mm.png"
            break;
        case "蒙古" :
        case "Mongolia":
        case "MN":
            resId = "img/flags/ic_flag_mn.png"
            break;
        case "澳门" :
        case "澳門" :
        case "澳门(中国)" :
        case "澳門(中國)" :
        case "Macao" :
        case "Macau" :
        case "MAC" :
        case "MO":
            resId = "img/flags/ic_flag_mo.png"
            break;
        case "马耳他" :
        case "馬耳他" :
        case "Malta" :
        case "MT":
            resId = "img/flags/ic_flag_mt.png"
            break;
        case "毛里求斯" :
        case "毛裏求斯" :
        case "Mauritius" :
        case "MUS" :
        case "MU":
            resId = "img/flags/ic_flag_mu.png"
            break;
        case "马尔代夫" :
        case "馬爾代夫" :
        case "Maldives" :
        case "MDV" :
        case "MV":
            resId = "img/flags/ic_flag_mv.png"
            break;
        case "墨西哥" :
        case "Mexico" :
        case "MEX" :
        case "MX":
            resId = "img/flags/ic_flag_mx.png"
            break;
        case "马来西亚" :
        case "馬來西亞" :
        case "Malaysia" :
        case "MYS" :
        case "MY":
            resId = "img/flags/ic_flag_my.png"
            break;
        case "马恩岛":
        case "曼島":
        case "曼岛":
        case "Mann":
        case "Isle of Man":
            resId = "img/flags/ic_flag_man.png"
            break
        case "尼日尔" :
        case "尼日爾" :
        case "Niger" :
        case "NER" :
        case "NE":
            resId = "img/flags/ic_flag_ne.png"
            break;
        case "尼日利亚" :
        case "Nigeria" :
        case "NG" :
            resId = "img/flags/ic_flag_ng.png"
            break
        case "荷兰" :
        case "荷蘭" :
        case "Netherlands" :
        case "NLD" :
        case "NL" :
            resId = "img/flags/ic_flag_nl.png"
            break;
        case "挪威" :
        case "Norway" :
        case "NOR" :
        case "NO":
            resId = "img/flags/ic_flag_no.png"
            break;
        case "尼泊尔" :
        case "尼泊爾" :
        case "Nepal" :
        case "NPL" :
        case "NP" :
            resId = "img/flags/ic_flag_np.png"
            break;
        // todo
        case "阿曼" :
        case "Oman" :
        case "OM" :
            resId = "img/flags/ic_flag_om.png"
            break;
        case "巴拿马" :
        case "巴拿馬" :
        case "Panama" :
        case "PAN" :
        case "PA":
            resId = "img/flags/ic_flag_pa.png"
            break;
        case "秘鲁" :
        case "秘魯" :
        case "Peru" :
        case "PER" :
        case "PE" :
            resId = "img/flags/ic_flag_pe.png"
            break;
        case "菲律宾" :
        case "菲律賓" :
        case "Philippines" :
        case "PHL" :
        case "PH":
            resId = "img/flags/ic_flag_ph.png"
            break;
        case "巴基斯坦" :
        case "Pakistan" :
        case "PAK" :
        case "PK":
            resId = "img/flags/ic_flag_pk.png"
            break;
        case "波兰" :
        case "波蘭" :
        case "Poland" :
        case "PL":
            resId = "img/flags/ic_flag_pl.png"
            break;
        case "波多黎各" :
        case "Puerto Rico" :
        case "PR":
            resId = "img/flags/ic_flag_pr.png"
            break;
        case "葡萄牙" :
        case "Portugal" :
        case "PRT" :
        case "PT":
            resId = "img/flags/ic_flag_pt.png"
            break;
        case "巴拉圭" :
        case "Paraguay" :
        case "PY":
            resId = "img/flags/ic_flag_py.png"
            break;
        case "罗马尼亚" :
        case "羅馬尼亞" :
        case "Romania" :
        case "ROU" :
        case "RO":
            resId = "img/flags/ic_flag_ro.png"
            break;
        case "俄罗斯" :
        case "俄羅斯" :
        case "Russia" :
        case "RUS" :
        case "RU":
            resId = "img/flags/ic_flag_ru.png"
            break;
        case "留尼汪" :
        case "Reunion Island" :
        case "Reunion" :
            resId = "img/flags/ic_flag_re.png"
            break;
        case "沙特阿拉伯" :
        case "Saudi Arabia" :
        case "SAU" :
        case "SA":
            resId = "img/flags/ic_flag_sa.png"
            break;
        case "所罗门群岛" :
        case "所羅門群島" :
        case "Solomon" :
        case "SLB" :
        case "SB":
            resId = "img/flags/ic_flag_sb.png"
            break;
        case "瑞典" :
        case "Sweden" :
        case "SWE" :
        case "SE":
            resId = "img/flags/ic_flag_se.png"
            break;
        case "新加坡" :
        case "Singapore" :
        case "SGP" :
        case "SG":
            resId = "img/flags/ic_flag_sg.png"
            break;
        case "斯洛伐克" :
        case "Slovakia" :
        case "SK":
            resId = "img/flags/ic_flag_sk.png"
            break
        case "索马里" :
        case "索馬裏" :
        case "Somalia" :
        case "SOM" :
        case "SO":
            resId = "img/flags/ic_flag_so.png"
            break;
        case "塞尔维亚" :
        case "塞爾維亞" :
        case "Serbia" :
        case "SRB":
            resId = "img/flags/ic_flag_srb.png"
            break;
        case "泰国" :
        case "泰國" :
        case "Thailand" :
        case "THA" :
        case "TH":
            resId = "img/flags/ic_flag_th.png"
            break;
        case "突尼斯" :
        case "Tunisia" :
        case "TN":
            resId = "img/flags/ic_flag_tn.png"
            break
        case "土耳其" :
        case "Turkey" :
        case "TUR" :
        case "TR":
            resId = "img/flags/ic_flag_tr.png"
            break;
        case "台湾" :
        case "臺灣" :
        case "台灣":
        case "台湾(中国)" :
        case "臺灣(中國)" :
        case "台灣(中國)" :
        case "Taiwan" :
        case "TWN" :
        case "TW":
            resId = "img/flags/ic_flag_tw.png"
            break;
        case "乌克兰" :
        case "烏克蘭" :
        case "Ukraine" :
        case "UKR" :
        case "UA":
            resId = "img/flags/ic_flag_ua.png"
            break;
        case "美国" :
        case "美國" :
        case "United States" :
        case "America" :
        case "USA" :
        case "US":
            resId = "img/flags/ic_flag_us.png"
            break;
        case "乌拉圭" :
        case "Uruguay" :
        case "UY":
            resId = "img/flags/ic_flag_uy.png"
            break
        case "乌兹别克斯坦" :
        case "烏茲別克斯坦" :
        case "Uzbekistan" :
        case "UZ":
            resId = "img/flags/ic_flag_uz.png"
            break
        case "委内瑞拉" :
        case "委內瑞拉" :
        case "Venezuela" :
        case "VEN" :
        case "VE":
            resId = "img/flags/ic_flag_ve.png"
            break;
        case "越南" :
        case "Vine" :
        case "Vietnam":
        case "VNM" :
        case "VN":
            resId = "img/flags/ic_flag_vn.png"
            break;
        case "南非" :
        case "South Africa" :
        case "ZAF" :
        case "ZA":
            resId = "img/flags/ic_flag_za.png"
            break;
    }
    return resId
}