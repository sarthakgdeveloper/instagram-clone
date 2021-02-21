import postTypes from "./posts.types";
import {updatePostInObj, addNewPost} from './functionsInReducers';

const INITIAL_STATE = {
    loadPosts: {},
    postUploadRate: 0,
    ifPostUpLoaded: false
}

const postReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){

        case postTypes.LOAD_POSTS:
            console.log(action.payload)
            return {
                ...state,
                loadPosts: {...action.payload}
            }
        case postTypes.UPDATE_POST:
            return {
                ...state,
                loadPosts: updatePostInObj(action.payload.newPost, action.payload.oldPost, state.loadPosts)
            }
        case postTypes.ADD_NEW_POST:
            return{
                ...state,
                loadPosts: addNewPost(action.payload, state.loadPosts)
            }
        default:
            return{
                ...state
            }
    }
}

export default postReducer;