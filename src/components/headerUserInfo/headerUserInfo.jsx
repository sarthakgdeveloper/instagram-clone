import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {getCurrentUser, isThereNewNotification} from '../../redux/mainUser/mainUserSelector'
import './headerUserInfo.scss';

const HeaderUserInfo = ({currentUser, checkNewNotification}) => {

    const {userName} = currentUser ? currentUser : {userName: "unKnown"};

    useEffect(() => {
        doNotify(checkNewNotification?true:false)
    }, [checkNewNotification])
    
    const [notify, doNotify] = useState(checkNewNotification?true:false);

    return currentUser ? ( 
    <div>
        <div className="header__userInfo">
            <div>
                <Link to='/' className='header__userProfile'><i className="fas fa-house-user"></i></Link> 
                <Link to='/'><i className="far fa-comments"></i></Link>
                <Link to='/notification' className={`${notify?'notification':''}`} onClick={() => doNotify(false)}><i className="far fa-heart"></i></Link>
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
    checkNewNotification: isThereNewNotification
})


export default connect(mapStateToProps)(HeaderUserInfo);