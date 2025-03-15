import React, { useState } from "react";
import Layout from "../../layout/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { postLoginThunk } from "../../redux/reducers/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Complete this field to continue"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Complete this field to continue"),
    }),
    onSubmit: async (values) => {
      setErrorMessage(null);
      try {
        const result = await dispatch(postLoginThunk(values));
        if (result.payload && result.payload.token) {
          formik.resetForm();
          localStorage.setItem("token", result.payload.token);
          navigate("/");
        } else {
          setErrorMessage(result.payload?.message || "An error has occurred.");
        }
      } catch (error) {
        console.error("API Error:", error);

        if (error.response) {
          setErrorMessage(
            error.response.data.message ||
              "An error occurred, please try again."
          );
        } else if (error.request) {
          setErrorMessage(
            "Could not connect to the server. Please check your internet connection."
          );
        } else {
          setErrorMessage("An error occurred, please try again.");
        }
      }
    },
  });

  return (
    <Layout>
      <div className={styles.login}>
        <div className="container">
          <div className={styles.content}>
            <div className={styles.sign_in}>
              <h2>Sign in</h2>
              <form onSubmit={formik.handleSubmit}>
                {/* E-mail Input */}
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

                {/* Password Input */}
                <div
                  className={styles.password}
                  style={{
                    border:
                      formik.errors.password && formik.touched.password
                        ? "1px solid #cb4848"
                        : "1px solid #b2b2b2",
                  }}
                >
                  <input
                    id="password"
                    name="password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <svg
                        width="24"
                        height="24"
                        role="img"
                        aria-hidden="true"
                        className="Icon_icon-content-1__kPDLF"
                        xmlns="http://www.w3.org/2000/svg"
                        xml="preserve"
                        viewBox="0 0 24 24"
                      >
                        <path d="m16.878 7.83 3.976-3.976-.708-.708-4.16 4.161C14.825 6.696 13.489 6.266 12 6.266c-5.24 0-8.653 5.242-8.796 5.464l-.173.27.173.27c.091.142 1.527 2.336 3.918 3.9l-3.976 3.976.708.708 4.16-4.161c1.161.611 2.497 1.041 3.986 1.041 5.24 0 8.653-5.242 8.796-5.464l.173-.27-.173-.27c-.091-.142-1.527-2.336-3.918-3.9M4.234 12C4.99 10.959 7.954 7.266 12 7.266c1.181 0 2.267.32 3.236.791L13.733 9.56A3 3 0 0 0 12 9c-1.654 0-3 1.346-3 3 0 .647.21 1.243.56 1.733l-1.706 1.706c-1.862-1.17-3.157-2.801-3.62-3.439M14 12c0 1.103-.897 2-2 2-.37 0-.712-.108-1.01-.284l2.726-2.725c.176.297.284.64.284 1.009m-4 0c0-1.103.897-2 2-2 .37 0 .712.108 1.01.284l-2.726 2.725A2 2 0 0 1 10 12m2 4.734c-1.181 0-2.267-.32-3.236-.791l1.503-1.503c.49.35 1.086.56 1.733.56 1.654 0 3-1.346 3-3a2.97 2.97 0 0 0-.56-1.733l1.706-1.706c1.862 1.17 3.157 2.801 3.62 3.439-.755 1.041-3.72 4.734-7.766 4.734"></path>
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        role="img"
                        aria-hidden="true"
                        className="Icon_icon-content-1__kPDLF"
                        xmlns="http://www.w3.org/2000/svg"
                        xml="preserve"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 6.266c-5.24 0-8.653 5.242-8.796 5.464l-.173.27.173.27c.143.222 3.557 5.464 8.796 5.464s8.653-5.242 8.796-5.464l.173-.27-.173-.27c-.143-.222-3.557-5.464-8.796-5.464m0 10.468c-4.046 0-7.01-3.693-7.766-4.734.755-1.041 3.72-4.734 7.766-4.734s7.01 3.693 7.766 4.734c-.755 1.041-3.72 4.734-7.766 4.734M12 9c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3m0 5c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2"></path>
                      </svg>
                    )}
                  </button>
                </div>
                {formik.errors.password && formik.touched.password && (
                  <p className={styles.errorText}>{formik.errors.password}</p>
                )}
                {errorMessage && (
                  <p className={styles.errorText}>{errorMessage}</p>
                )}
                <button className={styles.submit} type="submit">
                  Sign in
                </button>
                <Link to={"/register"} className={styles.create}>
                  Create account
                </Link>
              </form>
              <Link className={styles.forgot}>Forgotten your password?</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
