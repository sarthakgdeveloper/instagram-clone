import React from 'react';
import HeaderUserInfo from '../headerUserInfo/headerUserInfo'
import './header.scss';

const Header = () => (
    <div className="header__container">
        <div className="header">
            <div>
                <div className="header__logoContainer">
                    <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className='header__logo'/>
                </div>
            </div>
            <div>
                <div className="header__searchContainer">
                    <i className="fas fa-search header__searchIcon"></i>
                    <input type="text" placeholder='search' className='header__search'/>
                </div>
            </div>
            <HeaderUserInfo />
        </div>
    </div>
)

export default Header;