const express = require('express')
const app = express()

app.get('', (req, res) => {
    res.send('get')
})

app.listen(8080, () => {
    console.log('http://192.168.0.106:8080');
})







