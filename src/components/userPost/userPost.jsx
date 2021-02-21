import React from 'react';
import Post from '../post/post';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import { getCurrentUser } from '../../redux/mainUser/mainUserSelector';
import { postState } from '../../redux/posts/posts.selector';
import {createStructuredSelector} from 'reselect';





import './userPost.scss';


const UserPostPage = ({userPostState}) => {
    return userPostState ? userPostState.map(post => (
        <Post key={`${post.uid}`}post={post}/>
    )) : (
        <div>hello</div>
    )
}

const UserPost = ({match, currentUser, userPostState}) => {
    const userPostArr = Object.values(userPostState);
    return (
        <div>
            <Route exact path={`${match.path}`} render={() => {
                return (
                    <UserPostPage userPostState={userPostArr}/>
                )
            }}/>
            {!currentUser && <Redirect to='/signin'/>}
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    currentUser: getCurrentUser,
    userPostState: postState
})


export default connect(mapStateToProps)(UserPost);