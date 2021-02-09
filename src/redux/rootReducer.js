import {combineReducers} from 'redux';
import userReducer from "./user/userReducer";
import mainUserReducer from './mainUser/mainUserReducer';


const rootReducer = combineReducers({
   user: userReducer,
   mainUser: mainUserReducer
})

export default rootReducer;