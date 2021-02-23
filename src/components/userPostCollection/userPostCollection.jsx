import React from 'react'
import UserContent from '../userContent/usersContent'
import './collection.scss'

const UserPostCollection = ({userPost, user}) => {
    return (
        <div className='userContent__AllPostContainer'>
            {
                userPost.map(post => <UserContent userPost={post} user={user} key={post.uid}/>)
            }
        </div>
    )
}

export default UserPostCollection