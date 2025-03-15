import React from "react";
import styles from "./info.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addSubscriber } from "../../../../redux/reducers/subscribeSlice";

const Info = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.subscribe);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Complete this field to continue"),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(addSubscriber(values.email))
        .unwrap()
        .then(() => {
          alert("Subscription successful!");
          formik.resetForm();
        })
        .catch(() => alert("Failed to subscribe"));
    },
  });

  return (
    <div className={styles.info}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.text}>
            <h2>
              Get information about special promotions, individual discounts, and
              the latest news
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <input
                  id="email"
                  name="email"
                  placeholder="E-mail"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={
                    formik.errors.email && formik.touched.email
                      ? styles.errorInput
                      : ""
                  }
                />
              </div>
              {formik.errors.email && formik.touched.email && (
                <p className={styles.errorText}>{formik.errors.email}</p>
              )}
              <button type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign up now"}
              </button>
            </form>
            {error && <p className={styles.errorText}>{error}</p>}
            <button>I Want To Unsubscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
