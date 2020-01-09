const socket = io();
const inputBoxEl = document.querySelector('input');
const sendButtonEl = document.getElementsByTagName('button');
const usersEl = document.getElementById('users');
let userName = '';

//! Print new msg
   socket.on('new-msg', function(data) {
      printMsg(data);
   });

   function printMsg (msg) {
      console.log(`${msg.userName} [${msg.time}] - ${msg.msg}`);     
   };

//! Update users list
   socket.on('update-user-list', function(data) {
      let userList = '<li>' + data.join('</li><li>') + '</li>';
      usersEl.innerHTML = userList;
   });

//! Get user name
   function getName() {
      const input = prompt('Please enter your name');
      return input ? input.toUpperCase() : '';
   };

   do {
      userName = getName();
   } while (userName.length < 2 || userName.length > 10);

   socket.emit('new-user', userName);

//! Send button
   inputBoxEl.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
         socket.emit('new-msg', {
            userName,
            msg: inputBoxEl.value,
            time: new Date()
         });
         inputBoxEl.value = '';
         inputBoxEl.focus(); 
      }
   });
   sendButtonEl[0].addEventListener('click', function() {
      socket.emit('new-msg', {
         userName,
         msg: inputBoxEl.value,
         time: new Date()
      });
      inputBoxEl.value = '';
      inputBoxEl.focus(); 
   });