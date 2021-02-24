
import React from 'react';
import './Notification.scss';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {loadCurrentUserNotification} from '../../redux/mainUser/mainUserSelector'

function Notification({notification}) {
    const {newNotification, oldNotification} = notification;
    console.log(newNotification)
    return (
        <div className='notification__container'>
            <div className="notification new__notification">
                {
                    newNotification && newNotification.map((obj, index) => (
                        <div className='eachNotification' key={index}>
                            <span className='eachNotification__content'>{`${obj.userName} ${obj.notification}`}<img src={obj.post.imageUrl} className='eachNotification__image'/></span>
                        </div>
                    ))
                }
            </div>
            <div className="notification old__notification"></div>
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    notification: loadCurrentUserNotification,
})


export default connect(mapStateToProps)(Notification);
