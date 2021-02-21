import {combineReducers} from 'redux';
import userReducer from "./user/userReducer";
import mainUserReducer from './mainUser/mainUserReducer';
import postReducer from './posts/posts.reducer';


const rootReducer = combineReducers({
   user: userReducer,
   mainUser: mainUserReducer,
   posts: postReducer
})

export default rootReducer;