import React, { useEffect, useState } from "react";
import styles from "./adminproducts.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProductsThunk,
  updateProductThunk,
  deleteProductThunk,
} from "../../../../redux/reducers/productsSlice";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import { CgFormatCenter } from "react-icons/cg";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({});
  const [text, setText] = useState("");
  const [sort, setSort] = useState("");

  const filteredData = products
  .filter((item) => {
    const category = item.category ? item.category.toLowerCase() : "";
    const description = item.description ? item.description.toLowerCase() : "";

    return category.includes(text.toLowerCase()) || description.includes(text.toLowerCase());
  })
  .sort((a, b) => {
    if (sort === "asc") {
      return b.price - a.price; 
    } else if (sort === "desc") {
      return a.price - b.price;
    } else if (sort === "az") {
      return a.category.localeCompare(b.category); 
    } else if (sort === "za") {
      return b.category.localeCompare(a.category); 
    }
  });

  const toggleSort = () => {
    if (sort === "") {
      setSort("asc"); 
    } else if (sort === "asc") {
      setSort("desc"); 
    } else if (sort === "desc") {
      setSort("az"); 
    } else if (sort === "az") {
      setSort("za"); 
    } else {
      setSort(""); 
    }
  };

  useEffect(() => {
    dispatch(getAllProductsThunk());
  }, [dispatch]);

  const handleEditClick = (product) => {
    setEditMode(product._id);
    setFormData({
      description: product.description,
      category: product.category,
      price: product.price,
    });
  };

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleUpdate = async (productId) => {
    const resultAction = await dispatch(
      updateProductThunk({ productId, updatedData: formData })
    );
    if (updateProductThunk.fulfilled.match(resultAction)) {
      dispatch(getAllProductsThunk());
    }
    setEditMode(null);
  };

  const handleDelete = async (productId) => {
    const resultAction = await dispatch(deleteProductThunk(productId));
    if (deleteProductThunk.fulfilled.match(resultAction)) {
      dispatch(getAllProductsThunk());
    }
  };

  const getProductImage = (item) => {
    if (item.variants && item.variants.length > 0) {
      const defaultVariant = item.variants.find(
        (variant) => variant.color === item.defaultColor
      );

      if (defaultVariant && defaultVariant.images.length > 0) {
        return defaultVariant.images[0];
      }
    }

    return item.images && item.images.length > 0 ? item.images[0] : null;
  };

  return (
    <div className={styles.products}>
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
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
                placeholder="Search"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className={styles.buttons}>
              <button onClick={() => navigate("/admin/add-products")}>
                <IoAddOutline />
              </button>
              <button onClick={toggleSort}>
                <CgFormatCenter />
              </button>
            </div>
          </form>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item._id}
                      className={editMode === item._id ? styles.editing : ""}
                    >
                      <td>
                        {getProductImage(item) ? (
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            width="100"
                          />
                        ) : (
                          <span>No image available</span>
                        )}
                      </td>
                      <td>
                        {editMode === item._id ? (
                          <input
                            type="text"
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange(e, "description")
                            }
                          />
                        ) : (
                          item.description
                        )}
                      </td>
                      <td>
                        {editMode === item._id ? (
                          <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => handleInputChange(e, "category")}
                          />
                        ) : (
                          item.category
                        )}
                      </td>
                      <td>
                        {editMode === item._id ? (
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleInputChange(e, "price")}
                          />
                        ) : (
                          `${item.price}$`
                        )}
                      </td>
                      <td>
                        {editMode === item._id ? (
                          <button
                            className={styles.save}
                            onClick={() => handleUpdate(item._id)}
                          >
                            <FaCheck />
                          </button>
                        ) : (
                          <button
                            className={styles.edit}
                            onClick={() => handleEditClick(item)}
                          >
                            <FaEdit />
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          className={styles.delete}
                          onClick={() => handleDelete(item._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        fontSize: "18px",
                        color: "#fff",
                      }}
                    >
                      No products found
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

export default AdminProducts;
