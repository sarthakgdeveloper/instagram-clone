import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import {createStructuredSelector} from 'reselect';
import {getCurrentUser} from '../../redux/mainUser/mainUserSelector';
import './showFollow.scss';

function ShowFollow({currentUser, match}) {
    let follow

    if (match.params.follow === 'followers') {
        follow = currentUser.follower
    }else if(match.params.follow === 'followings') {
        follow = currentUser.following
    } else{
        return (
            <div>
                <h1>Sorry Wrong Page!!</h1>
            </div>
        )
    }



    return (
        <div className='showFollow__container'>
            {
                follow && follow.map(eFollow => (
                    <div className="eachFollow__container">
                        <div className="showFollow">
                            <Link to={`/users/${eFollow}`}>{eFollow}</Link>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}


const mapStateToProps = createStructuredSelector({
    currentUser: getCurrentUser
})


export default connect(mapStateToProps)(ShowFollow);
