import React, {useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import UserPostCollection from '../userPostCollection/userPostCollection'
import {auth} from '../../Firebase/firebase.utils';
import {signOut, getCurrentUserPost} from '../../redux/mainUser/mainUserAction';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getCurrentUser, loadCurrentUserPost} from '../../redux/mainUser/mainUserSelector';
import {Link} from 'react-router-dom';

import "./userProfile.scss";

const UserProfile = ({signingOut, currentUser, post, gettingUserPost}) => {
    const {profileImg} = currentUser;
    useEffect(() => {
        gettingUserPost(currentUser.userName)
    }, [gettingUserPost, currentUser.userName])


    const {userName, follower, following, Bio} = currentUser;
    const postArray = post?Object.values(post).reverse():[];
    const handleToPostObj = () => {
        let postObj = []
        const filteredPostCollection = postArray.map((post,index) => {
            postObj = [
                ...postObj,
                post
            ]
            if (index === postArray.length-1) {
                return postObj
            }
            if (postObj.length === 3) {
                let newArr = [...postObj]
                postObj = []
                return newArr
            }
            return null
        })
        return filteredPostCollection
    }
    const postCollection = handleToPostObj();


    return(
    <div className='userProfile__container'>
        <div className="userInfo__container">
            <div className="userInfo">
                <div className="userProfileImage__container">
                    <Avatar className='userProfileImage' alt='Sarthak' src={profileImg}/>
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
                    <div className="user__follower" ><Link to={`/users/${userName}/followers`} >{follower?.length} Followers</Link></div>
                    <div className="user__following"><Link to={`/users/${userName}/followings`}>{following?.length} Following</Link></div>
                </div>
                <div className="userBio">
                    <p>{Bio}</p>
                </div>
            </div>
        </div>
        <div className="userInfo__container">
            <Link to={`/users/${userName}/newpost`}>Add New Post?</Link>
            <Link to={`/users/${userName}/newprofileimage`}>Add New Profile Image?</Link>
        </div>
        <div className="userInfo__container">
            <div className='userContent__Container'>
                <div className="userContent__controls">
                    <button>Post</button>
                    {/* <button>Reels</button>
                    <button>Saved</button>
                    <button>Tagged</button> */}
                </div>
                <div className="userContent">
                    {postCollection.map((postArr,index) => postArr ? (<UserPostCollection userPost={postArr} key={index} user='current'/>):null)}
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