import React from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getCurrentUser} from '../../redux/mainUser/mainUserSelector'
import './headerUserInfo.scss';

const HeaderUserInfo = ({currentUser}) => {

    const {userName} = currentUser ? currentUser : {userName: "unKnown"};

    return currentUser ? ( 
    <div>
        <div className="header__userInfo">
            <div>
                <Link to='/' className='header__userProfile'><i className="fas fa-house-user"></i></Link>
                <Link to='/'><i className="far fa-comments"></i></Link>
                <Link to='/'><i className="far fa-heart"></i></Link>
                <Link to={`/users/${userName}`} className='header__userProfile'><i className="far fa-user"></i></Link>
            </div>
        </div>
    </div>
    ) : (
        <div>
            <div className='user__signIn'>
                <button >
                    <Link to='/signin'>Sign In</Link>
                </button>   
            </div>
        </div>
    )
}

const mapStateToProps = createStructuredSelector({
    currentUser: getCurrentUser,
})


export default connect(mapStateToProps)(HeaderUserInfo);