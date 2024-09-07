// let data = JSON.stringify({name: 'V2 | JP BGP 测试？'})
let data = {name: 'V2 | JP BGP 测试？'}

let options = {'url': 'http://localhost:8765/proxies/Pluto', 'method': 'PUT', 'timeout': 10000};
options.headers = {'Content-Type': 'application/json'}
options.body = data
options.json = true

// request(options, (err, reqs, body) => {
//     console.log(reqs.statusCode)
//     console.log(JSON.stringify(body))
// })

// request({url: 'http://localhost:8765/traffic', 'method': 'GET'}, (err, res, body) => {
//     console.log(JSON.stringify(body))
// })
// let write = new Stream.Writable()
// write._write = (chunk, encoding, next) => {
//     console.log(chunk.toString())
//     next()
// }
// let read = got.stream('http://localhost:8765/traffic')
// read .pipe(write)
// setTimeout(() => read.destroy(), 3000)

// let {exec} = require('sudo-prompt')
// exec('/Users/apple/pluto.electron/build/static/mac/clash/x64/./clash-darwin -d ' +
//     '../', {name:'testtest'}, (err ,sto, ste) => {
//     console.log(`${err} \n${sto}\n${ste}`)
// })

// let child_process = require('child_process')
// child_process.exec('sudo /Users/apple/pluto.electron/build/static/mac/clash/x64/clash-darwin -d ' +
//     '/Users/apple/pluto.electron/build/status/mac/clash/', (err ,sto, ste) => {
//     console.log(`${err} \n${sto}\n${ste}`)
// })

let test = `<h4 id="h4-go-"><a name="Go鍔犻€?閫氱煡" class="reference-link"></a><span class="header-link octicon octicon-link"></span>Go鍔犻€?閫氱煡</h4><p>IEPL鑺傜偣鍐嶆鍗囩骇锛岀洰鍓岻EPL鑺傜偣濡備笣婊戣埇椤虹晠銆傚彟澶栨垜浠殑瀹樼綉杩涘叆鏂瑰紡鏇存
崲涓猴細<a href="https://x-go.gitbook.io">https://x-go.gitbook.io</a></p>
<hr>
<p>鍚勫钩鍙版暀绋嬭鍦?瀹樼綉/鐢ㄦ埛涓績/涓嬭浇涓庢暀绋?鏌ョ湅</p>
<hr>
<h5 id="h5--go-"><a name="鍏充簬Go鍔犻€? class="reference-link"></a><span class="header-link octicon octicon-link"></span>鍏充簬Go鍔犻€?/h5><p>璇锋敹钘忛槻澶辫仈鍩熷悕锛<a href="https://x-go.gitbook.io">https://x-go.gitbook.io</a><br><a href="https://t.me/gogoo_group">TG缇?鐐瑰嚮鍔犲叆</a></p>
<p>鎴戜滑鎻愪緵楂樿川閲忕殑绾胯矾</p>
<ul>
<li>钀屾柊濂楅<br>姣忔湀200G娴侀噺锛屾墍鏈夎悓鏂扮嚎璺兘鍙娇鐢紝鎻愪緵鍘熺敓IP鍔熻兘锛岃В閿佹祦濯掍綋</li><li>楂樻墜濂楅<br>姣忔湀500G娴侀噺锛屾墍鏈夌嚎璺兘鍙娇鐢紝骞舵彁渚涗綆寤惰繜IPLC鑺傜偣锛?/li></ul>`


let hrefs  = /(href\=\"[^\"]+\")/.exec(test)
console.log(JSON.stringify(hrefs))