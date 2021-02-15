import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import UserProfile from '../userProfile/userProfile';
import AddNewPost from '../addNewPost/addNewPost';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getCurrentUser} from '../../redux/mainUser/mainUserSelector';


const UserProfileRoute = ({match, currentUser}) => {
    return (
    <div>
        <Switch>
            <Route exact path={`${match.path}`} render={() => {
                    return !currentUser?<Redirect to='/signin'/>:<UserProfile />
                }}/>
            <Route path={`${match.path}/newpost`} component={AddNewPost}/>
        </Switch>
    </div>
)};


const mapStateToProps = createStructuredSelector({
    currentUser: getCurrentUser
})

export default connect(mapStateToProps)(UserProfileRoute);