import React from "react";
import BULogo from "../assets/BU-Logo.png";
import "./Header.scss";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="heading-container">
      <div className="logo-container print-only-center">
        <img src={BULogo} alt="Barkatullah Vishwavidyalaya Logo" />
      </div>
      <h1 className="print-only-center">Barkatullah Vishwavidyalaya</h1>

      <nav className="header-nav no-print">
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
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `header-nav__link ${isActive ? "header-nav__link--active" : ""}`
              }
            >
              <span>About</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
