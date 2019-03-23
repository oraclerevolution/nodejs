var express = require('express')
var app = express()

app.get('/',function(req, res){
    res.render('index', {title: 'Mon application NodeJS', name: "kkkk"})
})

module.exports = app;