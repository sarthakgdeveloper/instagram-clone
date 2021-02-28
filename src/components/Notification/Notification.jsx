
import React, {useEffect} from 'react';
import './Notification.scss';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {loadCurrentUserNotification, getCurrentUser} from '../../redux/mainUser/mainUserSelector';
import {updateNotification} from '../../redux/mainUser/mainUserAction';

function Notification({notification, updatingNotification, currentUser}) {
    const {newNotification, oldNotification} = notification;
    useEffect(() => {
        return () => {
            newNotification?.length > 0 && updatingNotification(newNotification, currentUser.userName)
        }
    })
    return (
        <div className='notification__container'>
            <div className="notification new__notification">
                <h4>New Notifications</h4>
                {
                    newNotification ? newNotification.map((obj, index) => (
                        <div className='eachNotification' key={index}>
                            <span className='eachNotification__content'><p>{`${obj.userName} ${obj.notification}`}</p><img src={obj.post.imageUrl} className='eachNotification__image'/></span>
                        </div>
                    )):(
                        <div className="eachNotification">
                            <span className="eachNotification__content">No New Notification</span>
                        </div>
                    )
                }
            </div>
            <div className="notification old__notification">
                <h4>Old Notifications</h4>
                {
                    oldNotification?.map((obj, index) => (
                        <div className='eachNotification' key={index}>
                            <span className='eachNotification__content'>{`${obj?.userName} ${obj?.notification}`}<img src={obj?.post.imageUrl} className='eachNotification__image'/></span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    notification: loadCurrentUserNotification,
    currentUser: getCurrentUser
})

const mapDispatchToProps = dispatch => ({
    updatingNotification: (notification, user) => dispatch(updateNotification(notification, user))
})


export default connect(mapStateToProps, mapDispatchToProps)(Notification);
