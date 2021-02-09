import React, {useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import UserContent from "../userContent/usersContent";
import {auth} from '../../Firebase/firebase.utils';
import {signOut, getCurrentUserPost} from '../../redux/mainUser/mainUserAction';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getCurrentUser, loadCurrentUserPost} from '../../redux/mainUser/mainUserSelector';
import {Redirect, Link, Route} from 'react-router-dom';

import "./userProfile.scss";

const UserProfile = ({signingOut, currentUser, post, gettingUserPost}) => {
    
    const {userName, follower, following, Bio} = currentUser;

    useEffect(() => {
        gettingUserPost(currentUser.userName)
    }, [])

    return(
    <div className='userProfile__container'>
        <div className="userInfo__container">
            <div className="userInfo">
                <div className="userProfileImage__container">
                    <Avatar className='userProfileImage' alt='Sarthak' src='https://instagram.fdel1-4.fna.fbcdn.net/v/t51.2885-19/s320x320/123204445_671677500211604_6925751201039816816_n.jpg?_nc_ht=instagram.fdel1-4.fna.fbcdn.net&_nc_ohc=Q4z-PPXCWpUAX8W68Es&tp=1&oh=d902fd4db0b37f46eae4b04ebdc602d1&oe=603CE56F'/>
                </div>
            </div>
            <div className="userInfo">
                <div className="userName__container">
                    <div className="username">
                        <h2>{userName}</h2>
                    </div>
                    <div className="user__logOut">
                        <button onClick={() => {
                        signingOut();
                        auth.signOut()
                    }}>Log Out</button>
                    </div>
                </div>
                <div className="userEngagement">
                    <div className="user__post"><p>{post ? Object.keys(post).length : 0} Post</p></div>
                    <div className="user__follower"><p>{follower.length} Followers</p></div>
                    <div className="user__following"><p>{following.length} Following</p></div>
                </div>
                <div className="userBio">
                    <p>{Bio}</p>
                </div>
            </div>
        </div>
        <div className="userInfo__container">
            <Link to={`${userName}/newpost`}>Add New Post?</Link>
        </div>
        <div className="userInfo__container">
            <div className='userContent__Container'>
                <div className="userContent__controls">
                    <button>Post</button>
                    <button>Reels</button>
                    <button>Saved</button>
                    <button>Tagged</button>
                </div>
                <div className="userContent">
                    {post? Object.values(post).map(userPost => {
                        return (
                        <UserContent userPost={userPost} key={userPost.id}/>
                    )}):null}
                </div>
            </div>
        </div>
    </div>
)}

const mapDispatchTProps = dispatch => ({
    signingOut: () => dispatch(signOut()),
    gettingUserPost: (username) => dispatch(getCurrentUserPost(username))
})

const mapStateToProps = createStructuredSelector({
    currentUser: getCurrentUser,
    post: loadCurrentUserPost
})

export default connect(mapStateToProps, mapDispatchTProps)(UserProfile);