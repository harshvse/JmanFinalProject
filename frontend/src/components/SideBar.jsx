import React from "react";
import styles from "./styles/SideBar.module.css";
import { NavLink } from "react-router-dom";

function SideBar() {
  return (
    <div className={styles.sideBar}>
      <NavLink className={styles.navLink}>ManageEmployee</NavLink>
    </div>
  );
}

export default SideBar;
