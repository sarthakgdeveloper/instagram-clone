import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {incrementLike, getNewComment, removeComment} from '../../redux/posts/posts.action';
import {getCurrentUser} from '../../redux/mainUser/mainUserSelector';
import UserPostPopUp from '../userPostPopUp/userPostPopUp';


import './post.scss';

const Post = ({post, addLike, currentUser, addComment, deleteComment}) => {
    const [newComment, getComment] = useState('');
    const [postPopUp, doPostPopUp] = useState(false);

    const handlePopUpShow = () => {
        doPostPopUp(true);
    }
    const handlePopUpClose = () => {
        doPostPopUp(false);
    }

    const {userName, caption, imageUrl, likes, comments} = post;
    const user = 'onPage';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment) {
            addComment(post, newComment, currentUser.userName, user);
        }
        return getComment('')
    }

    const handleChange = (e) => {
        getComment(e.target.value);
    }

    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar className='post__avatar' alt={userName.toUpperCase()} src='/static/images/avatar/1.jpg'/>
                <h3><Link to={`/users/${userName}`}>{userName}</Link></h3>
            </div>
            <img src= {imageUrl} className='post__image' alt='Postimage'/>
            <div className="post__infoContainer">
                <div className="post__info">
                    <span onClick={() => {
                        addLike(post, currentUser.userName,user)
                    }}><i className={`far fa-heart ${likes.includes(currentUser.userName)?'liked':null}`}></i></span>
                    <span onClick={handlePopUpShow}><i className="far fa-comment"></i></span>
                    <span><i className="fas fa-share"></i></span>
                </div>
                <span><i className="far fa-bookmark"></i></span>
            </div>
            <div className='post__likes'>
                <span>{likes.length ? likes.length:null}</span>
            </div>
            <h4 className='post__text'><b>{userName}</b> {caption}</h4>
            <div>
                {comments ? comments.map((comment, index) => (
                    <div className="post__commentContainer" key={`${post.uid}_${index}`}>
                        <p className='post__comment'>{comment.userName}: {comment.comment}</p>
                        {comment.userName === currentUser.userName ? (
                            <span onClick={() => {
                                deleteComment(post, comment, user)
                            }}><i className="fas fa-times"></i></span>
                        ):null}
                    </div>
                )):null}
            </div>
            <div>
                <form className="post__commentInputContainer" onSubmit={handleSubmit}>
                    <input type='text' placeholder='Add a Comment...' onChange={handleChange} value={newComment}/>
                    <button type='submit' className='comment__postButton'>Post</button>
                </form>
            </div>
            <UserPostPopUp postPopUp={postPopUp} userPost={post} handlePopUpClose={handlePopUpClose} user='onPage'/> 
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({
    addLike: (post, currentUser, user) => dispatch(incrementLike(post, currentUser, user)),
    addComment: (post, comment, currentUser, user) => dispatch(getNewComment(post, comment, currentUser, user)),
    deleteComment: (post, comment, user) => dispatch(removeComment(post,comment, user)),
})

const mapStateToProps = (state, user) => ({
    currentUser: getCurrentUser(state)
})


 export default connect(mapStateToProps, mapDispatchToProps)(Post);