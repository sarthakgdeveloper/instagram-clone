import React, {useEffect} from 'react';
import Post from '../post/post';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import { getCurrentUser } from '../../redux/mainUser/mainUserSelector';
import { userPostState } from '../../redux/user/userSelector';
import {createStructuredSelector} from 'reselect';
import {userPostLoaded} from '../../redux/user/userAction'
import {firestore} from '../../Firebase/firebase.utils'



import './userPost.scss';


const UserPostPage = ({postState}) => {
    return postState ? postState.map(user => (
        <Post user={user}/>
    )) : (
        <div>hello</div>
    )
}

const UserPost = ({match, currentUser, postState, loadUserPost}) => {

    useEffect(() => {
        let obj = []
            firestore.collection(`post`).orderBy('timestamp', 'desc').onSnapshot(posts => {
                posts.docs.map(post => {
                    const newObj = post.data().posts;
                    const arr = Object.values(newObj);
                    const newPost = newObj[arr.length]
                    obj = [
                        ...obj,
                        {
                            ...newPost
                        }
                    ]
                    loadUserPost(obj)
                })
            })
    }, [loadUserPost])
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

const mapDispatchToProps = dispatch => ({
    loadUserPost: (post) => dispatch(userPostLoaded(post))
  })

export default connect(mapStateToProps, mapDispatchToProps)(UserPost);