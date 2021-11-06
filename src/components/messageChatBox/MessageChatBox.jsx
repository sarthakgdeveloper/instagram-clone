import React, { useState } from "react";
import { connect } from "react-redux";
import firebase from "firebase";
import { firestore } from "../../Firebase/firebase.utils";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { getUserData } from "../../redux/user/userSelector";
import { getCurrentUser } from "../../redux/mainUser/mainUserSelector";
import Styles from "./MessageChatBox.module.scss";

function MessageChatBox({ userData, currentUser }) {
  const [messageInput, getMessageInput] = useState("");
  const [messages, getMessages] = useState([]);

  const handleMessageInput = (e) => {
    if (!e) return;

    getMessageInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (messageInput.length <= 0) return;
    const userEachMessage = firestore.collection(`messages`).doc();
    const { userName: cUserName } = currentUser;
    const { userName: oUserName } = userData;
    const userMessageRef = firestore.doc(`userMessages/${cUserName}`);
    const otherUserMessageRef = firestore.doc(`userMessages/${oUserName}`);
    const userSnapshot = await userMessageRef.get();
    const otherUserSnapshot = await otherUserMessageRef.get();
    const newMessage = {
      message: messageInput,
      from: currentUser?.userName,
      to: userData?.userName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    await userEachMessage.set({
      ...newMessage,
    });
    if (!userSnapshot.exists) {
      await userMessageRef.set({
        messages: {
          [oUserName]: {
            message: [userEachMessage.id],
            seen: true,
          },
        },
      });
    } else {
      if (!userSnapshot.data().messages[oUserName]) {
        await userMessageRef.update({
          messages: {
            ...userSnapshot.data().messages,
            [oUserName]: {
              message: [userEachMessage.id],
              seen: true,
            },
          },
        });
      } else {
        await userMessageRef.update({
          messages: {
            ...userSnapshot.data().messages,
            [oUserName]: {
              message: [
                ...userSnapshot.data().messages[oUserName].message,
                userEachMessage.id,
              ],
              seen: true,
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
            },
          },
        });
      }
    }
    getMessages([...messages, newMessage]);
    getMessageInput("");
  };

  return (
    <div className={Styles.messageChatBoxSection}>
      <div className={Styles.messageChatBox}>
        <div className={Styles.usersContainer}></div>
        <div className={Styles.messageBox}>
          <div className={Styles.userName}>
            <div className={Styles.imageContainer}>
              <img src={userData?.profileImg} alt="profileImg" />
            </div>
            <Link to={`/users/${userData?.userName}`}>
              {userData?.userName}
            </Link>
          </div>
          <div className={Styles.message}>
            <div className={Styles.messagesContainer}>
              {messages.map((message, index) => (
                <div
                  className={
                    message?.from === currentUser?.userName
                      ? Styles.UserMessage
                      : Styles.otherUserMessage
                  }
                  key={index}
                >
                  <span>{message?.message}</span>
                </div>
              ))}
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
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  userData: getUserData,
  currentUser: getCurrentUser,
});

export default connect(mapStateToProps)(MessageChatBox);
