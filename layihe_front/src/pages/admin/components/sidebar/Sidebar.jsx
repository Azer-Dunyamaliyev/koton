import React from "react";
import styles from "./sidebar.module.scss";
import { Link } from "react-router-dom"; 
import { IoBagCheckSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/admin/admin-products">
            <span className={styles.icon}>
              <AiFillShop />
            </span>
            <span className={styles.text}>Products</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/orders">
            <span className={styles.icon}>
              <IoBagCheckSharp />
            </span>
            <span className={styles.text}>Orders</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/users">
            <span className={styles.icon}>
              <FaUsers />
            </span>
            <span className={styles.text}>Users</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
