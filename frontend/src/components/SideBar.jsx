import React from "react";
import styles from "./styles/SideBar.module.css";
import { NavLink } from "react-router-dom";

function SideBar() {
  return (
    <div className={styles.sideBar}>
      <NavLink to="/admin/view-employees" className={styles.navLink}>
        View Employees
      </NavLink>
      <NavLink to="/admin/manage-team" className={styles.navLink}>
        Manage Team
      </NavLink>
    </div>
  );
}

export default SideBar;
