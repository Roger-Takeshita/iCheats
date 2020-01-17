const socket = io();
const inputBoxEl = document.getElementById('chat-input');
const sendButtonEl = document.getElementById('chat-button');
// const usersEl = document.getElementById('users');
const msgFieldEl = document.getElementById('msg');
const userNameEl = document.getElementById('userName');
const chatScrollEl = document.getElementById('chat-msg');

//! Print new msg
   socket.on('new-msg', function(data) {
      printMsg(data);
   });

   function printMsg (msg) {
      let newMsg = `[${msg.userName}] ${msg.msg}`;
      const liElement = document.createElement("li")
      liElement.innerText = newMsg;
      msgFieldEl.appendChild(liElement);
      chatScrollEl.scrollTop = chatScrollEl.scrollHeight;
   };

//! Update users list
   // socket.on('update-user-list', function(data) {
   //    let userList = '<li>' + data.join('</li><li>') + '</li>';
   //    usersEl.innerHTML = userList;
   // });

//! Get user name
   if (userNameEl !== null) {
      socket.emit('new-user', userNameEl.innerHTML);
   }
//! Send button
   if (userNameEl !== null) {
      inputBoxEl.addEventListener("keyup", function(event) {
         if (event.keyCode === 13) {
            socket.emit('new-msg', {
               userName: userNameEl.innerHTML,
               msg: inputBoxEl.value,
               time: new Date()
            });
            inputBoxEl.value = '';
            inputBoxEl.focus(); 
         }
      });
      sendButtonEl.addEventListener('click', function() {
         socket.emit('new-msg', {
            userName: userNameEl.innerHTML,
            msg: inputBoxEl.value,
            time: new Date()
         });
         inputBoxEl.value = '';
         inputBoxEl.focus(); 
      });
   }