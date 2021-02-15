import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import '@firebase/storage';

const config = {
    apiKey: "AIzaSyAiUHNPU-xZX3WdZ2GPwRwTbS3tS8ql0Uo",
    authDomain: "instagram-clone-21c3c.firebaseapp.com",
    projectId: "instagram-clone-21c3c",
    storageBucket: "instagram-clone-21c3c.appspot.com",
    messagingSenderId: "109747016304",
    appId: "1:109747016304:web:17d16efcb498a69c13dab5",
    measurementId: "G-1CFMXQXECB"
};

export const createUserProfileDocument = async (userAuth, AdditionalData) => {
    if(!userAuth) return;
    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const userIdRef = firestore.doc(`usersId/${userAuth.userName}`);
    const snapShot = await userRef.get();
    if (!snapShot.exists){
        const {email, displayName, Bio, userName, uid} = userAuth;
        const createdAt = new Date();
        try {
            userRef.set({
                userName,
                email,
                displayName,
                Bio,
                createdAt,
                id: uid,
                ...AdditionalData
            });
            userIdRef.set({
                [userName]: uid
            })
        } catch (error) {
            console.log('error while creating an account')
        }
    }
    return userRef;
}


export const getUserDataFromUserName = async (username) => {
    if(!username) return;
    const userRef = firestore.doc(`usersId/${username}`);
    const userPostRef = firestore.doc(`post/${username}`);
    const snapShotfromUsername = await userRef.get();
    if (!snapShotfromUsername.exists){
        alert('username not found');
        return {userDataRef: null, userPostRef};
    } else {
        const userId = snapShotfromUsername.data();
        const userDataRef = firestore.doc(`users/${userId[username]}`);
        const snapShotfromUserId = await userDataRef.get();
        const snapShotfromPostId = await userPostRef.get();
        const post = Object.values({...snapShotfromPostId.data().posts});
        let postObj = {};
        for (let i = 0; i < post.length; i++) {
            const userIdRef = firestore.doc(`userPosts/${post[i]}`);
            const userIdSnapshot = await userIdRef.get();
            const userPost = {...userIdSnapshot.data()};
            const userPostId = userPost.id;
            postObj[userPostId] = userPost;
        }
        if(!snapShotfromUserId.exists) {
            return alert('user not found')
        }
        return {userDataRef, postObj};
    }
}

const unfollowingOldUser = (userName, arrayOfuserName) => {
    const indexOfUserName = arrayOfuserName.indexOf(userName);
    if (indexOfUserName > -1) {
        arrayOfuserName.splice(indexOfUserName, 1);
    }
    return arrayOfuserName
}

export const followNewUser = async (newUserName, currentUser) => {
    const currentUserRef = firestore.doc(`users/${currentUser.id}`);
    await currentUserRef.update({
        ...currentUser,
        following: [...currentUser.following, newUserName]
    })
    
    return currentUserRef
}

export const unfollowOldUser = async (newUserName, currentUser) => {
    const currentUserRef = firestore.doc(`users/${currentUser.id}`);
    await currentUserRef.update({
        ...currentUser,
        following: unfollowingOldUser(newUserName, currentUser.following)
    })
    
    return currentUserRef
}

export const incrementFollowerOfUser = async (userData, currentUserName) => {
    const newUserRef = firestore.doc(`users/${userData.id}`);
    await newUserRef.update({
        ...userData,
        follower: [...userData.follower, currentUserName]
    })
    
    return newUserRef
}


export const decrementFollowerOfUser = async (userData, currentUserName) => {
    
    const newUserRef = firestore.doc(`users/${userData.id}`);
    await newUserRef.update({
        ...userData,
        follower: unfollowingOldUser(currentUserName, userData.follower) 
    })
    return newUserRef
}

export const getCurrentUserPost = async (username) => {
    const userPostRef = firestore.doc(`post/${username}`);
    const userPostSnapshot = await userPostRef.get();
    const userPostData = {...userPostSnapshot.data()};
    const idOfPosts = Object.values(userPostData.posts);
    let postObj = {};
    for (let i = 0; i < idOfPosts.length; i++) {
        const userIdRef = firestore.doc(`userPosts/${idOfPosts[i]}`);
        const userIdSnapshot = await userIdRef.get();
        const userPost = {...userIdSnapshot.data()};
        const userPostId = userPost.id;
        postObj[userPostId] = userPost;
    }
    return postObj
}
firebase.initializeApp(config);


export const getCurrentUser = () => {
    return new Promise((resolve,reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject) 
    })
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const fireStorage = firebase.storage();