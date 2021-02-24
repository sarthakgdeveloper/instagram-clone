import React from 'react';
import HeaderUserInfo from '../../headerUserInfo/headerUserInfo'
import './header-mobile.scss';


const HeaderMobile = () => {

  return(
    <div className="header__container">
      <div className="header">
          <div>
              <div className="header__logoContainer">
                  <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className='header__logo'/>
              </div>
          </div>
      </div>
      <div className="lower">
        <HeaderUserInfo />
      </div>
    </div>
  )
}


export default HeaderMobile; 