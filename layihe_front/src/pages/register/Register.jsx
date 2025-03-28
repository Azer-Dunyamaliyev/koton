import React, { useState } from "react";
import Layout from "../../layout/Layout";
import { useFormik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import styles from "./register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import flag1 from "../../assets/images/flag1.gif";
import flag2 from "../../assets/images/flag2.gif";
import flag3 from "../../assets/images/flag3.png";
import flag4 from "../../assets/images/flag4.png";
import flag5 from "../../assets/images/flag5.png";
import flag6 from "../../assets/images/flag6.gif";
import flag7 from "../../assets/images/flag7.png";
import flag8 from "../../assets/images/flag8.png";
import { useDispatch } from "react-redux";
import { postRegisterThunk } from "../../redux/reducers/userSlice";
const countryOptions = [
  { value: "+994", label: "AZE", flag: flag1 },
  { value: "+995", label: "GEO", flag: flag2 },
  { value: "+92", label: "PAK", flag: flag3 },
  { value: "+7", label: "RUS", flag: flag4 },
  { value: "+90", label: "TUR", flag: flag5 },
  { value: "+66", label: "TAI", flag: flag6 },
  { value: "+421", label: "SLO", flag: flag7 },
  { value: "+966", label: "SAU", flag: flag8 },
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
      countryCode: selectedCountry.value,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .matches(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores"
        )
        .min(5, "Username must be at least 5 characters")
        .max(20, "Username must be at most 20 characters")
        .required("Complete this field to continue"),
      email: Yup.string()
        .email("Enter a valid email")
        .required("Complete this field to continue"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Complete this field to continue"),
      phone: Yup.string()
        .matches(/^\d+$/, "Only numbers allowed")
        .min(6, "Must be at least 6 digits")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      setErrorMessage(null);
      try {
        const result = await dispatch(postRegisterThunk(values));

        if (result.payload) {
          if (result.payload.success) {
            formik.resetForm();
            navigate("/login");
          } else {
            setErrorMessage(result.payload.message);
          }
        } else {
          setErrorMessage("An error has occurred.");
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
          console.error("Hata:", error.message);
          setErrorMessage("An error occurred, please try again.");
        }
      }
    },
  });

  return (
    <Layout>
      <div className={styles.register}>
        <div className="container">
          <div className={styles.content}>
            <div className={styles.create}>
              <h2>Create your account</h2>
              <form onSubmit={formik.handleSubmit}>
                {/* Username Input */}
                <div>
                  <input
                    id="username"
                    name="username"
                    placeholder="Username"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    className={
                      formik.errors.username && formik.touched.username
                        ? styles.errorInput
                        : ""
                    }
                  />
                </div>
                {formik.errors.username && formik.touched.username && (
                  <p className={styles.errorText}>{formik.errors.username}</p>
                )}

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

                <div className={styles.nomer}>
                  {/* Ülke Kodları Dropdown */}
                  <Select
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={(selected) => {
                      setSelectedCountry(selected);
                      formik.setFieldValue("countryCode", selected.value);
                    }}
                    getOptionLabel={(e) => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={e.flag}
                          alt={e.label}
                          style={{ width: "20px", height: "15px" }}
                        />
                        {e.value}
                      </div>
                    )}
                    styles={{
                      dropdownIndicator: (base) => ({
                        ...base,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }),

                      control: (base) => ({
                        ...base,
                        height: "45px",
                        width: "120px",
                        borderRadius: "0",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "14px",
                      }),
                      input: (base) => ({
                        ...base,
                        padding: "0",
                        margin: "0",
                        fontSize: "14px !important",
                      }),
                      menuList: (base) => ({
                        ...base,
                        maxHeight: "150px",
                        overflowY: "auto",
                      }),
                    }}
                  />

                  <div className={styles.nomer_input}>
                    {/* Telefon Numarası Input */}
                    <input
                      type="text"
                      name="phone"
                      placeholder="Mobile"
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, ""); // Sadece rakamları al
                        formik.setFieldValue("phone", onlyNumbers);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                      inputMode="numeric" // Mobilde sayısal klavye açar
                      style={{
                        border:
                          formik.errors.phone && formik.touched.phone
                            ? "1px solid #cb4848"
                            : "1px solid #b2b2b2",
                      }}
                    />

                    {/* Hata Mesajı */}
                    {formik.errors.phone && formik.touched.phone && (
                      <p
                        className={styles.errorText}
                        style={{ padding: "10px 0 0" }}
                      >
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>
                </div>
                {errorMessage && (
                  <p className={styles.errorText}>{errorMessage}</p>
                )}
                <button className={styles.submit} type="submit">
                  Create account
                </button>
              </form>
              <p>
                Already have an account?{" "}
                <span>
                  <Link to={"/login"} className={styles.sign_in}>
                    Sign in
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
