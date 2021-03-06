import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import io from "socket.io-client";
import Header from "./components/header";
import Home from "./components/home/home";
import WordChoosing from "./components/wordChoosing/wordChoosing";
import WaitingPage from "./components/waitingPage/waitingPage";
import SessionsScoreTable from "./components/sessionsScoreTable";
import Playground from "./components/playground/playground";
import NotFound from "./components/notFound";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const socket = io.connect(process.env.REACT_APP_API_URL);

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
        <Route path="/score-table" component={SessionsScoreTable} />
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
