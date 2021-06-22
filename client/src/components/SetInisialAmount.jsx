import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

function SetInisialAmount() {
  const his = useHistory();
  //   const [Test, setTest] = useState("");
  useEffect(() => {
    if (
      localStorage.getItem("api_token") == null ||
      (localStorage.getItem("api_token") == undefined &&
        localStorage.getItem("user_id") == null) ||
      localStorage.getItem("user_id") == undefined
    ) {
      his.push("/login");
    }
    (async () => {
      const res = await axios.post("user/get-initial-amount", {
        id: localStorage.getItem("user_id"),
      });
      if (res.data.cash != null || res.data.bank != null) {
        his.push("/");
      }
    })();
    return () => {
      if (
        localStorage.getItem("api_token") == null ||
        (localStorage.getItem("api_token") == undefined &&
          localStorage.getItem("user_id") == null) ||
        localStorage.getItem("user_id") == undefined
      ) {
        his.push("/login");
      }
    };
  }, []);

  const [Cash, setCash] = useState("");
  const [CashErr, setCashErr] = useState("");
  const [Bank, setBank] = useState("");
  const [BankErr, setBankErr] = useState("");

  const SetInisialAmountForm = async () => {
    try {
      const res = await axios.post("user/set-initial-amount", {
        id: localStorage.getItem("user_id"),
        cash: Cash,
        bank: Bank,
      });
      if (res.data.error != null) {
        setCashErr(res.data.error.cash);
        setBankErr(res.data.error.bank);
        // console.log(res.data.error.name);
      }
      if (res.data.redirectTo != null) {
        his.push("/");
      }
      //   console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="bg-gray-100 w-10/12 mx-auto my-6 p-5 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="form_label">Cash</label>
          <input
            className="form_input"
            type="number"
            placeholder="Your current cash amount"
            onChange={(e) => {
              setCash(e.target.value);
            }}
          ></input>
          <p className="form_input_err"> {CashErr}</p>
        </div>
        <div className="mb-4">
          <label className="form_label">Bank</label>
          <input
            className="form_input"
            type="number"
            placeholder="Your current Bank amount"
            onChange={(e) => {
              setBank(e.target.value);
            }}
          ></input>
          <p className="form_input_err"> {BankErr}</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => SetInisialAmountForm()}
          >
            Set Amount
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetInisialAmount;
