import React, {useState, useEffect} from 'react';
import {firestore} from '../../Firebase/firebase.utils';
import Avatar from '@material-ui/core/Avatar';
import './searchUser.scss'

function SearchUser() {
    const [searchContent, getSearchContent] = useState('');

    useEffect(() => {
        const checkRef = firestore.collection('users');
        const check = checkRef.where("userName", "<", searchContent).get().then(snapshot => {

            console.log(snapshot)
        })
    }, [searchContent]) 

    const handleChange = e => {
        getSearchContent(e.target.value);
    }
    return (
        <div className='searchUser__container'>
            <div className="searchUser">
                <input type="text" placeholder='Search' className='search__input' onChange={handleChange} value={searchContent}/>
                <div className="search__result">
                    <div className="searchUser__resultContainer">
                        <div >
                            <Avatar className='userProfileImage' alt='Sarthak' src='https://instagram.fdel1-4.fna.fbcdn.net/v/t51.2885-19/s320x320/123204445_671677500211604_6925751201039816816_n.jpg?_nc_ht=instagram.fdel1-4.fna.fbcdn.net&_nc_ohc=Q4z-PPXCWpUAX8W68Es&tp=1&oh=d902fd4db0b37f46eae4b04ebdc602d1&oe=603CE56F'/>
                        </div>
                        <p>username</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchUser
