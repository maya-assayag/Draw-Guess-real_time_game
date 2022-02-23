import { Route, Switch, Redirect } from "react-router-dom";
import React, { Component, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import _ from "lodash";
import io from "socket.io-client";
import Header from "./components/header";
import NotFound from "./components/notFound";
import Home from "./components/home";
import WordChoosing from "./components/wordChoosing";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Drawing from "./components/drawing";
import WaitingPage from "./components/waitingPage";
import ScoreTable from "./components/scoreTable";
import Gussing from "./components/guessing";

const socket = io.connect("http://localhost:3900");

const App = () => {
  return (
    <React.Fragment>
      <ToastContainer />
      <Header />
      <Switch>
        <Route
          path="/client-page/drawing"
          render={props => <Drawing socket={socket} {...props} />}
        />
        <Route
          path="/client-page/guessing"
          render={props => <Gussing socket={socket} {...props} />}
        />
        <Route
          path="/waiting-page"
          render={props => <WaitingPage socket={socket} {...props} />}
        />
        <Route path="/score-table" component={ScoreTable} />
        <Route
          path="/word-choosing"
          render={props => <WordChoosing socket={socket} {...props} />}
        />
        <Route path="/not-found" component={NotFound} />
        <Route path="/" render={props => <Home socket={socket} {...props} />} />
        <Redirect to="/not-found" />
      </Switch>
    </React.Fragment>
  );
};

export default App;
