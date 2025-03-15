import React from "react";
import Layout from "../../layout/Layout";
import styles from "./chackout.module.scss";
import CheckoutHeader from "./checkout_header/CheckoutHeader";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const Checkout = () => {
  const stripePromise = loadStripe(
    "pk_test_51QtvfzRR8oYWn0OLVYyPZLfIYNDY7YZFI4J4RKV6Q6aRtq3r9bepdZII4mTENzuXZqJgFG0QenXgfifvseTuFync00uV4pLk3F"
  );
  return (
    <div className={styles.checkout}>
      <Layout showFooter={false}>
        <Elements stripe={stripePromise}>
          <CheckoutHeader />
        </Elements>
      </Layout>
      <div className={styles.sidebar}></div>
    </div>
  );
};

export default Checkout;
