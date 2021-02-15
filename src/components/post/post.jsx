import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {incrementLike} from '../../redux/posts/posts.action';
// import {getPostLikes, getPostComments} from '../../redux/user/userSelector';


import './post.scss';

const Post = ({user, addLike}) => {
    const {userName, caption, imageUrl} = user;
    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar className='post__avatar' alt={userName.toUpperCase()} src='/static/images/avatar/1.jpg'/>
                <h3><Link to={`/users/${userName}`}>{userName}</Link></h3>
            </div>
            <img src= {imageUrl} className='post__image' alt='Postimage'/>
            <div className="post__infoContainer">
                <div className="post__info">
                    <span onClick={() => addLike(user)}><i className={`far fa-heart`}></i></span>
                    <span><i className="far fa-comment"></i></span>
                    <span><i className="fas fa-share"></i></span>
                </div>
                <span><i className="far fa-bookmark"></i></span>
            </div>
            <div className='post__likes'>
                <span></span>
            </div>
            <h4 className='post__text'><b>{userName}</b> {caption}</h4>
            <div>
                {/* {postComments ? postComments.map(comment => (
                    <div className="post__commentContainer">
                        <p className='post__comment'>mainUser: {comment}</p>
                        <span><i class="fas fa-times"></i></span>
                    </div>
                )):null} */}
            </div>
            <div>
                <form className="post__commentInputContainer">
                    <input type='text' placeholder='Add a Comment...'/>
                    <button type='submit' className='comment__postButton'>Post</button>
                </form>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({
    addLike: (user) => dispatch(incrementLike(user)),
    // addComment: (user, comment) => dispatch(addNewComment(user, comment)),
})

// const mapStateToProps = (state, user) => ({
//     postLikes: getPostLikes(user)(state),
//     postComments: getPostComments(user)(state)
// })


 export default connect(null, mapDispatchToProps)(Post);