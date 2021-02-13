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
import {userPostLoaded} from './redux/user/userAction'
import {firestore} from './Firebase/firebase.utils'





function App({currentUser, checkingCurrentUser, loadUserPost}) {
  useEffect(() => {
    checkingCurrentUser();
    let obj = []
    const postRef = firestore.collection(`post`).orderBy('timestamp', 'desc');
    const postSnapshot = postRef.get();
    postSnapshot.then(posts => {
      const postDocs = posts.docs;
      let check = checking();
      for(let j = 0; j < postDocs.length; j++) {
        check(postDocs)
      }
    })
  }, [checkingCurrentUser, loadUserPost]);  


  function checking(){
    let i = 0;
    let newArr = [];
    return (postsArr) => {
      postsArr.map(post => {
        let postObj = post.data().posts;
        let postArr = Object.values(postObj).reverse();
      })
      return i++
    }
  }

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
  loadUserPost: (post) => dispatch(userPostLoaded(post))
})

const mapStateToProps = createStructuredSelector({
  currentUser: getCurrentUser,
})

export default connect(mapStateToProps,mapDispatchToProps)(App);
