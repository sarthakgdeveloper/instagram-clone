import React, {useState} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getIsSignedUp} from '../../redux/mainUser/mainUserSelector';
import SignUpPage from './signUpPage'
import AfterSignUpPage from '../afterSignUpPage/afterSignUpPage';

import './signup.scss';


const UserSignUp = ({signedUp}) => {
    const [signInInfo, setSignInInfo] = useState({
        email: '',
        cEmail: '',
        password: '',
        cPassword: ''
    })
    return (
        <div>
            <Route exact path='/signup' render={() => (<SignUpPage signInInfo={signInInfo} setSignInInfo={setSignInInfo}/>)}/>
            <Route path={`/signup/userinfo`} render={() => (<AfterSignUpPage signUpEmail = {signInInfo.email} signUpPassword={signInInfo.password}/>)}/>
            {signedUp && (<Redirect to='/signup/userinfo'/>)}
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    signedUp: getIsSignedUp,
})

export default connect(mapStateToProps)(UserSignUp);