import {createSelector} from 'reselect';

const userState = (state) => {
    return state.user;
}
export const userPostState = (state) => {
    return state.user.userPostData;
}


export const getPostLikes = userPost => createSelector([userPostState], (userData) => {
    const user = Object.values(userPost)[0];
    return userData ? userData[userData.indexOf(user)].userInfo.likes : null;
})

export const getPostComments = userPost => createSelector([userPostState], (userData) => {
    const user = Object.values(userPost)[0];
    return userData ? userData[userData.indexOf(user)].userInfo.comment:null;
})


export const getUserData = createSelector([userState], (user) => {
    return user.userData
})

export const getUserPost= createSelector([userState], (user) => {
    return user.userPost
})

export const isScreenLoaded = createSelector([userState], (user) => {
    return user.userProfileScreenLoaded;
})

export const isFollowed = (username) => createSelector([getUserData], (user) => {
    return user ? user.follower.includes(username) ? true: false: user;
})
export const isPageFound = createSelector([userState], (user) => {
    return user.pageNotFound;
})