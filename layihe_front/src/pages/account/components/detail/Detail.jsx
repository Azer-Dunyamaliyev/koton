import React, { useEffect, useState } from "react";
import styles from "./detail.module.scss";
import Layout from "../../../../layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserThunk,
  getMeThunk,
  updateNameThunk,
  updatePasswordThunk,
  updatePhoneThunk,
  updateSurNameThunk,
  updateUsernameThunk,
} from "../../../../redux/reducers/userSlice";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import flag1 from "../../../../assets/images/flag1.gif";
import flag2 from "../../../../assets/images/flag2.gif";
import flag3 from "../../../../assets/images/flag3.png";
import flag4 from "../../../../assets/images/flag4.png";
import flag5 from "../../../../assets/images/flag5.png";
import flag6 from "../../../../assets/images/flag6.gif";
import flag7 from "../../../../assets/images/flag7.png";
import flag8 from "../../../../assets/images/flag8.png";
import { useNavigate } from "react-router-dom";

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

const Detail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { me, loading, error } = useSelector((state) => state.users);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [errorMessage, setErrorMessage] = useState(null);

  // USER NAME DRWAER
  const [isUserRealNameOpen, setIsUserRealNameOpen] = React.useState(false);
  const toggleUserRealNameDrawer = () => {
    setIsUserRealNameOpen((prevState) => !prevState);
  };

  // USER SURNAME DRWAER
  const [isUserSurNameOpen, setIsUserSurNameOpen] = React.useState(false);
  const toggleUserSurNameDrawer = () => {
    setIsUserSurNameOpen((prevState) => !prevState);
  };

  // USERNAME DRWAER
  const [isUserNameOpen, setIsUserNameOpen] = React.useState(false);
  const toggleUserNameDrawer = () => {
    setIsUserNameOpen((prevState) => !prevState);
  };

  //EMAIL DRWAER
  const [isEmailOpen, setIsEmailOpen] = React.useState(false);
  const toggleEmailDrawer = () => {
    setIsEmailOpen((prevState) => !prevState);
  };

  //MOBILE DRWAER
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const toggleMobileDrawer = () => {
    setIsMobileOpen((prevState) => !prevState);
  };

  //PASWORD DRAWER
  const [isPasswordOpen, setIsPasswordOpen] = React.useState(false);
  const togglePasswordDrawer = () => {
    setIsPasswordOpen((prevState) => !prevState);
  };

  const handleDelete = () => {
    dispatch(deleteUserThunk())
      .unwrap()
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
      });
  };

  //USER FORMIK
  const formikUserRealName = useFormik({
    initialValues: {
      name: me.name || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateNameThunk(values.name)).then(() => {
        dispatch(getMeThunk());
        toggleUserRealNameDrawer();
      });
    },
  });

   //SURUSER FORMIK
   const formikUserSurName = useFormik({
    initialValues: {
      surname: me.surname || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateSurNameThunk(values.surname)).then(() => {
        dispatch(getMeThunk());
        toggleUserSurNameDrawer();
      });
    },
  });

  //USER FORMIK
  const formikUserName = useFormik({
    initialValues: {
      username: me.username || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateUsernameThunk(values.username));
      toggleUserNameDrawer();
    },
  });

  //EMAIL FORMIK
  const formikEmail = useFormik({
    initialValues: {
      email: me.email || "",
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Complete this field to continue"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updatePasswordThunk(values)) // Thunk ile form verisini gönderiyoruz
        .then((response) => {
          // Başarı durumunda
          alert("Password updated successfully!");
        })
        .catch((error) => {
          // Hata durumunda
          alert(`Error: ${error.message || "Something went wrong"}`);
        });
    },
  });

  //PHONE FORMIK
  const formikMobile = useFormik({
    initialValues: {
      phone: me.phone || "",
      countryCode: me.countryCode || "",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .matches(/^\d+$/, "Only numbers allowed")
        .min(6, "Must be at least 6 digits")
        .required("Phone number is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const token = localStorage.getItem("token");
      dispatch(updatePhoneThunk({ ...values, token }));
      toggleMobileDrawer();
    },
  });

  //USER PASSWORD
  const formikPassword = useFormik({
    initialValues: {
      password: "",
      newpassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Complete this field to continue"),
      newpassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Complete this field to continue"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(
        updatePasswordThunk({
          oldPassword: values.password,
          newPassword: values.newpassword,
        })
      )
        .then((action) => {
          if (
            action.payload &&
            action.payload.message === "Password updated successfully!"
          ) {
            alert("Password updated successfully!");
            formikPassword.resetForm();
            togglePasswordDrawer();
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error("Error response:", error.response.data);
            alert("Error: " + error.response.data.message);
          } else {
            alert("Error: " + error.message || "Something went wrong!");
          }
        });
    },
  });

  useEffect(() => {
    dispatch(getMeThunk());
  }, [dispatch]);

  return (
    <Layout>
      <div className={styles.detail}>
        <div className="container">
          <div className={styles.content}>
            <div className={styles.texts}>
              <h3>My details</h3>
              <ul>
                <li>
                  <div className={styles.user_detail}>
                    <div className={styles.title}>
                      <label htmlFor="">NAME</label>
                      {loading ? (
                        <h5>Loading...</h5>
                      ) : me.name ? (
                        <h5>{me.name} </h5>
                      ) : (
                        <h5>What’s your name?</h5>
                      )}

                      <Drawer
                        open={isUserRealNameOpen}
                        onClose={toggleUserRealNameDrawer}
                        direction="right"
                        className={styles.sidebar}
                        style={{ width: "500px", padding: "0 40px" }}
                      >
                        <div className={styles.menu}>
                          <div className={styles.texts}>
                            <div className={styles.head}>
                              <h3>Edit name</h3>
                              <button onClick={toggleUserRealNameDrawer}>
                                <svg
                                  width="24"
                                  height="24"
                                  role="img"
                                  className="Icon_icon-content-1__kPDLF"
                                  xmlns="http://www.w3.org/2000/svg"
                                  xml="preserve"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M17.354 7.354 12.707 12l4.647 4.646-.708.708L12 12.707l-4.646 4.647-.708-.708L11.293 12 6.646 7.354l.708-.708L12 11.293l4.646-4.647z"></path>
                                  <title lang="en">Close</title>
                                </svg>
                              </button>
                            </div>
                            <form onSubmit={formikUserRealName.handleSubmit}>
                              <input
                                id="name"
                                name="name"
                                placeholder={
                                  formikUserRealName.values.name === ""
                                    ? "Name"
                                    : ""
                                }
                                type="text"
                                onChange={formikUserRealName.handleChange}
                                value={formikUserRealName.values.name}
                              />

                              <button type="submit">Save</button>
                            </form>
                          </div>
                        </div>
                      </Drawer>
                    </div>
                    <button onClick={toggleUserRealNameDrawer}>
                      {me.name ? "Edit" : "Add"}
                    </button>
                  </div>
                </li>
                <li>
                  <div className={styles.user_detail}>
                    <div className={styles.title}>
                      <label htmlFor="">SURNAME</label>
                      {loading ? (
                        <h5>Loading...</h5>
                      ) : me.surname ? (
                        <h5>{me.surname} </h5>
                      ) : (
                        <h5>What’s your surname?</h5>
                      )}

                      <Drawer
                        open={isUserSurNameOpen}
                        onClose={toggleUserSurNameDrawer}
                        direction="right"
                        className={styles.sidebar}
                        style={{ width: "500px", padding: "0 40px" }}
                      >
                        <div className={styles.menu}>
                          <div className={styles.texts}>
                            <div className={styles.head}>
                              <h3>Edit surname</h3>
                              <button onClick={toggleUserSurNameDrawer}>
                                <svg
                                  width="24"
                                  height="24"
                                  role="img"
                                  className="Icon_icon-content-1__kPDLF"
                                  xmlns="http://www.w3.org/2000/svg"
                                  xml="preserve"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M17.354 7.354 12.707 12l4.647 4.646-.708.708L12 12.707l-4.646 4.647-.708-.708L11.293 12 6.646 7.354l.708-.708L12 11.293l4.646-4.647z"></path>
                                  <title lang="en">Close</title>
                                </svg>
                              </button>
                            </div>
                            <form onSubmit={formikUserSurName.handleSubmit}>
                              <input
                                id="surname"
                                name="surname"
                                placeholder={
                                  formikUserSurName.values.surname === ""
                                    ? "Surname"
                                    : ""
                                }
                                type="text"
                                onChange={formikUserSurName.handleChange}
                                value={formikUserSurName.values.surname}
                              />

                              <button type="submit">Save</button>
                            </form>
                          </div>
                        </div>
                      </Drawer>
                    </div>
                    <button onClick={toggleUserSurNameDrawer}>
                      {me.surname ? "Edit" : "Add"}
                    </button>
                  </div>
                </li>
                <li>
                  <div className={styles.user_detail}>
                    <div className={styles.title}>
                      <label htmlFor="">USERNAME</label>
                      {loading ? (
                        <h5>Loading...</h5>
                      ) : me.username ? (
                        <h5>{me.username} </h5>
                      ) : (
                        <h5>What’s your username?</h5>
                      )}

                      <Drawer
                        open={isUserNameOpen}
                        onClose={toggleUserNameDrawer}
                        direction="right"
                        className={styles.sidebar}
                        style={{ width: "500px", padding: "0 40px" }}
                      >
                        <div className={styles.menu}>
                          <div className={styles.texts}>
                            <div className={styles.head}>
                              <h3>Edit username</h3>
                              <button onClick={toggleUserNameDrawer}>
                                <svg
                                  width="24"
                                  height="24"
                                  role="img"
                                  className="Icon_icon-content-1__kPDLF"
                                  xmlns="http://www.w3.org/2000/svg"
                                  xml="preserve"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M17.354 7.354 12.707 12l4.647 4.646-.708.708L12 12.707l-4.646 4.647-.708-.708L11.293 12 6.646 7.354l.708-.708L12 11.293l4.646-4.647z"></path>
                                  <title lang="en">Close</title>
                                </svg>
                              </button>
                            </div>
                            <form onSubmit={formikUserName.handleSubmit}>
                              <input
                                id="username"
                                name="username"
                                placeholder={
                                  formikUserName.values.username === ""
                                    ? "Username"
                                    : ""
                                }
                                type="text"
                                onChange={formikUserName.handleChange}
                                value={formikUserName.values.username}
                              />

                              <button type="submit">Save</button>
                            </form>
                          </div>
                        </div>
                      </Drawer>
                    </div>
                    <button onClick={toggleUserNameDrawer}>
                      {me.username ? "Edit" : "Add"}
                    </button>
                  </div>
                </li>
                <li>
                  <div className={styles.user_detail}>
                    <div className={styles.title}>
                      <label htmlFor="">E-MAIL</label>
                      {loading ? (
                        <h5>Loading...</h5>
                      ) : me.username ? (
                        <h5>{me.email} </h5>
                      ) : (
                        <h5>What’s your e-mail?</h5>
                      )}
                      <Drawer
                        open={isEmailOpen}
                        onClose={toggleEmailDrawer}
                        direction="right"
                        className={styles.sidebar}
                        style={{ width: "500px", padding: "0 40px" }}
                      >
                        <div className={styles.menu}>
                          <div className={styles.texts}>
                            <div className={styles.head}>
                              <h3>Edit e-mail</h3>
                              <button onClick={toggleEmailDrawer}>
                                <svg
                                  width="24"
                                  height="24"
                                  role="img"
                                  className="Icon_icon-content-1__kPDLF"
                                  xmlns="http://www.w3.org/2000/svg"
                                  xml="preserve"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M17.354 7.354 12.707 12l4.647 4.646-.708.708L12 12.707l-4.646 4.647-.708-.708L11.293 12 6.646 7.354l.708-.708L12 11.293l4.646-4.647z"></path>
                                  <title lang="en">Close</title>
                                </svg>
                              </button>
                            </div>
                            <form onSubmit={formikEmail.handleSubmit}>
                              <input
                                id="email"
                                name="email"
                                placeholder={
                                  formikEmail.values.email === "" ? "Email" : ""
                                }
                                type="email"
                                onChange={formikEmail.handleChange}
                                value={formikEmail.values.email}
                              />
                              <div
                                className={styles.password}
                                style={{
                                  border:
                                    formikEmail.errors.password &&
                                    formikEmail.touched.password
                                      ? "1px solid #cb4848"
                                      : "1px solid #b2b2b2",
                                }}
                              >
                                <input
                                  id="password"
                                  name="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Password"
                                  onChange={formikEmail.handleChange}
                                  onBlur={formikEmail.handleBlur}
                                  value={formikEmail.values.password}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                  className={styles.eye}
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
                              {formikEmail.errors.password &&
                                formikEmail.touched.password && (
                                  <p className={styles.errorText}>
                                    {formikEmail.errors.password}
                                  </p>
                                )}

                              <button type="submit">Save</button>
                            </form>
                          </div>
                        </div>
                      </Drawer>
                    </div>
                    <button onClick={toggleEmailDrawer}>Edit</button>
                  </div>
                </li>
                <li>
                  <div className={styles.user_detail}>
                    <div className={styles.title}>
                      <label htmlFor="">Mobile</label>
                      {loading ? (
                        <h5>Loading...</h5>
                      ) : me.phone ? (
                        <h5>{me.phone} </h5>
                      ) : (
                        <h5>What’s your number?</h5>
                      )}
                      <Drawer
                        open={isMobileOpen}
                        onClose={toggleMobileDrawer}
                        direction="right"
                        className={styles.sidebar}
                        style={{ width: "500px", padding: "0 40px" }}
                      >
                        <div className={styles.menu}>
                          <div className={styles.texts}>
                            <div className={styles.head}>
                              <h3>Edit mobile number</h3>
                              <button onClick={toggleMobileDrawer}>
                                <svg
                                  width="24"
                                  height="24"
                                  role="img"
                                  className="Icon_icon-content-1__kPDLF"
                                  xmlns="http://www.w3.org/2000/svg"
                                  xml="preserve"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M17.354 7.354 12.707 12l4.647 4.646-.708.708L12 12.707l-4.646 4.647-.708-.708L11.293 12 6.646 7.354l.708-.708L12 11.293l4.646-4.647z"></path>
                                  <title lang="en">Close</title>
                                </svg>
                              </button>
                            </div>
                            <form onSubmit={formikMobile.handleSubmit}>
                              <div className={styles.nomer}>
                                <Select
                                  options={countryOptions}
                                  value={selectedCountry}
                                  onChange={(selected) => {
                                    setSelectedCountry(selected);
                                    formikMobile.setFieldValue(
                                      "countryCode",
                                      selected.value
                                    );
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
                                        style={{
                                          width: "20px",
                                          height: "15px",
                                        }}
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
                                  <input
                                    id=""
                                    type="text"
                                    name="phone"
                                    placeholder={
                                      formikMobile.values.phone === ""
                                        ? "Mobile"
                                        : ""
                                    }
                                    onChange={(e) => {
                                      const onlyNumbers =
                                        e.target.value.replace(/\D/g, ""); // Sadece rakamları al
                                      formikMobile.setFieldValue(
                                        "phone",
                                        onlyNumbers
                                      );
                                    }}
                                    onBlur={formikMobile.handleBlur}
                                    value={formikMobile.values.phone}
                                    inputMode="numeric"
                                    style={{
                                      border:
                                        formikMobile.errors.phone &&
                                        formikMobile.touched.phone
                                          ? "1px solid #cb4848"
                                          : "1px solid #b2b2b2",
                                    }}
                                  />
                                  {formikMobile.errors.phone &&
                                    formikMobile.touched.phone && (
                                      <p
                                        className={styles.errorText}
                                        style={{ padding: "10px 0 0" }}
                                      >
                                        {formikMobile.errors.phone}
                                      </p>
                                    )}
                                </div>
                              </div>
                              {errorMessage && (
                                <p className={styles.errorText}>
                                  {errorMessage}
                                </p>
                              )}

                              <button type="submit">Save</button>
                            </form>
                          </div>
                        </div>
                      </Drawer>
                    </div>
                    <button onClick={toggleMobileDrawer}>Edit</button>
                  </div>
                </li>
                <li>
                  <div className={styles.user_detail}>
                    <div className={styles.title}>
                      <label htmlFor="">PASSWORD</label>
                      <h5>••••••••••</h5>
                      <Drawer
                        open={isPasswordOpen}
                        onClose={togglePasswordDrawer}
                        direction="right"
                        className={styles.sidebar}
                        style={{ width: "500px", padding: "0 40px" }}
                      >
                        <div className={styles.menu}>
                          <div className={styles.texts}>
                            <div className={styles.head}>
                              <h3>Edit password</h3>
                              <button onClick={togglePasswordDrawer}>
                                <svg
                                  width="24"
                                  height="24"
                                  role="img"
                                  className="Icon_icon-content-1__kPDLF"
                                  xmlns="http://www.w3.org/2000/svg"
                                  xml="preserve"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M17.354 7.354 12.707 12l4.647 4.646-.708.708L12 12.707l-4.646 4.647-.708-.708L11.293 12 6.646 7.354l.708-.708L12 11.293l4.646-4.647z"></path>
                                  <title lang="en">Close</title>
                                </svg>
                              </button>
                            </div>
                            <form onSubmit={formikPassword.handleSubmit}>
                              <div className={styles.passwords}>
                                <div
                                  className={styles.password}
                                  style={{
                                    border:
                                      formikPassword.errors.password &&
                                      formikPassword.touched.password
                                        ? "1px solid #cb4848"
                                        : "1px solid #b2b2b2",
                                  }}
                                >
                                  <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    onChange={formikPassword.handleChange}
                                    onBlur={formikPassword.handleBlur}
                                    value={formikPassword.values.password}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword((prev) => !prev)
                                    }
                                    className={styles.eye}
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
                                {formikPassword.errors.password &&
                                  formikPassword.touched.password && (
                                    <p className={styles.errorText}>
                                      {formikPassword.errors.password}
                                    </p>
                                  )}
                                <div
                                  className={styles.password}
                                  style={{
                                    border:
                                      formikPassword.errors.newpassword &&
                                      formikPassword.touched.newpassword
                                        ? "1px solid #cb4848"
                                        : "1px solid #b2b2b2",
                                  }}
                                >
                                  <input
                                    id="newpassword"
                                    name="newpassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New password"
                                    onChange={formikPassword.handleChange}
                                    onBlur={formikPassword.handleBlur}
                                    value={formikPassword.values.newpassword}
                                    autocomplete="new-password"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowNewPassword((prev) => !prev)
                                    }
                                    className={styles.eye}
                                  >
                                    {showNewPassword ? (
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
                                {formikPassword.errors.newpassword &&
                                  formikPassword.touched.newpassword && (
                                    <p className={styles.errorText}>
                                      {formikPassword.errors.newpassword}
                                    </p>
                                  )}
                              </div>

                              <button type="submit">Save</button>
                            </form>
                          </div>
                        </div>
                      </Drawer>
                    </div>
                    <button onClick={togglePasswordDrawer}>Edit</button>
                  </div>
                </li>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </ul>
              <button className={styles.delete} onClick={handleDelete}>
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Detail;
