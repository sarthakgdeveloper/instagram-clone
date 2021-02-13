import React from 'react';
import Post from '../post/post';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import { getCurrentUser } from '../../redux/mainUser/mainUserSelector';
import { userPostState } from '../../redux/user/userSelector';
import {createStructuredSelector} from 'reselect';





import './userPost.scss';


const UserPostPage = ({postState}) => {
    return postState ? postState.map(user => (
        <Post key={`${user.userName}${user.Id}`}user={user}/>
    )) : (
        <div>hello</div>
    )
}

const UserPost = ({match, currentUser, postState, loadUserPost}) => {
    return (
        <div>
            <Route exact path={`${match.path}`} render={() => {
                return (
                    <UserPostPage postState={postState}/>
                )
            }}/>
            {!currentUser && <Redirect to='/signin'/>}
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    currentUser: getCurrentUser,
    postState: userPostState
})


export default connect(mapStateToProps)(UserPost);