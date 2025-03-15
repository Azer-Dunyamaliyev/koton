import React from "react";
import Layout from "../../layout/Layout";
import styles from "./basket.module.scss";
import BasketCart from "./components/basketCart/BasketCart";
import Shopping from "./components/shopping/Shopping";
const Basket = () => {
  return (
    <Layout>
      <div className={styles.basket}>
        <div className="container">
          <div className={styles.content}>
            <div className={styles.main}>
                <BasketCart />
                <Shopping />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Basket;
