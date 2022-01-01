import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {signInStart} from '../../redux/mainUser/mainUserAction';
import './signIn.scss';
const UserSignIn = ({signIn}) => {
    const [signInInfo, setSignInInfo] = useState({
        email: '',
        password: '',
    })
    const {email, password} = signInInfo;
    const handleChange = (e) => {
        const {name, value} = e.target;
        setSignInInfo({
            ...signInInfo,
            [name]: value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        signIn({email, password});
    }
    return (
        <div className='signIn__Container'>
            <div className="signIn">
                <div className="signIn__heading">
                    <h2>SIGN IN</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='Email' name='email' value={email} onChange={handleChange} required/>
                    <input type="password" placeholder='Password' name='password' value={password} onChange={handleChange} required/>
                    <button type='submit'>Sign In</button>
                </form>
                <p>dont't have an account? <Link to='/signup'>SIGN UP</Link></p>
            </div>
        </div>
    )
};
const mapDispatchToProps = dispatch => ({
    signIn: (info) => dispatch(signInStart(info))
})
export default connect(null, mapDispatchToProps)(UserSignIn);