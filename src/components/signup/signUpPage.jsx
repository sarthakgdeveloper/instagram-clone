import React from 'react';
import {connect} from 'react-redux';
import {signUpStart} from '../../redux/mainUser/mainUserAction';
import {Link} from 'react-router-dom';

const SignUpPage = ({signUp, signInInfo, setSignInInfo}) => {
    const {email, cEmail, password, cPassword} = signInInfo;

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSignInInfo({
            ...signInInfo,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        signUp({email, password, cEmail, cPassword})
    }
    return (
        <div className='signIn__Container'>
            <div className="signIn">
                <div className="signIn__heading">
                    <h2>SIGN UP</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='Email' name='email' value={email} onChange={handleChange} required/>
                    <input type="email" placeholder='Confirm Email' name='cEmail'  value={cEmail} onChange={handleChange} required/>
                    <input type="password" placeholder='Password' name='password' value={password} onChange={handleChange} required/>
                    <input type="password" placeholder='Confirm Password' name='cPassword' value={cPassword} onChange={handleChange} required/>
                    <button type='submit'>Next</button>
                </form>
                <p>Already have an account? <Link to='/signin'>SIGN IN</Link></p>
            </div>
        </div>
    )
};

const mapDispatchToProps = dispatch => ({
    signUp: (info) => dispatch(signUpStart(info)),
})

export default connect(null, mapDispatchToProps)(SignUpPage);