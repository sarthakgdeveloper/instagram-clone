
export const updatePostInObj = (newPost, oldPost, objOfPost) => {
    const arrOfPost = Object.values(objOfPost);
    if(!arrOfPost.includes(oldPost)) return objOfPost;
    const indexOfPost = arrOfPost.indexOf(oldPost);
    if (!newPost) {
        arrOfPost.splice(indexOfPost, 1);
    } else {
        arrOfPost[indexOfPost] = {
            ...newPost
        }
    }
    return {...arrOfPost}

}

export const addNewPost = (newPost, objOfPost) => {
    const arrOfPost = Object.values(objOfPost);
    console.log(newPost, arrOfPost)
    arrOfPost.splice(0,0,newPost);
    return {...arrOfPost};
}