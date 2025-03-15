import React, { useEffect, useState } from "react";
import styles from "./users.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserThunk,
  deleteUserAdminThunk,
  updateUserAdminThunk,
} from "../../../../redux/reducers/userSlice";
import { FaTrash, FaEdit, FaCheck, FaSearch } from "react-icons/fa";
import { CgFormatCenter } from "react-icons/cg";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.users);

  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    countryCode: "",
  });
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    dispatch(getUserThunk());
  }, [dispatch]);

  const handleDelete = async (userId) => {
    const resultAction = await dispatch(deleteUserAdminThunk(userId));
    if (deleteUserAdminThunk.fulfilled.match(resultAction)) {
      dispatch(getUserThunk());
    }
  };

  const handleEditClick = (user) => {
    setEditMode(user._id);
    setFormData({
      name: user.name || "",
      surname: user.surname || "",
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      countryCode: user.countryCode || "",
    });
  };

  const handleInputChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleUpdate = async (userId) => {
    const resultAction = await dispatch(
      updateUserAdminThunk({ userId, updateData: formData })
    );
    if (updateUserAdminThunk.fulfilled.match(resultAction)) {
      setEditMode(null);
      dispatch(getUserThunk());
    }
  };

  const toggleSort = () => {
    if (sort === "") {
      setSort("name-asc");
    } else if (sort === "name-asc") {
      setSort("name-desc");
    } else if (sort === "name-desc") {
      setSort("email-asc");
    } else if (sort === "email-asc") {
      setSort("email-desc");
    } else if (sort === "email-desc") {
      setSort("date-desc");
    } else if (sort === "date-desc") {
      setSort("date-asc");
    } else {
      setSort("");
    }
  };

  const filteredUsers = users
    .filter((user) =>
      user.email.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      if (sort === "email-asc") return a.email.localeCompare(b.email);
      if (sort === "email-desc") return b.email.localeCompare(a.email);
      if (sort === "date-asc")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "date-desc")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <div className={styles.users}>
      <div className={styles.content}>
        <form onSubmit={(e) => e.preventDefault()} className={styles.filtered}>
          <div className={styles.search}>
            <span>
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search by email"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className={styles.buttons}>
            <button onClick={() => navigate("/admin/add-users")}>
              <IoAddOutline />
            </button>
            <button onClick={toggleSort}>
              <CgFormatCenter />
            </button>
          </div>
        </form>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Lastname</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Country Code</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={user.role === "admin" ? styles.admin : ""}
                    >
                      <td>
                        {editMode === user._id ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange(e, "name")}
                            autoFocus
                          />
                        ) : (
                          user.name || "N/A"
                        )}
                      </td>
                      <td>
                        {editMode === user._id ? (
                          <input
                            type="text"
                            value={formData.surname}
                            onChange={(e) => handleInputChange(e, "surname")}
                          />
                        ) : (
                          user.surname || "N/A"
                        )}
                      </td>
                      <td>
                        {editMode === user._id ? (
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleInputChange(e, "username")}
                          />
                        ) : (
                          user.username
                        )}
                      </td>
                      <td style={{ textTransform: "lowercase" }}>
                        {editMode === user._id ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange(e, "email")}
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td>
                        {editMode === user._id ? (
                          <input
                            type="text"
                            value={formData.countryCode}
                            onChange={(e) =>
                              handleInputChange(e, "countryCode")
                            }
                          />
                        ) : (
                          user.countryCode
                        )}
                      </td>
                      <td>
                        {editMode === user._id ? (
                          <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => handleInputChange(e, "phone")}
                          />
                        ) : (
                          user.phone
                        )}
                      </td>
                      <td>
                        <div className={styles.admin}>{user.role}</div>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {editMode === user._id ? (
                          <button
                            className={styles.save}
                            onClick={() => handleUpdate(user._id)}
                          >
                            <FaCheck />
                          </button>
                        ) : (
                          <button
                            className={styles.edit}
                            onClick={() => handleEditClick(user)}
                          >
                            <FaEdit />
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          className={styles.delete}
                          onClick={() => handleDelete(user._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center" }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
