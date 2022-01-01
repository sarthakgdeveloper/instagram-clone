import {updatePostInObj} from '../posts/functionsInReducers'
import userTypes from './userTypes';
const INITIAL_STATE = {
    userProfileScreenLoaded: false,
    userData: null,
    userPost: [],
    pageNotFound: false,
    profileAskedBySearch: false
};
const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case userTypes.LOADED_PROFILE:
            return {
                ...state,
                userData: action.payload.userData, 
                userPost: [...Object.values(action.payload.userPost)],
                userProfileScreenLoaded: true,
                pageNotFound: false
            }
        case userTypes.USER_PROFILE_SCREEN_LOADED:
            return {
                ...state,
                userProfileScreenLoaded: false,
            }
        case userTypes.CHANGE_IN_NEW_USER:
            return {
                ...state,
                userData: action.payload
            }
        case userTypes.NO_PAGE_FOUND:
            return {
                ...state,
                pageNotFound: true,
                userProfileScreenLoaded: true
            }
        case userTypes.CHANGE_IN_OTHER_POST:
            return {
                ...state,
                userPost: updatePostInObj(action.payload.newPost, action.payload.oldPost, state.userPost)
            }
        case userTypes.PROFILE_LOADED_BY_SEARCH:
            return {
                ...state,
                profileAskedBySearch: true
            }
        case userTypes.PROFILE_LOADED_BY_CLICK:
            return {
                ...state,
                profileAskedBySearch: false
            }
        default:
            return{
                ...state
            }
    }
}
export default userReducer;

