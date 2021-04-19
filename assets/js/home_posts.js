/***************************home-comments-section******************************/

class postComment{
    constructor(postId){
        this.postId = postId;
        this.commentForm = $(`#post-${ postId }-comments-form`);
        let comments = document.querySelectorAll(`#post-${postId} .delete-comment-button`);
        let self = this;
        comments.forEach(comment => {
            self.deleteComment(comment);
        });
        this.createComment(postId);
    }

    //method to collect comment form data via AJAX 
    createComment = function(postId){
        let commentForm = $(this.commentForm);
        let self = this;
        
        commentForm.submit(function(e){
            e.preventDefault();
    
            $.ajax({
                url: '/comments/create',
                method: 'post',
                data: commentForm.serialize(),
                success: function(data){
                    let newComment = self.newCommentDOM(data.data.comment, data.data.comment_user);
                    $(`#post-comments-${ postId }`).prepend(newComment);
                    self.deleteComment($(` .delete-comment-button`, newComment));

                    new Noty({
                        theme: 'relax',
                        type: 'success',
                        text: 'Comment Added!',
                        layout: 'topRight',
                        timeout: 1500,
                    }).show();
                },
                error: function(error){
                    console.log(error.responseText);
                    new Noty({
                        theme: 'relax',
                        type: 'error',
                        text: 'Error adding Comment',
                        layout: 'topRight',
                        timeout: 1500,
                    }).show();
                }
            })
        });
    }
    
    //method to display comment data on home page via AJAX
    newCommentDOM = function(comment, username){
        return $(
        `
            <li id="comment-${ comment._id }"> 
                <p>
                    <small>
                        <a href="/comments/destroy/${ comment._id }" class="delete-comment-button">x</a>
                    </small> 
                    <span>
                        ${ comment.content }
                    </span>
                    <br>
                    <small>
                        ${ username }
                    </small>
                </p>
            </li>
        `)
    }

    //method to delete comment via AJAX
    deleteComment = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                url: $(deleteLink).prop('href'),
                method: 'get',
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        type: 'success',
                        text: 'Comment Deleted!',
                        layout: 'topRight',
                        timeout: 1500,
                    }).show();
                },
                error: function(error){
                    console.log(error.responseText);
                    new Noty({
                        theme: 'relax',
                        type: 'error',
                        text: 'Error deleting Comment',
                        layout: 'topRight',
                        timeout: 1500,
                    }).show();
                }
            });
        });
    }
}


/*************************home-post-section******************************/




{
        
    //method to send form data to posts_controller using ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                url: '/posts/create',
                method: 'post',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post, data.data.post_user);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(` .delete-post-button`, newPost));
                    new postComment(data.data.post._id);

                    new Noty({
                        theme: 'relax',
                        type: 'success',
                        text: 'Post Added!',
                        layout: 'topRight',
                        timeout: 1500,
                    }).show();
                },
                error: function(error){
                    console.log(error.responseText);
                    
                    new Noty({
                        theme: 'relax',
                        type: 'error',
                        text: 'Error adding Post',
                        layout: 'topRight',
                        timeout: 1500,
                    }).show();

                }
            });
        });
    }

    //method to display post created on home page
    let newPostDom = function(post, username){
        return $(`
            <li id="post-${ post._id }">
                <p>
                    <small>
                        <a class="delete-post-button" href="/posts/destroy/${ post._id }">x</a>
                    </small>       
                    <strong>
                        ${ post.content }
                    </strong>
                    <br>
                    <small>
                        ${ username }
                    </small>
                </p>
        
                <div class="post-comments">
                
                    <form id="post-${post._id}-comments-form" action="/comments/create" method="POST" >
                        <input type="text" name="content" placeholder="Type to add Comment..." required>
                        <input type="hidden" name="post" value="${ post._id }">
                        <button type="submit">Comment</button>
                    </form>
            
                    <div class="post-comments-list">
                        <ul id="post-comments-${ post._id }">
                            
                        </ul>
                    </div>
                </div>
            </li> 
        `)
    }

    //add method to delete post using AJAX
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                url: $(deleteLink).prop('href'),
                method: 'get',
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        type: 'success',
                        text: 'Post Deleted!',
                        layout: 'topRight',
                        timeout: 1500,
                    }).show();
                },
                error: function(error){
                    console.log(error.responseText);

                    new Noty({
                        theme: 'relax',
                        type: 'error',
                        text: 'Error Deleting Post',
                        layout: 'topRight',
                        timeout: 1500,
                    }).show();
                }
            })
        });
    }

    let updateDeleteButton = function(){
        let posts = document.querySelectorAll(('#posts-list-container>ul>li'));
        
        posts.forEach(post => {
            let deleteLink = post.querySelector(`.delete-post-button`);
            deletePost(deleteLink);
            new postComment(post.id.split('-')[1]);
        });
    }

    createPost();
    updateDeleteButton();
}