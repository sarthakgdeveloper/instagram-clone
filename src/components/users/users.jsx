import React from 'react'
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getCurrentUser} from '../../redux/mainUser/mainUserSelector';
import {Route,Switch} from 'react-router-dom';
import UserProfileRoute from '../userProfileRoute/userProfileRoute';
import AnotherUserProfile from '../anotherUserProfile/anotherUserProfile';
import './user.scss';

const User = ({match, currentUser}) => {

    const {userName} = currentUser ? currentUser : {
        userName: ''
    }
    return (
    <div>
        <Switch>
            <Route path={`${match.path}/${userName}`} component={UserProfileRoute}/>
            <Route path={`${match.path}/:username`} component={AnotherUserProfile}/>
        </Switch>
    </div>
)};



const mapStateToProps = createStructuredSelector({
    currentUser: getCurrentUser,
})

export default connect(mapStateToProps)(User);