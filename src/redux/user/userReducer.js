

import userTypes from './userTypes';


const INITIAL_STATE = {
    userProfileScreenLoaded: false,
    userPostData: [],
    userData: null,
    userPost: null,
    pageNotFound: false
};


const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){

        case userTypes.LOADED_PROFILE:
            return {
                ...state,
                userData: action.payload.userData,
                userPost: action.payload.userPostData,
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
        case userTypes.USER_POST_LOADED:
            return {
                ...state,
                userPostData: [...action.payload]
            }

        default:
            return{
                ...state
            }
    }
}

export default userReducer;

