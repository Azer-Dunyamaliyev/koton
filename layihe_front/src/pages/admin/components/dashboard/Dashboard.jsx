import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./dashboard.module.scss";
import { getAllSuccessOrdersThunk } from "../../../../redux/reducers/ordersSlice";
import { getUserThunk } from "../../../../redux/reducers/userSlice";
import { getAllProductsThunk } from "../../../../redux/reducers/productsSlice";
import { FaUsers } from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";
import { FaBox } from "react-icons/fa";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.users);
  const { products } = useSelector((state) => state.products);
  const { successOrders } = useSelector((state) => state.orders);

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    dispatch(getAllProductsThunk());
    dispatch(getUserThunk());
    dispatch(getAllSuccessOrdersThunk());
  }, [dispatch]);

  useEffect(() => {
    const animateCount = (finalValue, setter) => {
      let start = 0;
      const increment = Math.ceil(finalValue / 50); 
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= finalValue) {
          clearInterval(timer);
          setter(finalValue);
        } else {
          setter(start);
        }
      }, 30); 
    };

    if (users.length) animateCount(users.length, setUserCount);
    if (products.length) animateCount(products.length, setProductCount);
    if (successOrders.length) animateCount(successOrders.length, setOrderCount);

  }, [users, products, successOrders]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.content}>
        <div className={styles.texts}>
          <h1>Welcome to Admin Panel</h1>
          <p>Manage your products, orders, and users efficiently.</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.card}>
            <h2>Total Users <span><FaUsers /></span></h2>
            <p>+{userCount}</p>
          </div>
          <div className={styles.card}>
            <h2>Total Products <span><AiFillShop /></span></h2>
            <p>+{productCount}</p>
          </div>
          <div className={styles.card}>
            <h2>Orders <span><FaBox /></span></h2>
            <p>+{orderCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
