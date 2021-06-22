import axios from "axios";
import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import AllLoandPerson from "./components/AllLoandPerson";
import Home from "./components/Home";
import InsertTransaction from "./components/InsertTransaction";
import Header from "./components/layouts/Header";
import ListComponent from "./components/ListComponent";
import Login from "./components/Login";
import Register from "./components/Register";
import SetInisialAmount from "./components/SetInisialAmount";

function App() {
  // axios.defaults.baseURL = "http://amit-roy.lovestoblog.com/et/public/api";
  axios.defaults.baseURL = "http://localhost/expense_tracker/api";
  axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("api_token");

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/set-inisial-amount">
          <SetInisialAmount />
        </Route>
        <Route path="/all-loand-person-details">
          <AllLoandPerson />
        </Route>
        <Route path="/new-transaction">
          <InsertTransaction />
        </Route>
        <Route path="/all-transactions">
          <ListComponent />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
