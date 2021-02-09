import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux';
import {loadProfile} from '../../redux/user/userAction';
import {followingNewUser, unFollowingOldUser} from '../../redux/mainUser/mainUserAction';
import {addNewFollower, deleteOldFollower} from '../../redux/user/userAction';
import {getUserData, isScreenLoaded, isPageFound, getUserPost} from '../../redux/user/userSelector';
import {getCurrentUser} from '../../redux/mainUser/mainUserSelector';
import {createStructuredSelector} from 'reselect';
import UserContent from "../userContent/usersContent";
import Avatar from '@material-ui/core/Avatar';
import Loader from '../loader/loader';
import {Redirect} from 'react-router-dom';


import './anotherUserProfile.scss';


const AnotherUserProfile = ({match, getProfile, userData, screenLoad, followingUser, unfollowingUser, currentUser, addingFollower, deletingFollower, pageFound, post}) => {
    const [followCheck, followChecker] = useState(currentUser?.following.includes(match.params.username)? 'UnFollow':'Follow');

    useEffect(() => {
        const username = match.params.username;
        getProfile({username});
    }, [getProfile])
    
    const {userName, Bio, profileImg, follower, following} = userData ? userData : {
        userName: match.params.username, 
        Bio: '', 
        ProfileImg: '',
        follower: [], 
        following: []
    }
    
    return !pageFound ? (
        <div className='userProfile__container'>
            {screenLoad ? null:(<Loader />)}
            <div className="userInfo__container">
                <div className="userInfo">
                    <div className="userProfileImage__container">
                        <Avatar className='userProfileImage' alt='Sarthak' src={profileImg ? profileImg : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'}/>
                    </div>
                </div>
                <div className="userInfo">
                    <div className="userName__container">
                        <div className="username">
                            <h2>{userName}</h2>
                        </div>
                    </div>
                    <div className="userEngagement">
                        <div className="user__post"><p>{post? Object.keys(post).length : 0} Post</p></div>
                        <div className="user__follower"><p>{follower.length} Followers</p></div>
                        <div className="user__following"><p>{following.length} Following</p></div>
                    </div>
                    <div className="userBio">
                        <p>{Bio}</p>
                    </div>
                    <div className='follow__btnContainer'>
                        <button className='follow__btn' onClick={() => {
                            const newUserName = userData.userName;
                            const currentUserName = currentUser.userName;
                            if (followCheck === "Follow") {
                                followingUser(newUserName, currentUser);
                                addingFollower(userData, currentUserName)
                                return followChecker('UnFollow');
                            } else {
                                unfollowingUser(newUserName, currentUser)
                                deletingFollower(userData, currentUserName)
                                return followChecker('Follow') 
                            }
                        }}>{followCheck}</button>
                    </div>
                </div>
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
                        {post ? Object.values(post).map(userPost => {
                            return (
                            <UserContent userPost={userPost} key={userPost.id}/>
                        )}): null}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div><h1>Page Not Found</h1></div>
    )
}


const mapDispatchToProps = dispatch => ({
    getProfile: (username) => dispatch(loadProfile(username)),
    followingUser: (newUserName, currentUser) => dispatch(followingNewUser(newUserName, currentUser)),
    unfollowingUser: (newUserName, currentUser) => dispatch(unFollowingOldUser(newUserName, currentUser)),
    addingFollower: (userData, currentUserName) => dispatch(addNewFollower(userData, currentUserName)),
    deletingFollower: (userData, currentUserName) => dispatch(deleteOldFollower(userData, currentUserName)),
})

const mapStateToProps = createStructuredSelector({
    userData: getUserData,
    screenLoad: isScreenLoaded,
    currentUser: getCurrentUser,
    pageFound: isPageFound,
    post: getUserPost
})

export default connect(mapStateToProps, mapDispatchToProps)(AnotherUserProfile);