import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import firebase from "firebase";
import { firestore } from "../../Firebase/firebase.utils";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { getCurrentUser } from "../../redux/mainUser/mainUserSelector";
import { useHistory } from "react-router";
import Styles from "./MessageChatBox.module.scss";

function MessageChatBox({ currentUser, match }) {
  const [messageInput, getMessageInput] = useState("");
  const [userList, getUserList] = useState([]);
  const [messages, getMessages] = useState([]);
  const [noUser, setNoUser] = useState(
    currentUser?.userName === match.params.userId
  );

  let messagesId = [];
  const history = useHistory();

  const getMessagedUsersList = async () => {
    const userMessageRef = firestore.doc(
      `userMessages/${currentUser?.userName}`
    );
    const userSnapshot = await userMessageRef.get();
    const messageData = { ...userSnapshot.data() };
    messageData.messages &&
      getUserList([
        ...Object.keys(messageData?.messages).map((user) => ({
          user,
          seen: messageData.messages[user].seen,
        })),
      ]);
  };

  const verifyOtherUser = async () => {
    const otherUserRef = firestore.doc(`userMessages/${match.params.userId}`);
    const otherUserSnapshot = await otherUserRef.get();
    return !otherUserSnapshot.exists
      ? setNoUser(true)
      : setNoUser(currentUser?.userName === match.params.userId);
  };

  useEffect(() => {
    getMessages([]);
    getMessagedUsersList();
    verifyOtherUser();
    messagesId = [];
    const unsubscribe = firestore
      .doc(`userMessages/${currentUser?.userName}`)
      .onSnapshot(async (snapshot) => {
        const messageData = { ...snapshot.data() };
        if (!messageData.messages[match.params.userId].seen) {
          firestore.doc(`userMessages/${currentUser?.userName}`).update({
            messages: {
              ...messageData.messages,
              [match.params.userId]: {
                message: [...messageData.messages[match.params.userId].message],
                seen: true,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              },
            },
          });
        }
        const newMessagesId = messageData?.messages
          ? messageData?.messages[match?.params?.userId]?.message
          : [];
        getUserList([
          ...Object.keys(messageData?.messages).map((user) => ({
            user,
            seen: messageData.messages[user].seen,
          })),
        ]);
        if (newMessagesId?.length > 0) {
          newMessagesId.forEach(async (messageID) => {
            if (!messagesId.includes(messageID)) {
              const userMessageRef = firestore.doc(`messages/${messageID}`);
              const messageSnapshot = await userMessageRef.get();
              const messageData = messageSnapshot.data();
              getMessages((prevValue) => {
                return [
                  ...prevValue,
                  {
                    ...messageData,
                  },
                ];
              });
            }
          });
          messagesId = newMessagesId;
        }
      });

    return () => unsubscribe();
  }, [match?.params?.userId]);

  const handleMessageInput = (e) => {
    if (!e) return;

    getMessageInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (messageInput.length <= 0) return;
    const userEachMessage = firestore.collection(`messages`).doc();
    const { userName: cUserName } = currentUser;
    const userMessageRef = firestore.doc(`userMessages/${cUserName}`);
    const otherUserMessageRef = firestore.doc(
      `userMessages/${match.params.userId}`
    );
    const userSnapshot = await userMessageRef.get();
    const otherUserSnapshot = await otherUserMessageRef.get();
    const newMessage = {
      message: messageInput,
      from: currentUser?.userName,
      to: match.params.userId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    await userEachMessage.set({
      ...newMessage,
    });
    if (!userSnapshot.exists) {
      await userMessageRef.set({
        messages: {
          [match.params.userId]: {
            message: [userEachMessage.id],
            seen: true,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          },
        },
      });
    } else {
      if (!userSnapshot.data().messages[match.params.userId]) {
        await userMessageRef.update({
          messages: {
            ...userSnapshot.data().messages,
            [match.params.userId]: {
              message: [userEachMessage.id],
              seen: true,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            },
          },
        });
      } else {
        await userMessageRef.update({
          messages: {
            ...userSnapshot.data().messages,
            [match.params.userId]: {
              message: [
                ...userSnapshot.data().messages[match.params.userId].message,
                userEachMessage.id,
              ],
              seen: true,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            },
          },
        });
      }
    }
    if (!otherUserSnapshot.exists) {
      await otherUserMessageRef.set({
        messages: {
          [cUserName]: {
            message: [userEachMessage.id],
            seen: false,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          },
        },
      });
    } else {
      if (!otherUserSnapshot.data().messages[cUserName]) {
        await otherUserMessageRef.update({
          messages: {
            ...otherUserSnapshot.data().messages,
            [cUserName]: {
              message: [userEachMessage.id],
              seen: false,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            },
          },
        });
      } else {
        await otherUserMessageRef.update({
          messages: {
            ...otherUserSnapshot.data().messages,
            [cUserName]: {
              message: [
                ...otherUserSnapshot.data().messages[cUserName].message,
                userEachMessage.id,
              ],
              seen: false,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            },
          },
        });
      }
    }
    getMessageInput("");
    await getMessagedUsersList();
  };

  return (
    <div className={Styles.messageChatBoxSection}>
      <div className={Styles.messageChatBox}>
        <div className={Styles.usersContainer}>
          {userList?.map((user, index) => {
            return (
              <div
                className={Styles.eachUserName}
                key={index}
                onClick={() => history.push(`/message/${user?.user}`)}
                style={
                  user.seen || match.params.userId === user?.user
                    ? {}
                    : {
                        fontWeight: "bold",
                      }
                }
              >
                <span>{user.user}</span>
                <span
                  className={Styles.newMessage}
                  style={
                    user.seen || match.params.userId === user?.user
                      ? { display: "none" }
                      : {}
                  }
                >
                  New Messages
                </span>
              </div>
            );
          })}
        </div>
        <div className={Styles.messageBox}>
          {noUser ? (
            <div className={Styles.noUserContainer}>Your Messages</div>
          ) : (
            <>
              <div className={Styles.userName}>
                <Link to={`/users/${match.params.userId}`}>
                  {match.params.userId}
                </Link>
              </div>
              <div className={Styles.message}>
                <div className={Styles.messagesContainer}>
                  {messages.map((message, index) => {
                    return (
                      <div
                        className={
                          message?.from === currentUser?.userName
                            ? Styles.UserMessage
                            : Styles.otherUserMessageRef
                        }
                        key={index}
                      >
                        <span>{message?.message}</span>
                      </div>
                    );
                  })}
                </div>
                <div className={Styles.messageInputContainer}>
                  <input
                    className={Styles.messageInput}
                    placeholder="Message..."
                    value={messageInput}
                    onChange={handleMessageInput}
                  />
                  {messageInput.length > 0 && (
                    <button onClick={handleSendMessage}>Send</button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: getCurrentUser,
});

export default connect(mapStateToProps)(MessageChatBox);
