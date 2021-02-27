import React, {useEffect} from 'react';

import './App.css';
import UserPost from "./components/userPost/userPost";
import UserSignIn from "./components/signIn/signIn";
import UserSignUp from "./components/signup/signup";
import {Switch, Route, Redirect} from 'react-router-dom';
import {firestore, auth} from './Firebase/firebase.utils';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import Header from './components/header/header';
import { getCurrentUser, getIsSignedIn } from './redux/mainUser/mainUserSelector';
import { checkCurrentUser, signOut } from './redux/mainUser/mainUserAction';
import User from './components/users/users';
import {loadUserNotification, newNotificationUnSeen} from './redux/mainUser/mainUserAction';
import Notification from './components/Notification/Notification';
import SearchUser from './components/seachUser/SearchUser';





function App({currentUser, checkingCurrentUser, getUserNotification, newNotification, signingOut, isSignedIn}) {
  useEffect(() => {
    checkingCurrentUser();
    currentUser && firestore.doc(`notifications/${currentUser.userName}`).onSnapshot(snapshot => {
      const notificationData = {...snapshot.data()};
      Object.keys(notificationData).length > 0 && notificationData.newNotification?.length > 0 && newNotification();
      getUserNotification({...snapshot.data()})
    })
  }, [getUserNotification, isSignedIn]);  


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
        <Route path='/notification' component={Notification}/>
        <Route path='/search' component={SearchUser}/>
        <Route path='/logout' render = {() => {
          auth.signOut();
          signingOut();
        }}/>
      </Switch>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  checkingCurrentUser: () => dispatch(checkCurrentUser()),
  getUserNotification: (Notification) => dispatch(loadUserNotification(Notification)),
  newNotification: () => dispatch(newNotificationUnSeen()),
  signingOut: () => dispatch(signOut())
})

const mapStateToProps = createStructuredSelector({
  currentUser: getCurrentUser,
  isSignedIn: getIsSignedIn
})

export default connect(mapStateToProps,mapDispatchToProps)(App);
