const {execSync} = require("child_process")
const {networkInterfaces} = require("os")
const {isIP, isIPv4} = require("net")

let dfi = null

exports.getDefaultInterface = function () {
    if (dfi) return dfi
    if (process.platform === "darwin") {
        const out = execSync("netstat -nr | grep default ")
        const routers = out
            .toString()
            .split("\n")
            .map(str => str.split(/\s+/).filter(i => i))
            .filter(
                arr =>
                    arr.length === 4 &&
                    isIPv4(arr[1])
            );
        const ifs = networkInterfaces();
        if (routers.length > 0) {
            for (const router of routers) {
                const name = router[3]
                if (Object.keys(ifs).includes(name)) {
                    dfi = name
                    return name
                }
            }
        }
        if (Object.keys(ifs).includes("en0")) {
            dfi = 'en0'
            return "en0";
        }
    } else {
        const out = execSync("route print 0.0.0.0 mask 0.0.0.0");
        const routers = out
            .toString()
            .split("\n")
            .map(str => str.split(/\s+/).filter(i => i))
            .filter(
                arr =>
                    arr.length === 5 &&
                    arr.slice(0, 4).every(p => isIP(p)) &&
                    parseInt(arr[4]) !== NaN
            );
        const r = routers.filter(router => router[3] !== "10.0.0.1");
        const ifs = networkInterfaces();
        delete ifs["pluto-tap"];
        delete ifs["cfw-tap"];
        if (r.length > 0) {
            const ip = r.sort((a, b) => parseInt(a[4]) - parseInt(b[4]))[0][3];
            for (const k of Object.keys(ifs)) {
                const arr = ifs[k];
                const target = arr.find(a =>
                    routers.find(router => router[3] === a.address)
                );
                if (target) {
                    dfi = k;
                    return k;
                }
            }
        }
        if (Object.keys(ifs).includes("以太网")) {
            dfi = '以太网'
            return "以太网";
        }
        if (Object.keys(ifs).includes("WLAN")) {
            dfi = 'WLAN'
            return "WLAN";
        }
    }

    return null;
}
