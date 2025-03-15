import React, { useEffect } from "react";
import styles from "./account.module.scss";
import Layout from "../../layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMeThunk, logout } from "../../redux/reducers/userSlice";
const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { me, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getMeThunk());
  }, [dispatch]);
  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
  };
  return (
    <Layout>
      <div className={styles.account}>
        <div className="container">
          <div className={styles.content}>
            <div className={styles.texts}>
              {loading ? (
                <h3>Loading...</h3>
              ) : (
                <h3>{me.name || me.username || "USER"}</h3>
              )}
              <ul>
                <li onClick={() => navigate('/purchases')}>
                  <div className={styles.title}>
                    <span>
                      <svg
                        role="presentation"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4 8H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M8 4H16L20 8H4L8 4Z"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M8 12H12"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>
                    <Link to={'/purchases'}>My purchases</Link>
                  </div>
                  <span>
                    <svg
                      width="15"
                      height="24"
                      role="img"
                      aria-hidden="true"
                      className="Icon_icon-content-1__kPDLF ListItem_iconArrow__hVHTC"
                      xmlns="http://www.w3.org/2000/svg"
                      xml="preserve"
                      viewBox="0 0 24 24"
                    >
                      <path d="m13.9 5.4.7-.7L22 12l-7.4 7.4-.7-.7 6.1-6.1H2v-1h18.1z"></path>
                    </svg>
                  </span>
                </li>
                <li onClick={() => navigate("/detail")}>
                  <div className={styles.title}>
                    <span>
                      <svg
                        role="presentation"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 12C21 13.8569 20.4376 15.5825 19.4739 17.0157C17.858 19.4189 15.1136 21 12 21C8.88636 21 6.14202 19.4189 4.52609 17.0157C3.56237 15.5825 3 13.8569 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="black"
                          strokeWidth="1.5"
                        ></path>
                        <path
                          d="M14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
                          stroke="black"
                          strokeWidth="1.5"
                        ></path>
                        <path
                          d="M15 15H8.99998C7.18822 15 5.6578 16.2045 5.16583 17.8564C6.81645 19.7808 9.26583 21 12 21C14.7341 21 17.1835 19.7808 18.8341 17.8564C18.3421 16.2045 16.8117 15 15 15Z"
                          stroke="black"
                          strokeWidth="1.5"
                        ></path>
                      </svg>
                    </span>
                    <Link onClick={() => navigate("/detail")}>
                      Personal details
                    </Link>
                  </div>
                  <span>
                    <svg
                      width="15"
                      height="24"
                      role="img"
                      aria-hidden="true"
                      className="Icon_icon-content-1__kPDLF ListItem_iconArrow__hVHTC"
                      xmlns="http://www.w3.org/2000/svg"
                      xml="preserve"
                      viewBox="0 0 24 24"
                    >
                      <path d="m13.9 5.4.7-.7L22 12l-7.4 7.4-.7-.7 6.1-6.1H2v-1h18.1z"></path>
                    </svg>
                  </span>
                </li>
                <li onClick={() => navigate("/address")}>
                  <div className={styles.title}>
                    <span>
                      <svg
                        role="presentation"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 4V18C3 19.1046 3.89543 20 5 20H17H19C20.1046 20 21 19.1046 21 18V8H17"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M3 4H17V18C17 19.1046 17.8954 20 19 20V20"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M13 8L7 8"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M13 12L9 12"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>
                    <Link onClick={() => navigate("/address")}>Addresses</Link>
                  </div>
                  <span>
                    <svg
                      width="15"
                      height="24"
                      role="img"
                      aria-hidden="true"
                      className="Icon_icon-content-1__kPDLF ListItem_iconArrow__hVHTC"
                      xmlns="http://www.w3.org/2000/svg"
                      xml="preserve"
                      viewBox="0 0 24 24"
                    >
                      <path d="m13.9 5.4.7-.7L22 12l-7.4 7.4-.7-.7 6.1-6.1H2v-1h18.1z"></path>
                    </svg>
                  </span>
                </li>
              </ul>
              <button onClick={handleLogout}>Sign out</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
