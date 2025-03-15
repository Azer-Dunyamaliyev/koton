import React, { useEffect, useState } from "react";
import styles from "./header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useDispatch, useSelector } from "react-redux";
import { getMeThunk, logout } from "../../redux/reducers/userSlice";
import { getUserOrders } from "../../redux/reducers/basketSlice";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, username } = useSelector((state) => state.users);
  const [isOpen, setIsOpen] = React.useState(false);
  const { me, loading } = useSelector((state) => state.users);
  const orders = useSelector((state) => state.basket.orders);
  const userId = "USER_ID";

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(getMeThunk());
    dispatch(getUserOrders(userId));
  }, [dispatch, userId]);

  return (
    <div className={styles.header}>
      <div className="container">
        <div className={styles.content}>
          <nav className={styles.nv}>
            <ul>
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"/woman"}>Woman</Link>
              </li>
              <li>
                <Link to={"/man"}>Man</Link>
              </li>
              <li className={styles.open_burger}>
                <button onClick={toggleDrawer}>
                  <svg
                    width="24"
                    height="24"
                    role="img"
                    aria-hidden="true"
                    className="Icon_icon-content-1__kPDLF HamburgerButton_menuIcon__s_6KJ"
                    xmlns="http://www.w3.org/2000/svg"
                    xml="preserve"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 13H3v-1h18zm0-6H3v1h18zm0 10H3v1h18z"></path>
                  </svg>
                </button>
                <Drawer
                  open={isOpen}
                  onClose={toggleDrawer}
                  direction="left"
                  className={styles.burger_menu}
                >
                  <div className={styles.burger_content}>
                    <div className={styles.links}>
                      <Link to={"/"}>Home</Link>
                      <Link to={"/woman"}>Woman</Link>
                      <Link to={"/man"}>Man</Link>
                      <Link to={"/kids"}>Kids</Link>
                    </div>
                    <button
                      className={styles.remove_burger}
                      onClick={toggleDrawer}
                    >
                      <svg
                        width="24"
                        height="24"
                        role="img"
                        aria-hidden="true"
                        className="icon-content"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m12.707 12 2.647 2.646-.708.708L12 12.707l-2.646 2.647-.708-.708L11.293 12 8.646 9.354l.708-.708L12 11.293l2.646-2.647.708.708z"></path>
                      </svg>
                    </button>
                  </div>
                </Drawer>
              </li>
            </ul>
            <Link to={"/"} className={styles.lg}>
              <img src={logo} alt="lg" />
            </Link>
          </nav>
          <Link to={"/"} className={styles.logo}>
            <img src={logo} alt="lg" />
          </Link>
          <ul>
            {token ? (
              <li className={styles.account}>
                <Link to="/account">My Account</Link>
                <div className={styles.module}>
                  {loading ? (
                    <h3>Loading...</h3>
                  ) : (
                    <h3>
                      Hello {me.name || me.username || me.email || "User"}
                    </h3>
                  )}
                  <ul>
                    <li onClick={() => navigate("/account")}>
                      <Link>My account</Link>
                      <span>
                        <svg
                          width="24"
                          height="24"
                          role="img"
                          aria-hidden="true"
                          className="Icon_icon-content-1__kPDLF SeoBanner_buttonIcon__w24i9"
                          xmlns="http://www.w3.org/2000/svg"
                          xml="preserve"
                          viewBox="0 0 24 24"
                        >
                          <path d="m9.354 18.354-.707-.708L14.293 12 8.647 6.354l.707-.708L15.707 12z"></path>
                        </svg>
                      </span>
                    </li>
                    <li onClick={handleLogout}>
                      <button>Sign out</button>{" "}
                      <span>
                        <svg
                          width="24"
                          height="24"
                          role="img"
                          aria-hidden="true"
                          className="Icon_icon-content-1__kPDLF SeoBanner_buttonIcon__w24i9"
                          xmlns="http://www.w3.org/2000/svg"
                          xml="preserve"
                          viewBox="0 0 24 24"
                        >
                          <path d="m9.354 18.354-.707-.708L14.293 12 8.647 6.354l.707-.708L15.707 12z"></path>
                        </svg>
                      </span>
                    </li>
                  </ul>
                </div>
              </li>
            ) : (
              <li className={styles.login}>
                <Link to={"/login"}>Log In</Link>
                <div className={styles.module}>
                  <Link to={"/login"} className={styles.btn}>
                    Sign In
                  </Link>
                  <p>
                    Don’t have an account?{" "}
                    <span>
                      <Link to={"/register"}>Register</Link>
                    </span>
                  </p>
                </div>
              </li>
            )}
            {me.role === "admin" && (
              <li className={styles.admin}>
                <Link to={"/admin"}>Admin</Link>
              </li>
            )}
            <li>
              <Link to={"/wishlist"}>Favorite products</Link>
            </li>
            <li>
              <Link to={"/basket"}>
                Bag<span>({orders.length})</span>
              </Link>
            </li>
          </ul>
          <ul className={styles.res}>
            <li>
              <Link to={token ? "/account" : "/login"}>
                <svg
                  width="24"
                  height="24"
                  role="img"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.757 0 5-2.243 5-5s-2.243-5-5-5-5 2.243-5 5 2.243 5 5 5m0-9c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4m0 11c-4.56 0-8 3.224-8 7.5v.5h16v-.5c0-4.276-3.44-7.5-8-7.5m-6.981 7c.257-3.454 3.172-6 6.981-6s6.724 2.546 6.981 6z"></path>
                </svg>
              </Link>
            </li>
            {me.role === "admin" && (
              <li className={styles.admin}>
                <Link to={"/admin"}><MdOutlineAdminPanelSettings /></Link>
              </li>
            )}
            <li>
              <Link to={"/wishlist"}>
                <svg
                  width="24"
                  height="24"
                  role="img"
                  aria-hidden="true"
                  className="Icon_icon-content-1__kPDLF Icons_icon__rdhbo"
                  xmlns="http://www.w3.org/2000/svg"
                  xml="preserve"
                  viewBox="0 0 24 24"
                >
                  <path d="m12 21-.4-.4c-.8-.8-1.5-1.5-2.3-2.2-3.7-3.5-6.8-6.5-6.8-10.1 0-2.8 1.9-5.1 4.3-5.3 2-.2 3.7.7 5.2 2.6 1.5-1.9 3.2-2.8 5.2-2.6 2.5.2 4.3 2.5 4.3 5.3 0 3.6-3.2 6.6-6.8 10.1-.8.7-1.5 1.5-2.3 2.2zM7.3 4h-.4C5 4.2 3.5 6 3.5 8.3c0 3.2 3 6.1 6.5 9.4.7.6 1.3 1.3 2 1.9.7-.7 1.3-1.3 2-1.9 3.5-3.3 6.5-6.2 6.5-9.4C20.5 6 19 4.2 17.1 4c-1.7-.2-3.3.7-4.7 2.7l-.4.6-.4-.6C10.3 4.9 8.9 4 7.3 4"></path>
                </svg>
              </Link>
            </li>
            <li>
              <Link className={styles.basket} to={"/basket"}>
                <span>{orders.length}</span>
                <svg
                  width="24"
                  height="24"
                  role="img"
                  className="Icon_icon-content-1__kPDLF ShoppingCartButton_icon__Ktqg8"
                  xmlns="http://www.w3.org/2000/svg"
                  xml="preserve"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 5.9C16 3.7 14.2 2 12 2S8 3.8 8 5.9H4v16h16V6h-4Zm-7 0C9 4.3 10.4 3 12 3s3 1.3 3 2.9zM19 7v14H5V7"></path>
                  <title>Sepet</title>
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
