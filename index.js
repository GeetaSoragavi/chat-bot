'use strict'

const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyparser,urlencoded({extended: false}));
app.use(bodyparser.json());

app.get('/', function(req, res){
    res.send("I am a chatbot");
});

app.get('/webhook/', function(req,res){
    if(req.query['hub.verify_token'] === "umsgbot") {
        res.send(req.query['hub.challenge']);
    }
    res.send("Incorrect token");
})

app.listen(app.get('port'), function(){
    console.log("Running: port");
})