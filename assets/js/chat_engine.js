class ChatEngine{
   constructor(chatBoxId, userEmail){
       this.chatBoxId = $(`#${chatBoxId}`);
       this.userEmail = userEmail;

       this.socket = io.connect('http://localhost:5000');

       if(this.userEmail){
           this.connectionHandler();    
       }
   } 
   
   connectionHandler(){
       let self = this;

       this.socket.on('connect', function(){
           console.log('Connection established successfully using sockets...!');

           self.socket.emit('join-room', {
               userEmail: self.userEmail,
               chatRoom: 'codeial',
           });

           self.socket.on('user_joined', function(data){
            console.log('A user joined: ', data);
           });
       });

       document.querySelector('#send-message').addEventListener('click', function(e){
        e.preventDefault();
        let messageInput = document.querySelector('#chat-message-input').value;
        
        if(messageInput != ''){
            self.socket.emit('send-message', {
                userEmail: self.userEmail,
                message: messageInput,
                chatRoom: 'codeial-chat',
            });
        }
        
        self.socket.on('recieve-message', function(data){
            console.log('chal jaa bro');
             let newMessageList = document.createElement('li');
             let messageContent = document.createElement('span');
             let messageSender = document.createElement('sub');
             messageSender.classList.add('message-author');
             messageContent.append(data.message);
             messageSender.append(data.userEmail);

             let messageType = 'other-message';
             if(self.userEmail == data.userEmail){
                 messageType = 'self-message';
             }

             newMessageList.classList.add(messageType);
             newMessageList.append(messageContent);
             newMessageList.append(messageSender);

             document.querySelector('#chat-messages-list').append(newMessageList);
        });
    });


   }
}