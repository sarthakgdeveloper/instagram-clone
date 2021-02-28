
import '../addNewPost/addNewPost.scss';

import React, {useState, useCallback} from 'react';
import {fireStorage, firestore} from '../../Firebase/firebase.utils';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getCurrentUser} from '../../redux/mainUser/mainUserSelector';
import {Redirect} from 'react-router-dom';
import {changeInCurrentUser} from '../../redux/mainUser/mainUserAction';
import Button from '@material-ui/core/Button';
import Cropper from 'react-easy-crop';
import {getCroppedImg} from '../addNewPost/functionsTCrop';



const AddNewProfileImage = ({currentUser}) => {
    const {id} = currentUser;
    const inputRef = React.useRef();

    const [oldImage, setOldImage] = useState(null);
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [cropped, setCroppedArea] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [uploaded, checkUploaded] = useState(false);
    const [blob, setBlob] = useState(null);
    const [progress, checkProgress] = useState(0);
    
    const handleChange = (e) => {
        if(e.target.files.length > 0){
            setCroppedImage(null);
            setOldImage(e.target.files[0]);
            const ImageUrl = URL.createObjectURL(e.target.files[0]);
            setImage(ImageUrl);
        }
    }
    
    const showCroppedImage = useCallback(async () => {
        try {
            let croppedImage = await getCroppedImg(
                image,
                cropped,
                setBlob,
                oldImage
            )
                setImage(null);
                setCroppedImage(croppedImage)

            } catch (e) {
                console.error(e)
        }
      }, [cropped])

 

    const handlePopUp = () => inputRef.current.click();

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels)
      }, [])


    const handleUpload = (e) => {
        const uploadTask = fireStorage.ref(`profileImages/${blob.name}`).put(blob);
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
                  .ref("profileImages")
                  .child(blob.name)
                  .getDownloadURL()
                  .then(url => {
                      const checking = async () => {
                        const userRef = firestore.doc(`users/${id}`);
                        const snapshot = await userRef.get();
                        const userData = {...snapshot.data()};
                        const updateUserData = {
                            ...userData,
                            profileImg: url
                        }

                        if(snapshot.exists) {
                            await userRef.update({
                            ...updateUserData
                        })
                        } else {
                            await userRef.set({
                            ...updateUserData
                        })}
                      }

                      checking();
                      alert("Profile Image Uploaded")
                      checkUploaded(true);
                })

            }
            )
    }
    return uploaded ? <Redirect to='/'/> : (
        <div className='newPost__Container'>
                <div className="crop-container">
                    {croppedImage && !image ? (
                        <img src={croppedImage} alt="" className='profileImage__cropped'/>
                        ): (
                            <Cropper image={image} crop={crop} aspect={4/4} zoom={zoom} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} cropShape='round'/>
                        )}
                </div>
                <div className="crop-btn">
                    <Button variant='contained' onClick={handlePopUp} className='choose_btn'>Choose</Button>
                    <Button variant='contained' color='secondary' disabled={image ? false :true} onClick={showCroppedImage}>Done</Button>
                </div>
                <div className='post_info'>
                    <input type="file" id="img" name="img" accept="image/*" onChange={handleChange} className='newPost__Image' ref={inputRef} hidden/>
                    <div id="myProgress">
                        <div id="myBar" style={{width: `${progress}%`}}></div>
                    </div>
                    <Button variant='contained' color='primary' onClick={handleUpload} disabled={croppedImage?false:true}>
                        Upload
                    </Button>
                </div>
        </div>
    )
}


const mapStateToProps = createStructuredSelector({
    currentUser: getCurrentUser,
})

const mapDispatchTProps = dispatch => ({
    changedCurrentUser: (updatedUser) => dispatch(changeInCurrentUser(updatedUser)),
})

export default connect(mapStateToProps, mapDispatchTProps)(AddNewProfileImage);