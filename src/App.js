import React, {useEffect} from 'react';

import './App.css';
import UserPost from "./components/userPost/userPost";
import UserSignIn from "./components/signIn/signIn";
import UserSignUp from "./components/signup/signup";
import {Switch, Route, Redirect} from 'react-router-dom';
import {firestore} from './Firebase/firebase.utils';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import Header from './components/header/header';
import { getCurrentUser } from './redux/mainUser/mainUserSelector';
import { checkCurrentUser } from './redux/mainUser/mainUserAction';
import User from './components/users/users';
import {getPost} from './redux/posts/posts.action';
import {loadUserNotification, newNotificationUnSeen} from './redux/mainUser/mainUserAction';
import Notification from './components/Notification/Notification'





function App({currentUser, checkingCurrentUser, loadUserPost, getUserNotification, newNotification}) {
  useEffect(() => {
    checkingCurrentUser();
    loadUserPost();
    firestore.doc(`notifications/${currentUser?.userName}`).onSnapshot(snapshot => {
      const notificationData = {...snapshot.data()};
      notificationData && console.log(!!notificationData)
      Object.keys(notificationData).length > 0 && notificationData.newNotification?.length > 0 && newNotification();
      getUserNotification({...snapshot.data()})
    })
  }, [checkingCurrentUser, loadUserPost, getUserNotification]);  


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
      </Switch>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  checkingCurrentUser: () => dispatch(checkCurrentUser()),
  loadUserPost: () => dispatch(getPost()),
  getUserNotification: (Notification) => dispatch(loadUserNotification(Notification)),
  newNotification: () => dispatch(newNotificationUnSeen())
})

const mapStateToProps = createStructuredSelector({
  currentUser: getCurrentUser,
})

export default connect(mapStateToProps,mapDispatchToProps)(App);
