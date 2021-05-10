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


   }
}