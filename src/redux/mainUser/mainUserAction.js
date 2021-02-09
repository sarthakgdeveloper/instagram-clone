import mainUserTypes from './mainUserTypes';

export const signUpStart = (info) => ({
    type: mainUserTypes.SIGN_UP_START,
    payload: info
})

export const signInStart = (info) => ({
    type: mainUserTypes.SIGN_IN_START,
    payload: info
})

export const signInSuccess = (userData) => ({
    type: mainUserTypes.SIGN_IN_SUCCESS,
    payload: userData
})

export const signInfail = (error) => ({
    type: mainUserTypes.SIGN_IN_FAIL,
    payload: error
})

export const signUpfail = (error) => ({
    type: mainUserTypes.SIGN_UP_FAIL,
    payload: error
})

export const signOut = () => ({
    type: mainUserTypes.SIGN_OUT,
})

export const signUpTrue = () => ({
    type: mainUserTypes.SIGN_UP_TRUE
})

export const userInfoStart = (info) => ({
    type: mainUserTypes.USER_INFO_START,
    payload: info
})

export const checkCurrentUser = () => ({
    type: mainUserTypes.CHECK_CURRENT_USER,
})

export const followingNewUser = (newUserName, currentUser) => ({
    type: mainUserTypes.ADD_FOLLOWING,
    payload: {
        newUserName, 
        currentUser
    }
})

export const unFollowingOldUser = (newUserName, currentUser) => ({
    type: mainUserTypes.DELETE_FOLLOWING,
    payload: {
        newUserName, 
        currentUser
    }
})

export const changeInCurrentUser = (updatedUser) => ({
    type: mainUserTypes.CHANGE_IN_CURRENT_USER,
    payload: updatedUser
})

export const getUserPost = (userName) => ({
    type: mainUserTypes.GET_USER_POST,
    payload: userName
})

export const getCurrentUserPost = (userName) => ({
    type: mainUserTypes.GET_USER_POST,
    payload: userName
})  


export const loadUserPost = (userPost) => ({
    type: mainUserTypes.LOADING_USER_POST,
    payload: userPost
})


