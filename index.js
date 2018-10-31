'use strict'

const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');

const app = express();

const token = "EAAReVJUEResBAOknqWe7SxjjOv3zxATZCOZCrgxZBLQN7TczfMZCO4ZBfrvwsPQg2lzPgdmf2UAi5LZAHZAQ5H2y7zZCX8LY4LmxpXhRrlCOhcUqh3bcrRhqm0BSP9p7nlxZARNL4xUh3WPblZCLQgKbGTkmkaAnXmXHdVJbqLrLP5twZDZD";

app.set('port',(process.env.PORT || 5000));

app.use(bodyparser.urlencoded({extended: false}));
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

app.post('/webhook/',function(req, res){

    let msg_event = req.body.entry[0].messaging;
    for(let index = 0; index < msg_event.length; index++){
        let event = msg_event[index];
        let sender = event.sender.id;
        if(event.message && event.message.text){
            let text = event.message.text;
            sendText(sender, "Text: " + text.substring(0,100));
        }
    }
    res.sendStatus(200);

});

function sendText(sender, text){
    let msgData = {text: text};
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token, token},
        method: "POST",
        json: {
            receipent: {id: sender},
            message: msgData
        }
    }, function(error, response, body) {
        if(error) {
            console.log("Error while sending");
        } else if(response.body.error){
            console.log("response body error")
        }

    })
}

app.listen(app.get('port'), function(){
    console.log("Running: port");
})