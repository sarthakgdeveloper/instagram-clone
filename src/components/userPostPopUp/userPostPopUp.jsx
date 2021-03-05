import React, {useState} from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getCurrentUser} from '../../redux/mainUser/mainUserSelector';
import {incrementLike, getNewComment, removeComment, deletePost} from '../../redux/posts/posts.action';

import './userPostPopUp.scss';


const UserPostPopUp = ({postPopUp, userPost, handlePopUpClose, currentUser, addLike, addComment, deleteComment, user, removePost}) => {

    const [newComment, getComment] = useState('');
    const [deleteOption, changeDeleteOption] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment) {
            addComment(userPost, newComment, currentUser.userName, user);
        }
        return getComment('')
    }

    const handleDeleteOptionChange = () => {
        return changeDeleteOption(!deleteOption);
    }

    const handleChange = (e) => {
        getComment(e.target.value);
    }

    return (
    <div className={`userPost__PopUp ${postPopUp ? "show__PopUp":''}`}>
        <div className='userPost__PopUpContainer'>
            <div className='userPost__PopUpImageContainer'>
                <div className="userPost__PopUpImage">
                    <img src={userPost.imageUrl} alt="" onDoubleClick={() => {
                    addLike(userPost,currentUser.userName, user)
                    }}/>
                </div>
                <div className="userPost__PopUpInfo">
                    <div className="post__infoContainer">
                        <div className="post__info">
                            <span onClick={() => {
                                addLike(userPost, currentUser.userName, user)
                                
                            }} ><i className={`fa fa-heart ${userPost.likes.includes(currentUser.userName)?'liked':null}`}></i></span>
                            <span><i className="far fa-comment"></i></span>
                            {/* <span><i className="fas fa-share"></i></span> */}
                        </div>
                        {/* <span><i className="far fa-bookmark"></i></span> */}
                    </div>
                    <div className='popUp_Likes'>
                        {userPost.likes.length}
                    </div>
                </div>
            </div>
            <div className='userPost__PopUpCommentContainer'>
                <div className='userPost__popUpCaption'>
                    <p>
                        {`${userPost.userName} ${userPost.caption? `: ${userPost.caption}`: ''}`}
                    </p>
                </div>
                <div className="userPost__PopUpComments">
                        {userPost.comments ? userPost.comments.map((comment, index) => (
                        <div key={`${userPost.uid}_${index}`} className='userPost__EachComment'>
                            <p className='userPost__comments'>{comment.userName}: {comment.comment}</p>
                            {comment.userName === currentUser.userName ? (
                                <span onClick={() => {
                                    deleteComment(userPost, comment, user)
                                }} className='userPost__CommentDelete'><i className="fas fa-times"></i></span>
                            ):null}
                        </div>
                    )):null}
                </div>
                <div className="userPost__PopUpInputComment">
                    <form className="post__commentInputContainer" onSubmit={handleSubmit}>
                        <input type='text' placeholder='Add a Comment...' onChange={handleChange} value={newComment}/>
                        <button type='submit' className='comment__postButton'>Post</button>
                    </form>
                </div>
            </div>
            <div className='userPost__PopUpCloseOption'>
                <span onClick={handlePopUpClose}><i className="fas fa-times userPost__PopUpClose"></i></span>
                {user === 'current' && (
                    <div>
                        <span onClick={handleDeleteOptionChange}><i className="fas fa-ellipsis-v userPost__PostDelete"></i></span>
                        <div className={`post__Delete ${deleteOption ? "DeleteOption__Show":''}`}>
                            <p onClick={() => removePost(userPost, currentUser.userName)}>Delete Post</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
)}

const mapStateToProps = createStructuredSelector({
    currentUser: getCurrentUser,
})

const mapDispatchToProps = dispatch => ({
    addLike: (post, currentUser,user) => dispatch(incrementLike(post, currentUser, user)),
    addComment: (post, comment, currentUser, user) => dispatch(getNewComment(post, comment, currentUser, user)),
    deleteComment: (post, comment, user) => dispatch(removeComment(post,comment, user)),
    removePost: (post, currentUser) => dispatch(deletePost(post, currentUser))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserPostPopUp);