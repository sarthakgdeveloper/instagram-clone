import userTypes from "./userTypes";

export const incrementLike = (user) => ({
  type: userTypes.INCREMENT_LIKES,
  payload: user,
});

export const addNewComment = (user, comment) => ({
  type: userTypes.ADD_COMMENT,
  payload: {
    user,
    comment,
  },
});

export const removeComment = (user, comment) => ({
  type: userTypes.REMOVE_COMMENT,
  payload: {
    user,
    comment,
  },
});

export const loadProfile = (username) => ({
  type: userTypes.LOAD_PROFILE,
  payload: username,
});

export const loadProfileBySearch = (userData) => ({
  type: userTypes.LOAD_PROFILE_BY_SEARCH,
  payload: userData,
});

export const profileLoadedBySearch = () => ({
  type: userTypes.PROFILE_LOADED_BY_SEARCH,
});

export const profileLoadedByClick = () => ({
  type: userTypes.PROFILE_LOADED_BY_CLICK,
});

export const loadedProfile = ({ userData, userPost }) => ({
  type: userTypes.LOADED_PROFILE,
  payload: { userData, userPost },
});
export const userProfileScreenLoaded = () => ({
  type: userTypes.USER_PROFILE_SCREEN_LOADED,
});

export const changeInNewUser = (updatedUser) => ({
  type: userTypes.CHANGE_IN_NEW_USER,
  payload: updatedUser,
});

export const addNewFollower = (userData, currentUserName) => ({
  type: userTypes.ADD_FOLLOWER,
  payload: {
    userData,
    currentUserName,
  },
});

export const deleteOldFollower = (userData, currentUserName) => ({
  type: userTypes.DELETE_FOLLOWER,
  payload: {
    userData,
    currentUserName,
  },
});
export const noPageFound = () => ({
  type: userTypes.NO_PAGE_FOUND,
});

export const changeInOtherPost = (newPost, oldPost) => ({
  type: userTypes.CHANGE_IN_OTHER_POST,
  payload: { newPost, oldPost },
});
