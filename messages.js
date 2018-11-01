exports.message_list = [];

exports.addMessage = (message) => {
   let msg = {
       id: Math.floor((Math.random() * 100) + 1),
       text: message
   }
   message_list.push(msg);
}

exports.findById = (messageId) => {

}

exports.deleteById = (messageId) => {

}



