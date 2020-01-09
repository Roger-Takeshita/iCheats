const postsURL = 'api/posts';

if ($('.dropdown-trigger').length) {
   $('.dropdown-trigger').dropdown()
}

$('.modal').modal();

$.ajax({
   url: postsURL,
   method: 'GET',
   datatype: 'json',
   success: (data) => {
      data.posts.forEach(function(post) {
         let listPostsHTML = `
            <div class="post">
               <div class="user-info">
                  <img src="${post.user.avatar}" alt="avatar" class="avatar-post">
                  <span class="user-name">&nbsp;&nbsp;&nbsp;${post.user.givenName} ${post.user.familyName}</span>`;
                  if (data.currentUser && (data.currentUser._id === post.user._id || data.currentUser.adm)) {
                  listPostsHTML += `
                  <a class="modal-trigger dots" href="#1st${post._id}">[...]</a>
                  <div id="1st${post._id}" class="modal">
                  <div class="modal-content">
                     <h6>Edit Post - Menu</h6>
                     <button class="modal-trigger" href="#2nd${post._id}">Edit</button>
                     <form action="/${post._id}?_method=DELETE" method="POST">
                        <button type="submit">Delete</button>
                     </form>
                  </div>
                  </div>
                  <div id="2nd${post._id}" class="modal">
                     <div class="modal-content">
                        <h6>Edit Post</h6>
                        <form action="/${post._id}?_method=PUT" method="POST">
                        <input type="text" name="text" class="new-post" style="border: 1px solid lightgrey;" value="${post.post}">
                        <button type="submit" class="btn white-text">Update Post</button>
                        </form>
                     </div>
                  </div>`
                  }
                  document.getElementsByTagName
               listPostsHTML +=  `
               </div>
               <div class="user-post">
                  <p>${post.post}</p>
               </div>
               <div class="user-comment">
                  <p id="comments">Comments:</p>`;
                  post.comments.forEach(function(comment) {
                     if (data.currentUser && (data.currentUser._id === comment.user._id || data.currentUser.adm)) {
                        listPostsHTML += `
                        <form id="form-${comment._id}" action="/comment/${post._id}/${comment._id}?_method=DELETE" method="POST">
                           <p><span class="full-name-comment">&nbsp;&nbsp;[${comment.user.givenName} ${comment.user.familyName}]</span> ${comment.comment}
                           <a class="edit modal-trigger" href="#1st${comment._id}">(edit)</a>
                           <a class="delete" href="javascript:{}" onclick="document.getElementById('form-${comment._id}').submit();">(delete)</a>
                        </form>
                              <div id="1st${comment._id}" class="modal">
                                 <div class="modal-content">
                                    <h6>Edit Comment</h6>
                                    <form action="/comment/${post._id}/${comment._id}?_method=PUT" method="POST">
                                       <input type="text" name="text" value="${comment.comment}">
                                       <button type="submit">Update Comment</button>
                                    </form>
                                 </div>
                              </div>
                           </p>
                        `;
                     } else {
                        listPostsHTML += `
                           <p><span class="full-name-comment">&nbsp;&nbsp;[${comment.user.givenName} ${comment.user.familyName}]</span> ${comment.comment}</p>
                        `;
                     };
                  });
         if (data.currentUser) {
            listPostsHTML += `      
               </div>
               <div class="user-new-comment">
                  <form action="/comment/${post._id}" method="POST">
                     <div class="comment-field">
                        <input id="input-new-comment" type="text" name="text">
                        <button id="button-new-comment" type="submit">Comment</button>
                     </div>
                  </form>
               </div>
            </div>`;
         }else {
            listPostsHTML += `      
               </div>
            </div>`;
         }
         $('.modal').modal();
         $('#posts').append(listPostsHTML);
      })
   },
   error: (err) => {
      console.log(err);
   }
});