import React, {useEffect} from 'react';

import './App.css';
import UserPost from "./components/userPost/userPost";
import UserSignIn from "./components/signIn/signIn";
import UserSignUp from "./components/signup/signup";
import {Switch, Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import Header from './components/header/header';
import { getCurrentUser } from './redux/mainUser/mainUserSelector';
import { checkCurrentUser } from './redux/mainUser/mainUserAction';
import User from './components/users/users';
import {getPost} from './redux/posts/posts.action';





function App({currentUser, checkingCurrentUser, loadUserPost}) {
  useEffect(() => {
    checkingCurrentUser();
    loadUserPost();
  }, [checkingCurrentUser, loadUserPost]);  


  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path='/' component={UserPost}/>
        <Route path='/signin' render={() => {
          return currentUser ? <Redirect to='/'/>:<UserSignIn/>
        }} />
        <Route path='/signup' render={() => {
          return currentUser ? <Redirect to='/'/>:<UserSignUp/>
        }} />
        <Route path='/users' component={User}/>
      </Switch>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  checkingCurrentUser: () => dispatch(checkCurrentUser()),
  loadUserPost: () => dispatch(getPost())
})

const mapStateToProps = createStructuredSelector({
  currentUser: getCurrentUser,
})

export default connect(mapStateToProps,mapDispatchToProps)(App);
