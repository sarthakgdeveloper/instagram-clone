
import postTypes from './posts.types';

export const getPost = (currentUserFollowing) => ({
    type: postTypes.GET_POSTS,
    payload: currentUserFollowing
})


export const postLoaded = (post) => ({
    type: postTypes.LOAD_POSTS,
    payload: post
})


export const incrementLike = (post, currentUser, user) => ({
    type: postTypes.INCREMENT_LIKES,
    payload: {
        post,currentUser,user
    }
})

export const updatePost = (newPost, oldPost) => ({
    type: postTypes.UPDATE_POST,
    payload: {
        newPost, oldPost
    }
})

export const getNewComment = (post, comment, currentUser, user) => ({
    type: postTypes.GET_COMMENT,
    payload: {
        post, comment, currentUser, user
    }
})

export const removeComment = (post, comment, user) => ({
    type: postTypes.REMOVE_COMMENT,
    payload: {
        post, comment, user
    }
})

export const addNewPost = (post) => ({
    type: postTypes.ADD_NEW_POST,
    payload: post
})


export const deletePost = (post, currentUser) => ({
    type: postTypes.DELETE_POST,
    payload:{ post, currentUser}
})

