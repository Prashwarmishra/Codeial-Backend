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
                    let newComment = self.newCommentDOM(data.data.comment);
                    $(`#post-comments-${ postId }`).prepend(newComment);
                    self.deleteComment($(` .delete-comment-button`, newComment));
                },
                error: function(error){
                    console.log(error.responseText);
                }
            })
        });
    }

    newCommentDOM = function(comment){
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
                        ${ comment.user.name }
                    </small>
                </p>
            </li>
        `)
    }

    deleteComment = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                url: $(deleteLink).prop('href'),
                method: 'get',
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
}




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
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(` .delete-post-button`, newPost));
                    new postComment(data.data.post._id);
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    //method to display post created on home page
    let newPostDom = function(post){
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
                        ${ post.user.name }
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
                },
                error: function(error){
                    console.log(error.responseText);
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