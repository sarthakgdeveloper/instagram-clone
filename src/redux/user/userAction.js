import userTypes from './userTypes';

export const incrementLike = (user) => ({
    type: userTypes.INCREMENT_LIKES,
    payload: user
})


export const addNewComment = (user, comment) => ({
    type: userTypes.ADD_COMMENT,
    payload: {
        user,comment
    }
})

export const removeComment = (user, comment) => ({
    type: userTypes.REMOVE_COMMENT,
    payload: {
        user,comment
    }
})

export const loadProfile = (username) => ({
    type: userTypes.LOAD_PROFILE,
    payload: username
})

export const loadedProfile = ({userData, userPostData}) => ({
    type: userTypes.LOADED_PROFILE,
    payload: {userData, userPostData}
})
export const userProfileScreenLoaded = () => ({
    type: userTypes.USER_PROFILE_SCREEN_LOADED,
})

export const changeInNewUser = (updatedUser) => ({
    type: userTypes.CHANGE_IN_NEW_USER,
    payload: updatedUser
})

export const addNewFollower = (userData, currentUserName) => ({
    type: userTypes.ADD_FOLLOWER,
    payload: {
        userData, 
        currentUserName
    }
})

export const deleteOldFollower = (userData, currentUserName) => ({
    type: userTypes.DELETE_FOLLOWER,
    payload: {
        userData, 
        currentUserName
    }
})
export const noPageFound = () => ({
    type: userTypes.NO_PAGE_FOUND
})


export const userPostLoaded = (post) => ({
    type: userTypes.USER_POST_LOADED,
    payload: post
})
