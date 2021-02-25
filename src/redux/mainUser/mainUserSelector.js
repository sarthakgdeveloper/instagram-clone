import {createSelector} from 'reselect';

const mainUserState = (state) => {
    return state.mainUser;
};

export const getCurrentUser = createSelector([mainUserState], state => state.currentUser);
export const loadCurrentUserPost = createSelector([mainUserState], state => state.userPost);
export const loadCurrentUserNotification = createSelector([mainUserState], state => state.notification);
export const isThereNewNotification = createSelector([mainUserState], state => state.isThereNewNotification);

export const getIsSignedUp = createSelector([mainUserState], state => state.isSignedUp);