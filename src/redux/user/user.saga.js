import {takeLatest, put, all, call} from 'redux-saga/effects';
import {getUserDataFromUserName, incrementFollowerOfUser, decrementFollowerOfUser, getCurrentUserPost} from '../../Firebase/firebase.utils';
import userTypes from './userTypes';
import {loadedProfile, userProfileScreenLoaded, changeInNewUser, noPageFound} from './userAction';


function* loadingProfile({payload: {username}}) {
    try {
        yield put(userProfileScreenLoaded())
        const {userDataRef, postObj} = yield getUserDataFromUserName(username);
        if(!userDataRef) return yield put(noPageFound());
        const snapShot = yield userDataRef.get();
        const userData = {...snapShot.data()};
        yield put(loadedProfile({
            userPost: postObj,
            userData
        }));
    } catch (error) {
        console.log(error.message);
    }
}

function* loadingProfileBySearch({payload}) {
    yield put(userProfileScreenLoaded())
    const userPost = yield getCurrentUserPost(payload.userName);
    yield put(loadedProfile({
        userPost,
        userData: payload
    }))
}

function* addingFollower({payload: {userData, currentUserName}}) {
    if (!userData || !currentUserName) return;
    if(userData.follower.includes(currentUserName)){
        return console.log('issue')
    }
    try{
        const newUserRef = yield incrementFollowerOfUser(userData, currentUserName)
        const snapshotFromNewUser = yield newUserRef.get();
        yield put(changeInNewUser({
            ...snapshotFromNewUser.data()
        }))
    }catch(error) {
        console.log(error.message)
    }
}

function* deletingFollower({payload: {userData, currentUserName}}) {
    if (!userData || !currentUserName) return;
    if(!userData.follower.includes(currentUserName)){
       console.log(userData.follower.includes(currentUserName))
        return console.log('issue')
    }
    try{
        const newUserRef = yield decrementFollowerOfUser(userData, currentUserName)
        const snapshotFromNewUser = yield newUserRef.get();
        yield put(changeInNewUser({
            ...snapshotFromNewUser.data()
        }))
    }catch(error) {
        console.log(error.message)
    }
}

function* onLoadProfile() {
    yield takeLatest(userTypes.LOAD_PROFILE, loadingProfile)
}

function* onLoadProfileBySearch() {
    yield takeLatest(userTypes.LOAD_PROFILE_BY_SEARCH, loadingProfileBySearch)
}
function* onAddingFollower() {
    yield takeLatest(userTypes.ADD_FOLLOWER, addingFollower)
}
function* onDeletingFollower() {
    yield takeLatest(userTypes.DELETE_FOLLOWER, deletingFollower)
}

export function* userSaga() {
    yield all([call(onLoadProfile), call(onAddingFollower), call(onDeletingFollower), call(onLoadProfileBySearch)])
}