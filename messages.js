var message_list = [];

let addMessage = function(message) {
   let msg = {
       id: Math.floor((Math.random() * 100) + 1),
       text: message
   }
   message_list.push(msg);
}

let findById = function(messageId) {

}

let deleteById = function(messageId) {

}

module.exports.message_list = message_list;  
module.exports.addMessage = addMessage;
module.exports.findById = findById;
module.exports.deleteById = deleteById;




