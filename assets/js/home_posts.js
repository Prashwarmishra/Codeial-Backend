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
                    // deletePost($(`${newPost} .delete-post-button`));
                    deletePost($(` .delete-post-button`, newPost));
                },
                error: function(error){
                    console.log(error.responseText);
                }
            })
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
                    <form action="/comments/create" method="POST" >
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

    createPost();
}