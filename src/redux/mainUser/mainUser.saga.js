import {takeLatest, put, all, call} from 'redux-saga/effects';
import {auth, createUserProfileDocument, getCurrentUser, followNewUser, unfollowOldUser, getCurrentUserPost} from '../../Firebase/firebase.utils';
import mainUserTypes from '../mainUser/mainUserTypes';
import {signInSuccess, signUpfail, signUpTrue, changeInCurrentUser, loadUserPost} from './mainUserAction';



function* getSnapshotFromUser(user) {
    const AdditionalData = {
        profileImg: false,
        follower: [],
        following: [],
        likedContent: [],
        commentedContent: [],
    }
    try{
        const userRef = yield createUserProfileDocument(user, AdditionalData);
        const snapShot = yield userRef.get();
        yield put(signInSuccess({
        ...snapShot.data()
    }))} catch(error) {
        console.log(error.message);
        yield put(signUpfail(error))
    }
}

function* signUpStart({payload: {email, password, cPassword, cEmail}}) {
    if (!email || !password || !cPassword || !cEmail) return;

    if(cEmail === email && cPassword === password) {
        yield put(signUpTrue());
    } else {
        alert('Invalid Data')
    }
}
function* signInStart({payload: {email, password}}) {
    if (!email || !password) return;
    try{
        const {user} = yield auth.signInWithEmailAndPassword(email, password);
        yield getSnapshotFromUser(user);
    }catch(error) {
        console.log(error.message);
    }
 }

function* isAuthenticated() {
    const user = yield getCurrentUser();
    if (!user) return;
    yield getSnapshotFromUser(user);
}

function* userInfoEntered({payload: {email,password,displayName,userName,Bio}}) {
    try{
        const {user} = yield auth.createUserWithEmailAndPassword(email, password);
        yield getSnapshotFromUser({...user, displayName, userName, Bio});
    } catch(error) {
        console.log(error.message);
    }
}

function* followUser({payload: {newUserName, currentUser}}){
    if (!newUserName || !currentUser) return;
    if(currentUser.following.includes(newUserName)){
        return console.log('issue')
    }
    try{
        const currentUserRef = yield followNewUser(newUserName, currentUser)
        const snapshotFromCurrentUser = yield currentUserRef.get();
        yield put(changeInCurrentUser({
            ...snapshotFromCurrentUser.data()
        }))
    }catch(error) {
        console.log(error.message)
    }
}


function* unFollowUser({payload: {newUserName, currentUser}}){
    if (!newUserName || !currentUser) return;
    if(!currentUser.following.includes(newUserName)){
        console.log(currentUser.following.includes(newUserName))
        return console.log('issue')
    }
    try{
        const currentUserRef = yield unfollowOldUser(newUserName, currentUser)
        const snapshotFromCurrentUser = yield currentUserRef.get();
        yield put(changeInCurrentUser({
            ...snapshotFromCurrentUser.data()
        }))
    }catch(error) {
        console.log(error.message)
    }
}

function* gettingUserPost({payload}) {
    const postObj = yield getCurrentUserPost(payload);
    console.log(postObj)
    yield put(loadUserPost(postObj))
}
function* onSignUpStart() {
    yield takeLatest(mainUserTypes.SIGN_UP_START, signUpStart)
}

function* onSignInStart() {
    yield takeLatest(mainUserTypes.SIGN_IN_START, signInStart)
}

function* isUserAuthenticated() {
    yield takeLatest(mainUserTypes.CHECK_CURRENT_USER, isAuthenticated)
}
function* isUserInfoEntered() {
    yield takeLatest(mainUserTypes.USER_INFO_START, userInfoEntered)
}
function* onFollowUser() {
    yield takeLatest(mainUserTypes.ADD_FOLLOWING, followUser)
}
function* onUnFollowUser() {
    yield takeLatest(mainUserTypes.DELETE_FOLLOWING, unFollowUser)
}
function* onGetUserPost() {
    yield takeLatest(mainUserTypes.GET_USER_POST, gettingUserPost)
}

export function* mainUserSaga() {
    yield all([call(onSignUpStart),call(onSignInStart), call(isUserAuthenticated), call(isUserInfoEntered), call(onFollowUser), call(onUnFollowUser), call(onGetUserPost)]);
};
