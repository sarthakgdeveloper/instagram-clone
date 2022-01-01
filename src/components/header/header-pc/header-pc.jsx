import React from "react";
import "./header-pc.scss";
import SocialGramLogo from "../../../img/socialGramLogo.png";
import HeaderUserInfo from "../../headerUserInfo/headerUserInfo";

const HeaderPc = () => {
  return (
    <div className="header__container">
      <div className="header">
        <div>
          <div className="header__logoContainer">
            <img src={SocialGramLogo} alt="" className="header__logo" />
          </div>
        </div>
        <div className="searchBox__Container">
        </div>
        <HeaderUserInfo />
      </div>
    </div>
  );
};

export default HeaderPc;
