import {all, call} from "redux-saga/effects";
import {mainUserSaga} from './mainUser/mainUser.saga';
import {userSaga} from './user/user.saga';
import {postSaga} from './posts/posts.saga';


export function* rootSaga() {
    yield all([
        call(mainUserSaga),
        call(userSaga),
        call(postSaga)
    ])
}


export default rootSaga;