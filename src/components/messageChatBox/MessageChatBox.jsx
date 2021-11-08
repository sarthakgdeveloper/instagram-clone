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
  const userData = {
    userName: match.params.userId,
  };
  let messagesId = [];
  const history = useHistory();

  const getMessagesList = async () => {
    const userMessageRef = firestore.doc(
      `userMessages/${currentUser?.userName}`
    );
    const userSnapshot = await userMessageRef.get();
    const messageData = { ...userSnapshot.data() };
    messageData.messages &&
      getUserList([...Object.keys(messageData?.messages)]);
  };

  useEffect(() => {
    getMessages([]);
    getMessagesList();
    firestore
      .doc(`userMessages/${currentUser?.userName}`)
      .onSnapshot(async (snapshot) => {
        const messageData = { ...snapshot.data() };
        const newMessagesId = messageData?.messages
          ? messageData?.messages[match?.params?.userId]?.message
          : [];
        if (newMessagesId?.length > 0) {
          for (let i = 0; i < newMessagesId.length; i++) {
            if (!messagesId.includes(newMessagesId[i])) {
              const userMessageRef = firestore.doc(
                `messages/${newMessagesId[i]}`
              );
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
          }
          messagesId = newMessagesId;
        }
      });
  }, [match?.params?.userId]);

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
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
    await getMessagesList();
  };

  return (
    <div className={Styles.messageChatBoxSection}>
      <div className={Styles.messageChatBox}>
        <div className={Styles.usersContainer}>
          {userList?.map((user, index) => (
            <div
              className={Styles.eachUserName}
              key={index}
              onClick={() => history.push(`/message/${user}`)}
            >
              <span>{user}</span>
            </div>
          ))}
        </div>
        <div className={Styles.messageBox}>
          <div className={Styles.userName}>
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
  currentUser: getCurrentUser,
});

export default connect(mapStateToProps)(MessageChatBox);
