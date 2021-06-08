import React, { useEffect, useState } from "react";
import { BsJustifyRight } from "react-icons/bs";
import { GoOctoface } from "react-icons/go";
import { Link } from "react-router-dom";
import MenuLinks from "../MenuLinks";

function Header() {
  const [Menu, setMenu] = useState(true);
  const [MenuCloser, setMenuCloser] = useState(true);

  const menuClass = Menu
    ? "hidden transition ease-in duration-75 transform opacity-0 scale-95"
    : "block transition ease-out duration-100 transform opacity-100 scale-100";

  const MenuCloserCLass = MenuCloser
    ? "hidden"
    : "fixed top-0 left-0 w-full h-full z-40";

  const runTow = () => {
    setMenu(!Menu);
    setMenuCloser(!MenuCloser);
  };

  return (
    <div>
      <nav className="w-full bg-blue-600 flex relative">
        {/* <a >Logo</a> */}
        <Link to="/">
          <GoOctoface className="mr-auto font-bold my-4 ml-6 text-4xl text-white" />
        </Link>

        <BsJustifyRight
          onClick={() => runTow()}
          className="ml-auto my-auto mr-6 text-3xl text-white"
        />
        <div onClick={() => runTow()}>
          <div
            className={`w-6/12 text-center bg-blue-600 absolute z-50 top-full mt-6 mr-6 right-0 rounded-2xl  ${menuClass}`}
          >
            <MenuLinks />
          </div>
        </div>
        <div
          onClick={() => {
            runTow();
          }}
          className={MenuCloserCLass}
        ></div>
      </nav>
    </div>
  );
}

export default Header;
