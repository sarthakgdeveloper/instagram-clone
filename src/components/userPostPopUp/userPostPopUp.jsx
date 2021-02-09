import React from 'react';
import './userPostPopUp.scss';


const UserPostPopUp = ({postPopUp, userPost, handlePopUpClose}) => (
    <div className={`userPost__PopUp ${postPopUp ? "show__PopUp":''}`}>
        <div className='userPost__PopUpContainer'>
            <div className='userPost__PopUpImageContainer'>
                <div className="userPost__PopUpImage">
                    <img src={userPost.imageUrl} alt=""/>    
                </div>
                <div className="userPost__PopUpInfo">
                    <div className="post__infoContainer">
                        <div className="post__info">
                            <span><i className={`far fa-heart`}></i></span>
                            <span><i className="far fa-comment"></i></span>
                            <span><i className="fas fa-share"></i></span>
                        </div>
                        <span><i className="far fa-bookmark"></i></span>
                    </div>
                </div>
            </div>
            <div className='userPost__PopUpCommentContainer'>
                <div className="userPost__PopUpComments">
                    <div>
                        <p className='userPost__comments'>mainUser: commentdddddddddddddddddddddddddddddddddddddddddddddddddddddd</p>
                        <span><i class="fas fa-times"></i></span>
                    </div>
                </div>
                <div className="userPost__PopUpInputComment">
                    <form className="post__commentInputContainer">
                        <input type='text' placeholder='Add a Comment...'/>
                        <button type='submit' className='comment__postButton'>Post</button>
                    </form>
                </div>
            </div>
            <div>
                <span onClick={handlePopUpClose}><i class="fas fa-times userPost__PopUpClose"></i></span>
            </div>
        </div>
    </div>
)

export default UserPostPopUp;