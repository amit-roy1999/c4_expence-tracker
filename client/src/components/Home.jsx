import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

function Home() {
  const his = useHistory();
  const [Data, setData] = useState({ cash: "", bank: "", loan: "", total: "" });
  useEffect(() => {
    if (
      localStorage.getItem("api_token") == null ||
      (localStorage.getItem("api_token") == undefined &&
        localStorage.getItem("user_id") == null) ||
      localStorage.getItem("user_id") == undefined
    ) {
      his.push("/login");
    }
    // console.log(localStorage.getItem("user_id"));
    (async () => {
      const res = await axios.post("user/get-initial-amount", {
        id: localStorage.getItem("user_id"),
      });
      if (res.data.cash == null || res.data.bank == null) {
        his.push("/set-inisial-amount");
      }
      // console.log(res.data);

      setData({
        cash: res.data.cash,
        bank: res.data.bank,
        loan: res.data.loan,
        total: res.data.total,
      });
    })();

    return () => {
      if (
        localStorage.getItem("api_token") == null ||
        localStorage.getItem("api_token") == undefined
      ) {
        his.push("/login");
      }
    };
  }, []);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mt-12 mx-4">
        <div className="home_card_green">
          <p>Total Cash: {Data.cash}</p>
        </div>
        <div className="home_card_blue">
          <p>Total Bank: {Data.bank}</p>
        </div>
        <div className="home_card_red">
          <p>Total Loan: {Data.loan}</p>
        </div>
        <div className="home_card_green">
          <p>Total : {Data.total}</p>
        </div>
        {/* <h1 className="text-center text-gray-600 my-16 text-6xl">home</h1> */}
      </div>
      <div className="absolute bottom-0 left-0 mb-4 w-full">
        <Link
          to="/new-transaction"
          className="button_blue w-1/2 float-right mr-4"
        >
          Enter Transaction
        </Link>
        <Link
          to="/all-transactions"
          className="button_blue w-1/3 float-left ml-4"
        >
          All Transactions
        </Link>
      </div>
    </div>
  );
}

export default Home;
