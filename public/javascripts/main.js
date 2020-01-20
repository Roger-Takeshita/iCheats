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
            chatMsg();
         }
      });
      sendButtonEl.addEventListener('click', function() {
         chatMsg();
      });
   }

//! Dropdown menu & modal pop-up
   if ($('.dropdown-trigger').length) {
      $('.dropdown-trigger').dropdown()
   }

   $('.modal').modal();

//! AJAX
   //+ Post Menu
      $('.dots').on('click', function(dots) {
         let modal = document.getElementById('append-modal');
         dots.preventDefault();
         modal.children[1].attributes[0].value = `1st-${dots.target.target}`;
         modal.children[1].children[0].children[1].setAttribute('href', `#2nd-${dots.target.target}`);
         modal.children[1].children[0].children[2].value = dots.target.target;
         modal.children[2].attributes[0].value = `2nd-${dots.target.target}`;
         modal.children[2].children[0].children[1].value = document.getElementById(`post-${dots.target.target}`).children[1].children[0].firstChild.textContent;
         modal.children[2].children[0].children[2].value = dots.target.target;
      })

   //+ Update Post Content
      $('#submit-update-post').on('click', function(editPost) {
         let updateContentEl = document.getElementById(`input-update-post`).value;
         $.ajax({
            url: '/api/post/' + editPost.currentTarget.value,
            method: 'PUT',
            datatype: 'json',
            data: {
               updatePost: updateContentEl
            },
            success: (data) => {
               document.getElementById(`post-${data.postId}`).children[1].children[0].firstChild.textContent = updateContentEl;
               M.Modal.getInstance(document.getElementById(`2nd-${data.postId}`)).close();
               M.Modal.getInstance(document.getElementById(`1st-${data.postId}`)).close();
            },
            error: (err) => {
               console.log(err);
            }
         });
      })

   //+ Delete Post
      $('#delete-post').on('click', function(deletePost) {
         $.ajax({
            url: '/api/post/' + deletePost.target.value,
            method: 'DELETE',
            datatype: 'json',
            success: (data) => {
               if (data.done) {
                  document.getElementById(`post-${deletePost.target.value}`).remove();
                  M.Modal.getInstance(document.getElementById(`1st-${deletePost.target.value}`)).close();
               }
            },
            error: (err) => {
               console.log(err);
            }
         });
      })

   //+ (edit) Comment
      $('.edit').on('click', function(editComment) {
         editComment.preventDefault();
         editCommentFunc(editComment);
      })

   //+ (delete) Comment
      $('.delete').on('click', function(deleteComment) {
         deleteComment.preventDefault();
         deleteCommentFunc(deleteComment);
      })

   //+ Submit Update Comment
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

   //+ Add a New Comment - Using Enter
      $('.input-new-comment').on('keyup', function(event) {
         if (event.keyCode === 13) {
            let postId = event.target.id.replace('input-', '');
            let newCommentEl = document.getElementById(`input-${postId}`).value;
            newCommentFunc(postId, newCommentEl);
         }
      })

   //+ Add a New Comment - Using Button
      $('.button-new-comment').on('click', function(newComment) {
         let postId = newComment.currentTarget.value;
         let newCommentEl = document.getElementById(`input-${postId}`).value;
         newCommentFunc(postId, newCommentEl);
         /* if (newCommentEl !== "") {
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
         } */
      })

//! Functions
   function chatMsg () {
      if (inputBoxEl.value !== "") {
         socket.emit('new-msg', {
            userName: userNameEl.innerHTML,
            msg: inputBoxEl.value,
            time: new Date()
         });
         inputBoxEl.value = '';
         inputBoxEl.focus();
      } else {
         inputBoxEl.focus();
      }
   }

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
            document.getElementById(`ptag-${data.commentId}`).remove();
         },
         error: (err) => {
            console.log(err);
         }
      });
   }

   function newCommentFunc (postId, newCommentEl) {
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
   }