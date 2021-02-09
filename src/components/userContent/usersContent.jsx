import React,{useState} from 'react'
import UserPostPopUp from '../userPostPopUp/userPostPopUp'
import './userContent.scss';

const UserContent = ({userPost}) => {
    const {imageUrl} = userPost;
    const [postPopUp, doPostPopUp] = useState(false);

    const handlePopUpShow = () => {
        doPostPopUp(true);
    }
    const handlePopUpClose = () => {
        doPostPopUp(false);
    }
    return (
    <div>
        <div className='userContent__post' onClick={handlePopUpShow}>
            <img src={imageUrl} alt=""/>
        </div>
        <UserPostPopUp postPopUp={postPopUp} userPost={userPost} handlePopUpClose={handlePopUpClose}/>
    </div>
)}

export default UserContent;