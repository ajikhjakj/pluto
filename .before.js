const fs = require('fs')

fs.unlink('./build/static/win/clash/config.yaml', err => {
    if(err) {
        console.log(err)
    }
    console.log("Deleted win/clash/config.yaml")
})
fs.unlink('./build/static/mac/clash/config.yaml', err => {
    if(err) {
        console.log(err)
    }
    console.log("Deleted mac/clash/config.yaml")
})
