import {takeLatest, put, all, call} from 'redux-saga/effects';
import {getUserDataFromUserName, incrementFollowerOfUser, decrementFollowerOfUser} from '../../Firebase/firebase.utils';
import userTypes from './userTypes';
import {loadedProfile, userProfileScreenLoaded, changeInNewUser, noPageFound} from './userAction';


function* loadingProfile({payload: {username}}) {
    try {
        yield put(userProfileScreenLoaded())
        const {userDataRef, userPostRef} = yield getUserDataFromUserName(username);
        console.log(userDataRef)
        if(!userDataRef) return yield put(noPageFound());
        const snapShot = yield userDataRef.get();
        const userData = {...snapShot.data()};
        const PostSnapShot = yield userPostRef.get();
        const userPostData = {...PostSnapShot.data()}
        yield put(loadedProfile({
            userPostData: userPostData.posts,
            userData
        }));
    } catch (error) {
        console.log(error.message);
    }
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
function* onAddingFollower() {
    yield takeLatest(userTypes.ADD_FOLLOWER, addingFollower)
}
function* onDeletingFollower() {
    yield takeLatest(userTypes.DELETE_FOLLOWER, deletingFollower)
}

export function* userSaga() {
    yield all([call(onLoadProfile), call(onAddingFollower), call(onDeletingFollower)])
}