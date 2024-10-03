import React from "react";
import styles from "./styles/SideBar.module.css";
import { NavLink } from "react-router-dom";

const SideBar = ({ links }) => {
  return (
    <div className={styles.sideBar}>
      {links.map((link, index) => (
        <NavLink key={index} to={link.to} className={styles.navLink}>
          {link.label}
        </NavLink>
      ))}
    </div>
  );
};

export default SideBar;
