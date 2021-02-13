import React, {useState} from 'react';
import firebase from 'firebase';
import {fireStorage, firestore} from '../../Firebase/firebase.utils';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getCurrentUser} from '../../redux/mainUser/mainUserSelector';
import {Redirect} from 'react-router-dom';
import {changeInCurrentUser} from '../../redux/mainUser/mainUserAction';

import './addNewPost.scss';

const AddNewPost = ({currentUser, changedCurrentUser}) => {
    const {id, userName} = currentUser;

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [uploaded, checkUploaded] = useState(false);
    const [progress, checkProgress] = useState(0);

    const handleChange = (e) => {
        return e.target.files[0] && setImage(e.target.files[0]);
    }
    const handleUpload = (e) => {
        const uploadTask = fireStorage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const getProgress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                return checkProgress(getProgress);
            },
            (error) => {
                return alert(error.message);
            },
            () => {
                fireStorage
                  .ref("images")
                  .child(image.name)
                  .getDownloadURL()
                  .then(url => {
                      const checking = async () => {
                        const userPostRef = firestore.doc(`post/${userName}`);
                        const userEachPostRef = firestore.collection(`userPosts`).doc();
                        const snapshot = await userPostRef.get();
                        const userPostData = {...snapshot.data()};
                        const newPost = {
                        caption,
                        imageUrl: url,
                        likes: [],
                        comments: [],
                        userName,
                        id: userPostData.posts ? Object.keys(userPostData.posts).length + 1: 1,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        }
                        await userEachPostRef.set({
                            ...newPost
                        })
                        console.log(userEachPostRef)
                        if(snapshot.exists) {
                            await userPostRef.update({
                            posts: {
                                ...userPostData.posts,
                                [newPost.id]: {
                                    ...newPost
                                }
                            },
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        })
                    } else {
                        await userPostRef.set({
                            posts: {
                                [newPost.id]: {
                                    ...newPost
                                }
                            },
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        }
                      }

                      checking();
                      alert("uploaded")
                      checkUploaded(true);
                })

            }
            )
    }


    return uploaded ? <Redirect to='/'/> : (
        <div className='newPost__Container'>
            <div>
                <div>
                    <input type="file" id="img" name="img" accept="image/*" onChange={handleChange} className='newPost__Image'/>
                    <div id="myProgress">
                        <div id="myBar" style={{width: `${progress}%`}}></div>
                    </div>
                    <input type="text" placeholder='Enter A Caption...' value={caption} onChange={e => setCaption(e.target.value)}/>
                    <button onClick={handleUpload}>
                        Upload
                    </button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = createStructuredSelector({
    currentUser: getCurrentUser,
})

const mapDispatchTProps = dispatch => ({
    changedCurrentUser: (updatedUser) => dispatch(changeInCurrentUser(updatedUser))
})

export default connect(mapStateToProps, mapDispatchTProps)(AddNewPost);