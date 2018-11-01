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
    for(let index = 0; index < message_list.length; index++){
        if(messageId === message_list[index].id){
            message_list.splice(index,1);
        }
    }

}

module.exports.message_list = message_list;  
module.exports.addMessage = addMessage;
module.exports.findById = findById;
module.exports.deleteById = deleteById;




