'use strict'

const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');

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

//Setting up a greeting text
function createGreetingApi(data) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: { access_token: token },
        method: 'POST',
        json: data
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Greeting set successfully!");
        } else {
            console.error("Failed calling Thread Reference API", response.statusCode,     response.statusMessage, body.error);
        }
    });  
}

function setGreetingText() {
    var greetingData = {
        setting_type: "greeting",
        greeting: {
            text:"Hi {{user_first_name}}, Thanks for getting in touch. Please enter your birthdate to know how many days for your next birthday. Thank you!"
        }
    };
    createGreetingApi(greetingData);
}


function sendText(sender, text){

    let apiai = apiaiApp.textRequest(text, {
        sessionId: 'msg_sId' 
    });

    apiai.on('response', function(response) {
        console.log("Response: " + response.result);
        let aiText = response.result.fulfillment.speech;

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
    setGreetingText();
})