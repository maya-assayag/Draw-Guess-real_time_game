import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            MyAD
          </NavLink>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
              <NavLink className="nav-link" to="waiting-page">
                Client
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
