'use strict'

const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
const Promise = require('bluebird');

const app = express();

let token = "EAAReVJUEResBAOknqWe7SxjjOv3zxATZCOZCrgxZBLQN7TczfMZCO4ZBfrvwsPQg2lzPgdmf2UAi5LZAHZAQ5H2y7zZCX8LY4LmxpXhRrlCOhcUqh3bcrRhqm0BSP9p7nlxZARNL4xUh3WPblZCLQgKbGTkmkaAnXmXHdVJbqLrLP5twZDZD";
const apiaiApp = require('apiai')("419773b76c474f8fa3798a6b55989807");

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
            sendText(sender, text.substring(0,100));
        }
    }
    res.sendStatus(200);

});

let calculateDays = function(date){
    let promise = new Promise(function(resolve, reject) {
        if(!date){
            reject("There is no date given");
        }
        let startDate = Date.parse(date);
        let today = new Date().toISOString().slice(0,10); 
        let endDate = Date.parse(today);
        let timeDiff = endDate - startDate;
        let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        resolve(daysDiff);
    });
    return promise;
}

function sendText(sender, text){

    console.log("Text: " + text);

    let apiai = apiaiApp.textRequest(text, {
        sessionId: 'msg_sId' 
    });

    apiai.on('response', function(response) {
        console.log("Response: " + JSON.stringify(response.result));
        let action = response.result.action;
        let aiText = response.result.fulfillment.speech;
        console.log("Action: " + action);


        //If the user has entered date the action is input.date from api.ai
        if(action.includes("input.date")){
            let date = response.result.parameters.date;
            calculateDays(date).then(function(days){
                aiText = `There are ${days} left for your next birthday`;
            });
        }
        request({
            url: "https://graph.facebook.com/v2.6/me/messages",
            qs: {access_token: token},
            method: "POST",
            json: {
                recipient: {id: sender},
                message: {text: aiText}
            }
        }, function(error, response, body) {
            if(error) {
                console.log("Error while sending");
            } else if(response.body.error){
                console.log("response body error");
                console.log(response.body.error);
            }
    
        })
    });

    apiai.on('error', function(error) {
        console.log(error);
    });

    apiai.end();
}

app.listen(app.get('port'), function(){
    console.log("Running: port");
})