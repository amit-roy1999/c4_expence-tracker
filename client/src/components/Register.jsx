import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

function Register() {
  const his = useHistory();

  useEffect(() => {
    if (localStorage.getItem("api_token") != null) {
      his.push("/");
    }
    return () => {
      if (localStorage.getItem("api_token") != null) {
        his.push("/");
      }
    };
  }, []);

  const [Name, setName] = useState("");
  const [NameErr, setNameErr] = useState("");
  const [Email, setEmail] = useState("");
  const [EmailErr, setEmailErr] = useState("");
  const [Password, setPassword] = useState("");
  const [PasswordErr, setPasswordErr] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [ConfirmPasswordErr, setConfirmPasswordErr] = useState("");

  const submitForm = async () => {
    try {
      const res = await axios.post(
        "auth/register",
        {
          name: Name,
          email: Email,
          password: Password,
          password_confirm: ConfirmPassword,
        },
        { headers: "" }
      );

      // console.log(res.data);

      if (res.data.error != null) {
        setNameErr(res.data.error.name);
        setEmailErr(res.data.error.email);
        setPasswordErr(res.data.error.password);
        setConfirmPasswordErr(res.data.error.password_confirm);

        // console.log(res.data.error.name);
      }
      if (res.data.api_token != null && res.data.id != null) {
        localStorage.api_token = res.data.api_token;
        localStorage.user_id = res.data.id;
        his.push("/set-inisial-amount");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="bg-gray-100 w-10/12 mx-auto my-6 p-5 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="form_label">Name</label>
          <input
            className="form_input"
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
          <p className="form_input_err"> {NameErr}</p>
        </div>
        <div className="mb-4">
          <label className="form_label">Email</label>
          <input
            className="form_input"
            type="email"
            placeholder="Your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <p className="form_input_err"> {EmailErr}</p>
        </div>
        <div className="mb-4">
          <label className="form_label">Password</label>
          <input
            className="form_input"
            type="password"
            placeholder="Your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <p className="form_input_err"> {PasswordErr}</p>
        </div>
        <div className="mb-4">
          <label className="form_label">Confirm Password</label>
          <input
            className="form_input"
            type="password"
            placeholder="Enter your password agine"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          ></input>
          <p className="form_input_err"> {ConfirmPasswordErr}</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => submitForm()}
          >
            Register
          </button>
          {/* <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a> */}
        </div>
      </div>
    </div>
  );
}

export default Register;
