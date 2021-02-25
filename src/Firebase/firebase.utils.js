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
        const userPostData = {...snapShotfromPostId.data()};
        const post = userPostData.posts || []
        let postObj = {};
        for (let i = 0; i < post.length; i++) {
            const userIdRef = firestore.doc(`userPosts/${post[i]}`);
            const userIdSnapshot = await userIdRef.get();
            const userPost = {...userIdSnapshot.data()};
            const userPostId = i+1;
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
    const idOfPosts = userPostData.posts || [];

    let postObj = {};
    for (let i = 0; i < idOfPosts.length; i++) {
        const userIdRef = firestore.doc(`userPosts/${idOfPosts[i]}`);
        const userIdSnapshot = await userIdRef.get();
        const userPost = {...userIdSnapshot.data()};
        const userPostId = i+1;
        postObj[userPostId] = userPost;
    }
    return postObj
}

export const startFetchingPosts = async () => {
    let obj = {}
    const postRef = firestore.collection(`userPosts`).orderBy('createdAt', 'desc');
    const postSnapshot = await postRef.get();
    postSnapshot.docs.map((post, indexOfPost) => {
        const postObj = {
            ...post.data()
        }
        return obj = {
            ...obj,
            [`${postObj.userName}_${indexOfPost+1}`]:{
                ...postObj
            }
        }
    })
    return obj
}

export const incrementingLike = async (post, currentUser) => {
    const postRef = firestore.doc(`userPosts/${post.uid}`);
    const userNotificationRef = firestore.doc(`notifications/${post.userName}`);
    const snapshot = await userNotificationRef.get();
    let notifications = {...snapshot.data()}; 
    const newNotification = {userName: currentUser,notification: `liked your Photo`,post, type: 'like'}
    if (post.likes.includes(currentUser)) {
        const indexOfUser = post.likes.indexOf(currentUser);
        const {likes} = post;
        likes.splice(indexOfUser, 1)
        post = {
            ...post,
            likes
        };
        if (post.userName !== currentUser) {
            if (notifications.seen) {
                const notificationIndex = notifications.oldNotification.indexOf(newNotification);
                notifications.oldNotification.splice(notificationIndex, 1)
            } else {
                const notificationIndex = notifications.newNotification.indexOf(newNotification);
                notifications.newNotification.splice(notificationIndex, 1);
            }
        }
        
    } else{
        if(!(post.userName === currentUser)){
            if (Object.keys(notifications).length > 0) {
                notifications = {
                    ...notifications,
                    newNotification: [
                        {...newNotification},
                        ...notifications.newNotification, 
                    ],
                    seen: false
                }
            } else {
                notifications = {
                    ...notifications,
                    newNotification: [
                        {...newNotification},
                    ],
                    seen: false
                }
            }
        }
        post = {
            ...post,
            likes: [...post.likes, currentUser]
        }
    }
    if (snapshot.exists) {
        await userNotificationRef.update(notifications); 
    } else {
        await userNotificationRef.set(notifications); 
    }
    await postRef.update(post)
    return post;
}

export const gettingComment = async (post, comment, currentUser) => {
    const postRef = firestore.doc(`userPosts/${post.uid}`);
    if(!(post.userName === currentUser)) {
        const userNotificationRef = firestore.doc(`notifications/${post.userName}`);
        const snapshot = await userNotificationRef.get();
        const newNotification = {userName: currentUser,notification: `commented on your photo`,post, type: "comment",comment}
        let notifications = {...snapshot.data()}; 
        if (Object.keys(notifications).length > 0) {
                notifications = {
                    ...notifications,
                    newNotification: [
                        {...newNotification},
                        ...notifications.newNotification, 
                    ],
                    seen: false
                }
            } else {
                notifications = {
                    ...notifications,
                    newNotification: [
                        {...newNotification},
                    ],
                    seen: false
                }
            }
        if (snapshot.exists) {
            await userNotificationRef.update(notifications); 
        } else {
            await userNotificationRef.set(notifications); 
        }
    }
    post = {
        ...post,
        comments: [...post.comments, {userName: currentUser, comment}]
    }
    postRef.update(post)
    return post;
}

export const onRemovingComment = async (post, comment) => {
    const postRef = firestore.doc(`userPosts/${post.uid}`);
    if(!(post.userName === comment.userName)) {
        const userNotificationRef = firestore.doc(`notifications/${post.userName}`);
        const snapshot = await userNotificationRef.get();
        const newNotification = {userName: comment.userName,notification: `commented on your photo`,post, type: "comment",comment}
        let notifications = {...snapshot.data()}; 
        if (notifications.seen) {
            const notificationIndex = notifications.oldNotification.indexOf(newNotification);
            notifications.oldNotification.splice(notificationIndex, 1)
        } else {
            const notificationIndex = notifications.newNotification.indexOf(newNotification);
            notifications.newNotification.splice(notificationIndex, 1);
        }
        if (snapshot.exists) {
            await userNotificationRef.update(notifications); 
        } else {
            await userNotificationRef.set(notifications); 
        }
    }
    const {comments} = post;
    const indexOfComment = comments.indexOf(comment);
    comments.splice(indexOfComment, 1);
    post = {
        ...post,
        comments
    }
    postRef.update(post);
    return post;
}

export const deletingPost = async (post, currentUser) => {
    const {uid, imageName} = post;
    const postRef = firestore.doc(`post/${currentUser}`);
    const userEachPostRef = firestore.doc(`userPosts/${uid}`);
    const imageRef = fireStorage.ref(`images/${imageName}`);
    const snapShotFromPost = await postRef.get();
    const userPostData = {...snapShotFromPost.data()};
    const postData = userPostData.posts;
    if (!postData.includes(uid)) return null;
    const indexOfPost = postData.indexOf(uid);
    postData.splice(indexOfPost, 1);
    const newUserPostData = {
        posts: postData,
        timestamp: userPostData.timestamp
    }
    await postRef.update(newUserPostData);
    await userEachPostRef.delete();
    await imageRef.delete();
    return null;
}

export const updateNotification = async (notification, currentUser) => {
    const notificationRef = firestore.doc(`notifications/${currentUser}`);
    const snapshot = await notificationRef.get();
    const data = {...snapshot.data()};
    const newData = {
        newNotification: [],
        oldNotification: [...notification, ...data.oldNotification],
        seen: true
    }
    await notificationRef.update(newData);
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