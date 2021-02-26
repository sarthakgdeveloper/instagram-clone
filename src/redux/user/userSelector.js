import {createSelector} from 'reselect';

const userState = (state) => {
    return state.user;
}


export const getUserData = createSelector([userState], (user) => {
    return user.userData
})

export const getUserPost= createSelector([userState], (user) => {
    return user.userPost
})

export const isScreenLoaded = createSelector([userState], (user) => {
    return user.userProfileScreenLoaded;
})
export const isProfileAskedBySearch = createSelector([userState], (user) => {
    return user.profileAskedBySearch;
})

export const isFollowed = (username) => createSelector([getUserData], (user) => {
    return user ? user.follower.includes(username) ? true: false: user;
})
export const isPageFound = createSelector([userState], (user) => {
    return user.pageNotFound;
})