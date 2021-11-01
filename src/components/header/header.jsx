import React, { useState } from "react";
import HeaderPc from "./header-pc/header-pc";
import HeaderMobile from "./header-mobile/header-mobile";

const Header = () => {
  const [changedValue, onChange] = useState(window.innerWidth);

  window.addEventListener("resize", () => {
    onChange(window.innerWidth);
  });
  return changedValue < 600 ? <HeaderMobile /> : <HeaderPc />;
};

export default Header;
