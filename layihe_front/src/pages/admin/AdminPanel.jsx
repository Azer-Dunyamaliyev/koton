import React from "react";
import Sidebar from "./components/sidebar/Sidebar";
import styles from "./admin.module.scss";
import { Outlet } from "react-router-dom";
const AdminPanel = () => {
  return (
    <div className={styles.admin}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
