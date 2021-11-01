import React, { useState } from "react";
import { connect } from "react-redux";
import { userInfoStart } from "../../redux/mainUser/mainUserAction";
import { firestore } from "../../Firebase/firebase.utils";

import "./afterSignUpPage.scss";

const AfterSignUpPage = ({ signUpEmail, signUpPassword, enterUserInfo }) => {
  // if (!signUpEmail && !signUpPassword) return null;

  const [userInfo, setUserInfo] = useState({
    email: signUpEmail,
    password: signUpPassword,
    displayName: "",
    userName: "",
    Bio: "",
  });

  const { email, password, displayName, userName, Bio } = userInfo;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userIdRef = firestore.doc(`usersId/${userName}`);
    const snapShotForId = await userIdRef.get();
    if (snapShotForId.exists) {
      return alert("username not available!");
    }
    return enterUserInfo({ email, password, displayName, userName, Bio });
  };

  return (
    <div className="afterSignUpPage__Container">
      <div className="afterSignUpPage">
        <button
          className="afterSignUpPage_backButton"
          onClick={() => {
            window.location.replace("/signup");
          }}
        >
          Back
        </button>
        <div className="signIn__heading">
          <h2>USER INFO</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Display Name"
            name="displayName"
            value={displayName}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="User Name"
            name="userName"
            value={userName}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Bio"
            name="Bio"
            value={Bio}
            onChange={handleChange}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  enterUserInfo: (info) => dispatch(userInfoStart(info)),
});

export default connect(null, mapDispatchToProps)(AfterSignUpPage);
