import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function MenuLinks() {
  // const [Token, setToken] = useState(null);
  const his = useHistory();
  const Logout = () => {
    localStorage.removeItem("api_token");
    localStorage.removeItem("user_id");
    his.push("/login");
  };
  // useEffect(() => {
  //   setToken(localStorage.getItem("api_token"));
  //   return () => {
  //     setToken(localStorage.getItem("api_token"));
  //   };
  // }, [Token]);

  if (localStorage.getItem("api_token") != null) {
    return (
      <ul>
        <li className="list-item pt-5" onClick={() => Logout()}>
          Logout
        </li>
      </ul>
    );
  } else {
    return (
      <ul>
        <li className="list-item pt-5">
          <Link to="/login">Login</Link>
        </li>
        <li className="list-item">
          <Link to="/register">Register</Link>
        </li>
      </ul>
    );
  }
}
