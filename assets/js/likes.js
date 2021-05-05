class ToggleLike{
    constructor(likeButton){
        this.likeButton = likeButton;
        this.updateLikes(likeButton);
    }

    updateLikes(likeButton){

        $(likeButton).click(function(e){
            e.preventDefault();
            
            $.ajax({
                url: $(likeButton).prop('href'),
                method: 'post',
                success: function(data){
                    let currLikes = $(likeButton).attr('data-likes');
                    
                    if(data.data.isDeleted){
                        currLikes--;
                    }else{
                        currLikes++;
                    }

                    //update data-likes attribute value
                    $(likeButton).attr('data-likes', currLikes);

                    //update likes count
                    let temp = $(likeButton)[0];
                    temp.querySelector('.current-likes').innerHTML = currLikes;
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });

    }
}