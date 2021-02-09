
import mainUserTypes from './mainUserTypes';

const currentUser = JSON.parse(localStorage.getItem("currentUser"));


const INITIAL_STATE = {
    currentUser,
    error: null,
    isSignedUp: false,
    userPost: null
};


const mainUserReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){

        case mainUserTypes.SIGN_IN_SUCCESS:
            localStorage.setItem("currentUser", JSON.stringify(action.payload));
            return {
                ...state,
                currentUser: JSON.parse(localStorage.getItem("currentUser")),
                error: null,
                isSignedUp: false,
            }
        case mainUserTypes.SIGN_OUT:
            localStorage.setItem("currentUser", JSON.stringify(null))
            return {
                ...state,
                currentUser: JSON.parse(localStorage.getItem("currentUser")),
                error: null,
                isSignedUp: false
            }
        case mainUserTypes.SIGN_UP_TRUE:
            return{
                ...state,
                isSignedUp: true
            }

        case mainUserTypes.CHANGE_IN_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            }
        case mainUserTypes.LOADING_USER_POST:
            return {
                ...state,
                userPost: action.payload
            }
        default:
            return{
                ...state
            }
    }
}

export default mainUserReducer;

