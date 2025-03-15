import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSuccessOrdersThunk,
  updateSuccesOrdersThunk,
  deleteSuccesOrderAdminThunk,
} from "../../../../redux/reducers/ordersSlice";
import { FaEdit, FaTrash, FaCheck, FaSearch } from "react-icons/fa";
import styles from "./orders.module.scss";
import { CgFormatCenter } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { successOrders, loading, error } = useSelector(
    (state) => state.orders
  );
  const [editMode, setEditMode] = useState(null);
  const [editedOrder, setEditedOrder] = useState({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    dispatch(getAllSuccessOrdersThunk());
  }, [dispatch]);

  const handleEditClick = (order) => {
    setEditMode(order._id);
    setEditedOrder({ status: order.status });
  };

  const handleUpdate = async (orderId) => {
    await dispatch(updateSuccesOrdersThunk({ orderId, status: editedOrder.status }));
    dispatch(getAllSuccessOrdersThunk());
    setEditMode(null);
  };

  const handleDelete = async (orderId) => {
    await dispatch(deleteSuccesOrderAdminThunk(orderId));
    dispatch(getAllSuccessOrdersThunk());
  };

  const handleChange = (e) => {
    setEditedOrder({ status: e.target.value });
  };

  const toggleSort = () => {
    if (sort === "") {
      setSort("asc");
    } else if (sort === "asc") {
      setSort("desc");
    } else {
      setSort("");
    }
  };

  const filteredOrders = successOrders
    .filter((order) =>
      (order.userId?.email || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "asc") {
        return a.status.localeCompare(b.status);
      } else if (sort === "desc") {
        return b.status.localeCompare(a.status);
      }
      return 0;
    });

  return (
    <div className={styles.orders}>
      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : error ? (
        <p className={styles.error}>Error: {error}</p>
      ) : (
        <div className={styles.content}>
          <form
            action=""
            onSubmit={(e) => e.preventDefault()}
            className={styles.filtered}
          >
            <div className={styles.search}>
              <span>
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search by email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.buttons}>
              <button onClick={toggleSort}>
                <CgFormatCenter />
              </button>
            </div>
          </form>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Payment Status</th>
                  <th>Item</th>
                  <th>Total</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className={editMode === order._id ? styles.editing : ""}
                    >
                      <td>{order._id}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{textTransform: "lowercase"}}>{order.userId ? order.userId.email : "Unknown"}</td>
                      <td>
                        {editMode === order._id ? (
                          <select value={editedOrder.status} onChange={handleChange}>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        ) : (
                          order.status
                        )}
                      </td>
                      <td>{order.products ? order.products.length : 0}</td>
                      <td>${order.totalPrice}</td>
                      <td>
                        {editMode === order._id ? (
                          <button
                            className={styles.save}
                            onClick={() => handleUpdate(order._id)}
                          >
                            <FaCheck />
                          </button>
                        ) : (
                          <button
                            className={styles.edit}
                            onClick={() => handleEditClick(order)}
                          >
                            <FaEdit />
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          className={styles.delete}
                          onClick={() => handleDelete(order._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className={styles.noData}>
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
