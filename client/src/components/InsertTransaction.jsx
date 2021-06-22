import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
// import LoandPersonFild from "./LoandPersonFild";

function InsertTransaction() {
  const his = useHistory();
  useEffect(() => {
    if (
      localStorage.getItem("api_token") == null ||
      (localStorage.getItem("api_token") == undefined &&
        localStorage.getItem("user_id") == null) ||
      localStorage.getItem("user_id") == undefined
    ) {
      his.push("/login");
    }

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

  const [Amount, setAmount] = useState("");
  const [AmountErr, setAmountErr] = useState("");
  const [TransactionFun, setTransactionFun] = useState("add");
  const [TransactionFunErr, setTransactionFunErr] = useState("");
  const [TransactionType, setTransactionType] = useState("cash");
  const [TransactionTypeErr, setTransactionTypeErr] = useState("");
  const [LoanedPerson, setLoanedPerson] = useState("");
  const [LoanedPersonErr, setLoanedPersonErr] = useState("");
  const [TransactionDetails, setTransactionDetails] = useState("");
  const [TransactionDetailsErr, setTransactionDetailsErr] = useState("");

  const [ModeOfTransaction, setModeOfTransaction] = useState("cash");
  const [ModeOfTransactionErr, setModeOfTransactionErr] = useState("");

  const submitTransactionForm = async () => {
    try {
      const res = await axios.post("user/set-transaction", {
        user_id: localStorage.getItem("user_id"),
        transactions_fun: TransactionFun,
        transactions_type: TransactionType,
        loand_person: LoanedPerson,
        transactions_detail: TransactionDetails,
        mode_of_transaction: ModeOfTransaction,
        amount: Amount,
      });
      if (res.data.error != null) {
        setAmountErr(res.data.error.amount);
        setTransactionFunErr(res.data.error.transactions_fun);
        setTransactionTypeErr(res.data.error.transactions_type);
        setTransactionDetailsErr(res.data.error.transactions_detail);
        setLoanedPersonErr(res.data.error.loand_person);
        setModeOfTransactionErr(res.data.error.mode_of_transaction);
      }
      // console.log(res.data);
      if (res.data.susses != null) {
        his.push("/");
      } else {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // -------------not to be send

  const [InputLoanShow, setInputLoanShow] = useState(false);
  const [NewInputLoanShow, setNewInputLoanShow] = useState(false);
  const [AllPreviosLoanedPerson, setAllPreviosLoanedPerson] = useState("");

  const setNextFild = (value) => {
    if (value !== "loan" && value !== "new loan") {
      if (InputLoanShow) {
        setInputLoanShow(!InputLoanShow);
      }
      if (NewInputLoanShow) {
        setNewInputLoanShow(!NewInputLoanShow);
      }
      setTransactionType(value);
    }
    if (value == "new loan") {
      setTransactionType("loan");
      if (InputLoanShow) {
        setInputLoanShow(!InputLoanShow);
      }
      setNewInputLoanShow(!NewInputLoanShow);
    }
    if (value == "loan") {
      (async () => {
        const AllLoandPerson = await axios.post("user/get-all-loand-person", {
          user_id: localStorage.getItem("user_id"),
        });
        setTransactionType(value);
        console.log(AllLoandPerson.data);
        setAllPreviosLoanedPerson(AllLoandPerson.data);
        if (NewInputLoanShow) {
          setNewInputLoanShow(!NewInputLoanShow);
        }
        setInputLoanShow(!InputLoanShow);
      })();
    }
  };

  return (
    <div>
      <div className="bg-gray-100 w-10/12 mx-auto my-6 p-5 rounded-lg shadow-lg">
        {/* ------------------------------------- */}
        <div className="mb-4">
          <label className="form_label">Amount</label>
          <input
            className="form_input"
            type="number"
            placeholder="Tansaction Amount"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          ></input>
          <p className="form_input_err">{AmountErr}</p>
        </div>
        {/* ---------------------------------------------------- */}
        <div className="mb-4">
          <label className="form_label">Add or Sub</label>
          <select
            onChange={(e) => {
              setTransactionFun(e.target.value);
              // console.log(e.target.value);
            }}
            className="form_input"
          >
            <option>add</option>
            <option>sub</option>
          </select>
          <p className="form_input_err">{TransactionFunErr}</p>
        </div>
        {/* ---------------------------------- */}
        <div className="mb-4">
          <label className="form_label">Transaction Type</label>
          <select
            onChange={(e) => {
              setNextFild(e.target.value);
            }}
            className="form_input"
          >
            <option>cash</option>
            <option>bank</option>
            <option>loan</option>
            <option>new loan</option>
          </select>
          <p className="form_input_err">{TransactionTypeErr}</p>
        </div>
        {/* ---------------------------------------- */}

        {InputLoanShow ? (
          <div>
            <div className="mb-4">
              <label className="form_label">Mode Of Transaction</label>
              <select
                onChange={(e) => {
                  setModeOfTransaction(e.target.value);
                }}
                className="form_input"
              >
                <option>cash</option>
                <option>bank</option>
              </select>
              <p className="form_input_err">{ModeOfTransactionErr}</p>
            </div>
            <div className="mb-4">
              <label className="form_label">Loand Person</label>
              <select
                onChange={(e) => {
                  setLoanedPerson(e.target.value.toString());
                  // console.log(e.target.value);
                }}
                className="form_input"
              >
                <option secleted></option>
                {AllPreviosLoanedPerson.map((myList) => (
                  <option key={myList}>{myList}</option>
                ))}
              </select>
              <p className="form_input_err">{LoanedPersonErr}</p>
            </div>
          </div>
        ) : null}

        {NewInputLoanShow ? (
          <div>
            <div className="mb-4">
              <label className="form_label">Mode Of Transaction</label>
              <select
                onChange={(e) => {
                  setModeOfTransaction(e.target.value);
                }}
                className="form_input"
              >
                <option>cash</option>
                <option>bank</option>
              </select>
              <p className="form_input_err">{ModeOfTransactionErr}</p>
            </div>
            <div className="mb-4">
              <label className="form_label">New Loand Person</label>
              <input
                className="form_input"
                type="text"
                placeholder="New Loand Person"
                onChange={(e) => {
                  setLoanedPerson(e.target.value);
                  // console.log(e.target.value);
                }}
              ></input>
              <p className="form_input_err">{LoanedPersonErr}</p>
            </div>
          </div>
        ) : null}

        {/* ---------------------------------------- */}

        <div className="mb-4">
          <label className="form_label">Transaction Details</label>
          <input
            className="form_input"
            type="text"
            placeholder="Tansaction Transaction Details"
            onChange={(e) => {
              setTransactionDetails(e.target.value);
            }}
          ></input>
          <p className="form_input_err">{TransactionDetailsErr}</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => submitTransactionForm()}
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}

export default InsertTransaction;
