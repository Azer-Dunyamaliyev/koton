import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getMeThunk,
  updateAddressThunk,
  updateTownThunk,
} from "../../../../redux/reducers/userSlice";
import styles from "./address.module.scss";
import Layout from "../../../../layout/Layout";
import { useFormik } from "formik";
import Drawer from "react-modern-drawer";

const Address = () => {
  const dispatch = useDispatch();
  const { me, loading, error } = useSelector((state) => state.users);
  const [address, setAddress] = useState(me?.address || "");

  // USER ADDRESS DRWAER
  const [isUserAddressOpen, setIsUserAddressOpen] = React.useState(false);
  const toggleUserAddressDrawer = () => {
    setIsUserAddressOpen((prevState) => !prevState);
  };

  // USER ADDRESS TOWN
  const [isUserTownOpen, setIsUserTownOpen] = React.useState(false);
  const toggleUserTownDrawer = () => {
    setIsUserTownOpen((prevState) => !prevState);
  };

  //USER ADDRESS FORMIK
  const formikUserAddress = useFormik({
    initialValues: {
      address: me.address || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateAddressThunk(values.address)).then(() => {
        dispatch(getMeThunk());
        toggleUserAddressDrawer();
      });
    },
  });

  //USER ADDRESS FORMIK
  const formikUserTown = useFormik({
    initialValues: {
      town: me.town || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateTownThunk(values.town)).then(() => {
        dispatch(getMeThunk());
        toggleUserTownDrawer();
      });
    },
  });

  useEffect(() => {
    dispatch(getMeThunk());
  }, [dispatch]);

  return (
    <Layout>
      <div className={styles.address}>
        <div className="container">
          <div className={styles.content}>
            <div className={styles.texts}>
              <h3>My Adddress</h3>
              <ul>
                <li>
                  <div className={styles.user_address}>
                    <div className={styles.title}>
                      <label htmlFor="">Address</label>
                      {loading ? (
                        <h5>Loading...</h5>
                      ) : me.address ? (
                        <h5>{me.address} </h5>
                      ) : (
                        <h5>What’s your address?</h5>
                      )}

                      <Drawer
                        open={isUserAddressOpen}
                        onClose={toggleUserAddressDrawer}
                        direction="right"
                        className={styles.sidebar}
                        style={{ width: "500px", padding: "0 40px" }}
                      >
                        <div className={styles.menu}>
                          <div className={styles.texts}>
                            <div className={styles.head}>
                              <h3>Edit address</h3>
                              <button onClick={toggleUserAddressDrawer}>
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
                            <form onSubmit={formikUserAddress.handleSubmit}>
                              <input
                                id="address"
                                name="address"
                                placeholder={
                                  formikUserAddress.values.address === ""
                                    ? "Address"
                                    : ""
                                }
                                type="text"
                                onChange={formikUserAddress.handleChange}
                                value={formikUserAddress.values.address}
                              />

                              <button type="submit">Save</button>
                            </form>
                          </div>
                        </div>
                      </Drawer>
                    </div>
                    <button onClick={toggleUserAddressDrawer}>
                      {me.address ? "Edit" : "Add"}
                    </button>
                  </div>
                </li>
                <li>
                  <div className={styles.user_address}>
                    <div className={styles.user_address}>
                      <div className={styles.title}>
                        <label htmlFor="">Town</label>
                        {loading ? (
                          <h5>Loading...</h5>
                        ) : me.town ? (
                          <h5>{me.town} </h5>
                        ) : (
                          <h5>What’s your town?</h5>
                        )}

                        <Drawer
                          open={isUserTownOpen}
                          onClose={toggleUserTownDrawer}
                          direction="right"
                          className={styles.sidebar}
                          style={{ width: "500px", padding: "0 40px" }}
                        >
                          <div className={styles.menu}>
                            <div className={styles.texts}>
                              <div className={styles.head}>
                                <h3>Edit town</h3>
                                <button onClick={toggleUserTownDrawer}>
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
                              <form onSubmit={formikUserTown.handleSubmit}>
                                <input
                                  id="town"
                                  name="town"
                                  placeholder={
                                    formikUserTown.values.town === ""
                                      ? "Town"
                                      : ""
                                  }
                                  type="text"
                                  onChange={formikUserTown.handleChange}
                                  value={formikUserTown.values.town}
                                />

                                <button type="submit">Save</button>
                              </form>
                            </div>
                          </div>
                        </Drawer>
                      </div>
                      <button onClick={toggleUserTownDrawer}>
                        {me.town ? "Edit" : "Add"}
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Address;
