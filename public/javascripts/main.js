const socket = io();
const inputBoxEl = document.getElementById('chat-input');
const sendButtonEl = document.getElementById('chat-button');
const msgFieldEl = document.getElementById('msg');
const userNameEl = document.getElementById('userName');
const chatScrollEl = document.getElementById('chat-msg');
// const usersEl = document.getElementById('users');

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

   $('.modal').modal();

//! AJAX
   $('.edit').on('click', function(editComment) {
      editComment.preventDefault();
      editCommentFunc(editComment);
   })

   $('.delete').on('click', function(deleteComment) {
      deleteComment.preventDefault();
      deleteCommentFunc(deleteComment);
   })

   $('#submit-update-comment').on('click', function(updateComment) {
      let newCommentEl = document.getElementById('input-update-comment').value;
      if (newCommentEl !== "") {
         $.ajax({
            url: '/api/post' + updateComment.currentTarget.value,
            method: 'PUT',
            data: {
               comment: newCommentEl,
            },
            success: (data) => {
               M.Modal.getInstance(document.getElementById(`modal-${data.commentId}`)).close();
               document.getElementById(`${data.commentId}`).innerHTML = newCommentEl;
            },
            error: (err) => {
               console.log(err);
            }
         });
      }
   })

   $('.button-new-comment').on('click', function(newComment) {
      let postId = newComment.currentTarget.value;
      let newCommentEl = document.getElementById(`input-${postId}`).value;
      if (newCommentEl !== "") {
         $.ajax({
            url: '/api/post/' + postId,
            method: 'POST',
            datatype: 'json',
            data: {
               comment: newCommentEl,
            },
            success: (data) => {
               let newCommentId = data.newCommentId;
               let newCommentHTML =`
                  <p class="comments" id="ptag-${newCommentId}">
                     <span class="full-name-comment">&nbsp;&nbsp;[${userNameEl.innerHTML}]</span> <span id="${newCommentId}">${newCommentEl}</span>
                     <a class="edit" href="${postId}/${newCommentId}" value="${newCommentId}">(edit)</a> <a class="delete" href="${postId}/${newCommentId}" value="${newCommentId}">(delete)</a>
                  </p>
               `;
               $(`#post-comments-${postId}`).append(newCommentHTML);
               document.getElementById(`input-${postId}`).value = "";
               $(`#post-comments-${postId}`).scrollTop($(`#post-comments-${postId}`).prop('scrollHeight'));
               $('.modal').modal();
               $('.edit').on('click', function(editComment) {
                  editComment.preventDefault();
                  editCommentFunc(editComment);
               });
               $('.delete').on('click', function(deleteComment) {
                  deleteComment.preventDefault();
                  deleteCommentFunc(deleteComment);
               })
            },
            error: (err) => {
               console.log(err);
            }
         });
      }
   })

//! Functions
   function editCommentFunc (fromDom) {
      $.ajax({
         url: '/api/post' + fromDom.currentTarget.pathname,
         method: 'GET',
         datatype: 'json',
         success: (data) => {
            document.getElementById('append-modal').firstElementChild.attributes[0].value = `modal-${data.comment._id}`;
            document.getElementById('input-update-comment').value = data.comment.comment;
            document.getElementById('submit-update-comment').value = fromDom.currentTarget.pathname;
            M.Modal.getInstance(document.getElementById(`modal-${data.comment._id}`)).open();
         },
         error: (err) => {
            console.log(err);
         }
      });
   }

   function deleteCommentFunc (fromDom) {
      $.ajax({
         url: '/api/post' + fromDom.currentTarget.pathname,
         method: 'DELETE',
         datatype: 'json',
         success: (data) => {
            document.getElementById(`ptag-${data.comment._id}`).remove();
         },
         error: (err) => {
            console.log(err);
         }
      });
   }