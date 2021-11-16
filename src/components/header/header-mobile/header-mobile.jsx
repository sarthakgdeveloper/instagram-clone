import React from "react";
import HeaderUserInfo from "../../headerUserInfo/headerUserInfo";
import SocialGramLogo from "../../../img/socialGramLogo.png";
import "./header-mobile.scss";

const HeaderMobile = () => {
  return (
    <div className="header__container">
      <div className="header">
        <div>
          <div className="header__logoContainer">
            <img src={SocialGramLogo} alt="" className="header__logo" />
          </div>
        </div>
      </div>
      <div className="lower">
        <HeaderUserInfo />
      </div>
    </div>
  );
};

export default HeaderMobile;
