import React from "react";
import BULogo from "../assets/BU-Logo.png";
import { Link } from "react-router-dom";
import "./Header.scss";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="heading-container">
      <div className="logo-container">
        <img src={BULogo} alt="Barkatullah Vishwavidyalaya Logo" />
      </div>
      <h1>
        Barkatullah <br /> Vishwavidyalaya
      </h1>

      <nav className="header-nav">
        <ul className="header-nav__list">
          <li>
            <NavLink
              to="/sheetFormatter"
              className={({ isActive }) =>
                `header-nav__link ${isActive ? "header-nav__link--active" : ""}`
              }
            >
              <span>Sheet Formatter</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/paperCount"
              className={({ isActive }) =>
                `header-nav__link ${isActive ? "header-nav__link--active" : ""}`
              }
            >
              <span>Paper Wise Student Count</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="header-right">
        <h2 className="uploader-title">XLS File Formatter</h2>
        <p>Upload, filter, and format your Excel files</p>
      </div>
    </header>
  );
};

export default Header;
