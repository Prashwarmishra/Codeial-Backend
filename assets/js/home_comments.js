// class postComment{
//     constructor(postId){
//         this.postId = postId;
//         this.commentForm = $(`#post-${ postId }-comments-form`);

//         this.createComment(postId);
//     }

//     createComment = function(postId){
//         let commentForm = $(this.commentForm);
//         let self = this;
//         commentForm.submit(function(e){
//             e.preventDefault();
    
//             $.ajax({
//                 url: '/comments/create',
//                 method: 'post',
//                 data: commentForm.serialize(),
//                 success: function(data){
//                     let newComment = self.newCommentDOM(data.data.comment);
//                     $(`#post-comments-${ postId }`).prepend(newComment);
//                     self.deleteComment($(` .delete-comment-button`, newComment));
//                 },
//                 error: function(error){
//                     console.log(error.responseText);
//                 }
//             })
//         });
//     }

//     newCommentDOM = function(comment){
//         return $(
//         `
//             <li id="comment-${ comment._id }"> 
//                 <p>
//                     <small>
//                         <a href="/comments/destroy/${ comment._id }" class="delete-comment-button">x</a>
//                     </small> 
//                     <span>
//                         ${ comment.content }
//                     </span>
//                     <br>
//                     <small>
//                         ${ comment.user.name }
//                     </small>
//                 </p>
//             </li>
//         `)
//     }

//     deleteComment = function(deleteLink){
//         $(deleteLink).click(function(e){
//             e.preventDefault();

//             $.ajax({
//                 url: $(deleteLink).prop('href'),
//                 method: 'get',
//                 success: function(data){
//                     $(`#comment-${data.data.comment_id}`).remove();
//                 },
//                 error: function(error){
//                     console.log(error.responseText);
//                 }
//             });
//         });
//     }
// }
