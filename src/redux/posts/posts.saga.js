import {takeLatest, put, all, call} from 'redux-saga/effects';
import {startFetchingPosts, incrementingLike, gettingComment, onRemovingComment,deletingPost} from '../../Firebase/firebase.utils';
import {postLoaded, updatePost} from './posts.action'
import {changeInCurrentPost} from '../mainUser/mainUserAction';
import {changeInOtherPost} from '../user/userAction';
import postTypes from './posts.types';



function* fetchPosts() {
    const posts = yield startFetchingPosts()
    yield put(postLoaded(posts))
}

function* incrementLike({payload: {post, currentUser, user}}) {
    const updatedPost = yield incrementingLike(post, currentUser);
    if (user === 'onPage') return yield put(updatePost(updatedPost, post))
    if(user === 'current') return yield put(changeInCurrentPost(updatedPost, post))
    if(user === 'other')  return yield put(changeInOtherPost(updatedPost, post))
}

function* getComment({payload: {post, comment, currentUser, user}}) {
    const updatedPost = yield gettingComment(post, comment, currentUser);
    if (user === 'onPage') return yield put(updatePost(updatedPost, post))
    if(user === 'current') return yield put(changeInCurrentPost(updatedPost, post))
    if(user === 'other') return yield put(changeInOtherPost(updatedPost, post))
}

function* removeComment({payload: {post, comment, user}}) {
    if(!post.comments.includes(comment)) return;
    const updatedPost = yield onRemovingComment(post, comment);
    if (user === 'onPage')  return yield put(updatePost(updatedPost, post))
    if(user === 'current')  return yield put(changeInCurrentPost(updatedPost, post))
    if(user === 'other')  return yield put(changeInOtherPost(updatedPost, post))
}

function* deletePost({payload: {post, currentUser}}) {
    const newUserPostObj = yield deletingPost(post, currentUser);
    yield put(changeInCurrentPost(newUserPostObj, post));
}

function* onFetchPosts() {
    yield takeLatest(postTypes.GET_POSTS, fetchPosts)
}

function* onIncrementLike() {
    yield takeLatest(postTypes.INCREMENT_LIKES, incrementLike)
}

function* onGetComment() {
    yield takeLatest(postTypes.GET_COMMENT, getComment)
}

function* onRemoveComment() {
    yield takeLatest(postTypes.REMOVE_COMMENT, removeComment)
}
function* onDeletePost() {
    yield takeLatest(postTypes.DELETE_POST, deletePost)
}


export function* postSaga() {
    yield all([call(onFetchPosts) ,call(onIncrementLike), call(onGetComment), call(onRemoveComment), call(onDeletePost)]);
}


