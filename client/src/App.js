import { Route, Switch, Redirect } from "react-router-dom";
import React from "react";
import { ToastContainer } from "react-toastify";
import _ from "lodash";
import io from "socket.io-client";
import Header from "./components/header";
import NotFound from "./components/notFound";
import Home from "./components/home/home";
import WordChoosing from "./components/wordChoosing";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import WaitingPage from "./components/waitingPage/waitingPage";
import SessionScoreTable from "./components/sessionScoreTable";
import Playground from "./components/playground";

const socket = io.connect("http://localhost:3900");

const App = () => {
  return (
    <React.Fragment>
      <ToastContainer />
      <Header />
      <Switch>
        <Route
          path="/play-ground"
          render={props => <Playground socket={socket} {...props} />}
        />
        <Route
          path="/waiting-page"
          render={props => <WaitingPage socket={socket} {...props} />}
        />
        <Route path="/score-table" component={SessionScoreTable} />
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
