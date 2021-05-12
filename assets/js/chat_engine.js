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
       
       let sendMessageButton = document.getElementById('send-message');
       let chatMessageInput = document.getElementById('chat-message-input');
       let chatMessageList = document.getElementById('chat-messages-list');
       sendMessageButton.addEventListener('click', function(e){
           e.preventDefault();
           if(chatMessageInput.value != ''){
               self.socket.emit('send_message', {
                   userEmail: self.userEmail,
                   chatRoom: 'codeial',
                   message: chatMessageInput.value,
                });
            }
       });

       this.socket.on('message_recieved', function(data){
            let message = document.createElement('li');
            let messageClass = 'other-message';
            if(data.userEmail == self.userEmail){
                messageClass = 'self-message';
            }
            message.classList.add(messageClass);

            let messageInput = document.createElement('span');
            messageInput.append(data.message);

            let messageAuthor = document.createElement('sub');
            messageAuthor.classList.add('message-author');
            messageAuthor.append(data.userEmail);

            message.append(messageInput);
            message.append(messageAuthor);
            chatMessageList.append(message);
       });

   }
}