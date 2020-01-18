const socket = io();
const inputBoxEl = document.getElementById('chat-input');
const sendButtonEl = document.getElementById('chat-button');
const msgFieldEl = document.getElementById('msg');
const userNameEl = document.getElementById('userName');
const chatScrollEl = document.getElementById('chat-msg');
// const usersEl = document.getElementById('users');
const postsURL = 'api/posts';

//! Print new msg
   socket.on('new-msg', function(data) {
      let newMsg = `[${data.userName}] ${data.msg}`;
      const liElement = document.createElement("li")
      liElement.innerText = newMsg;
      msgFieldEl.appendChild(liElement);
      chatScrollEl.scrollTop = chatScrollEl.scrollHeight;
   });

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

//! Dropdown menu & modal pop-up
   if ($('.dropdown-trigger').length) {
      $('.dropdown-trigger').dropdown()
   }

   // $('.modal').modal();

//! AJAX
$('.edit').on('click', function(editComment) {
   editComment.preventDefault();
   $.ajax({
      url: '/api/post' + editComment.currentTarget.pathname,
      method: 'GET',
      datatype: 'json',
      success: (data) => {
         $('#append-modal').empty();
         let modalHTML = `
            <div id="modal-${data.comment._id}" class="modal">
               <div class="modal-content">
                  <h6>Edit Comment</h6>
                  <form action="/comment/${data.postId}/${data.comment._id}?_method=PUT" method="POST">
                     <input type="text" name="text" value="${data.comment.comment}">
                     <button type="submit">Update Comment</button>
                  </form>
               </div>
            </div>
         `;
         $('#append-modal').append(modalHTML);
         $('.modal').modal();
         M.Modal.getInstance(document.getElementById(`modal-${data.comment._id}`)).open();
      },
      error: (err) => {
         console.log(err);
      }
   });
})

$('.delete').on('click', function(deleteComment) {
   deleteComment.preventDefault();
   $.ajax({
      url: '/api/post' + deleteComment.currentTarget.pathname,
      method: 'DELETE',
      datatype: 'json',
      success: (data) => {
         if (data.comment) {
            $(`#ptag-${data.comment._id}`).remove();
         }
      },
      error: (err) => {
         console.log(err);
      }
   });
})