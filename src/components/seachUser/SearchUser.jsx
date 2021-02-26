import React, {useState, useEffect} from 'react';
import {firestore} from '../../Firebase/firebase.utils';
import {loadProfileBySearch, profileLoadedBySearch} from '../../redux/user/userAction';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import './searchUser.scss'

function SearchUser({loadProfile, loadProfileBySearch}) {
    const [searchContent, getSearchContent] = useState('');
    const [searchResult, getSearchResult] = useState([]);
    
    const checkRef = firestore.collection('users');
    useEffect(() => {
        if(searchContent.length === 0) {
            getSearchResult([])
        }
        if(searchContent.length === 1) {
            let userArr = []
            checkRef.where('searchKey', '==', searchContent.toUpperCase()).limit(10).get().then(snapshot => {
                snapshot.docs.map(user => {
                    return userArr = [
                        ...userArr,
                        {...user.data()}
                    ]
                })
                getSearchResult(userArr) 
            })
        }
        if(searchResult && searchContent.length > 1){
            let userArr = []
            userArr = searchResult.filter(user => {
                return user.userName.toUpperCase().includes(searchContent.toUpperCase())
            })
            getSearchResult(userArr);
        }
    }, [searchContent]) 

    const handleChange = e => {
        getSearchContent(e.target.value);
    }
    return (
        <div className='searchUser__container'>
            <div className="searchUser">
                <input type="text" placeholder='Search' className='search__input' onChange={handleChange} value={searchContent}/>
                <div className="search__result">
                    {
                        searchResult && searchResult.map((user, index) => (
                            <div className="searchUser__resultContainer" key={index}>
                                <div >
                                    <Avatar className='userProfileImage' alt='Sarthak' src={user.profileImg}/>
                                </div>
                                <p onClick={() => {
                                    loadProfileBySearch();
                                    loadProfile(user);
                                }}><Link to={`users/${user.userName}`}>{user.userName}</Link></p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    loadProfile: (profile) => dispatch(loadProfileBySearch(profile)),
    loadProfileBySearch: () => dispatch(profileLoadedBySearch())
})

export default connect(null, mapDispatchToProps)(SearchUser);
