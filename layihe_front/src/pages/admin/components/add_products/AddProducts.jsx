import React, { useState } from "react";
import styles from "./addproducts.module.scss";
import { AiFillShop } from "react-icons/ai";
import { useFormik } from "formik";
import axios from "axios";
import UploadImage from "../uploadImage/UploadImage";
import { addProductThunk } from "../../../../redux/reducers/productsSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const AddProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categoriesOption = ["Jacket", "Jeans", "Shoes", "T-Shirts"];
  const nameOption = ["Man", "Woman", "Kids"];
  const [imageUrls, setImageUrls] = useState([]);

  const getSizesOption = (category, name) => {
    if (name === "Kids") {
      if (
        category === "Jacket" ||
        category === "T-Shirts" ||
        category === "Jeans"
      ) {
        return ["6", "7", "8", "9", "10", "11", "12"];
      }
      if (category === "Shoes") {
        return [
          "29",
          "30",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
        ];
      }
    } else {
      if (category === "Jacket" || category === "T-Shirts") {
        return ["XS", "S", "M", "XL", "XLL"];
      }
      if (category === "Shoes") {
        return name === "Man"
          ? ["39", "40", "41", "42", "43", "44", "45"]
          : ["36", "37", "38", "39", "40", "41", "42"];
      }
      if (category === "Jeans") {
        return name === "Man"
          ? ["29", "30", "31", "32", "33", "34", "35", "36"]
          : ["25", "26", "27", "28", "29", "30", "31", "32", "33", "34"];
      }
    }
    return [];
  };

  const handleSizeClick = (size) => {
    if (formikInfo.values.sizes.includes(size)) {
      formikInfo.setFieldValue(
        "sizes",
        formikInfo.values.sizes.filter((s) => s !== size)
      );
    } else {
      formikInfo.setFieldValue("sizes", [...formikInfo.values.sizes, size]);
    }
  };

  const validationSchema = Yup.object({
    description: Yup.string()
      .trim()
      .required("Product name is required")
      .min(3, "Must be at least 3 characters"),
    info: Yup.string()
      .trim()
      .required("Product description is required")
      .min(10, "Must be at least 10 characters"),
    sizes: Yup.array().min(1, "At least one size must be selected"),
    name: Yup.string().trim().required("Category selection is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than 0")
      .required("Price is required"),
    stock: Yup.number()
      .typeError("Stock must be a number")
      .integer("Stock must be an integer")
      .min(0, "Stock cannot be negative")
      .required("Stock is required"),
    category: Yup.string().trim().required("Category selection is required"),
  });

  const formikInfo = useFormik({
    initialValues: {
      description: "",
      info: "",
      sizes: [],
      name: "",
      price: "",
      stock: "",
      images: [],
      category: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const productData = {
        description: values.description.toLowerCase(),
        info: values.info.toLowerCase(),
        sizes: values.sizes.map((size) => size.toLowerCase()),
        name: values.name.toLowerCase(),
        price: parseFloat(values.price),
        stock: parseInt(values.stock, 10),
        images: imageUrls,
        category: values.category.toLowerCase(),
      };

      dispatch(addProductThunk(productData))
        .unwrap()
        .then((res) => {
          formikInfo.resetForm(); 
          setImageUrls([]);
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  const sizesOption = getSizesOption(
    formikInfo.values.category,
    formikInfo.values.name
  );

  return (
    <div className={styles.add}>
      <div className={styles.header}>
        <h2>
          <span>
            <AiFillShop />
          </span>
          Add New Products
        </h2>
        <form onSubmit={formikInfo.handleSubmit}>
          <button type="submit">Add Product</button>
        </form>
      </div>

      <div className={styles.forms}>
        <div className={styles.generalForms}>
          <div className={styles.generalInformation}>
            <h2>General Information</h2>
            <form onSubmit={formikInfo.handleSubmit}>
              <div className={styles.input}>
                <label htmlFor="description">Name products</label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  onBlur={formikInfo.handleBlur}
                  onChange={formikInfo.handleChange}
                  value={formikInfo.values.description}
                />
                {formikInfo.touched.description &&
                  formikInfo.errors.description && (
                    <p className={styles.error}>
                      {formikInfo.errors.description}
                    </p>
                  )}
              </div>
              <div className={styles.input}>
                <label htmlFor="info">Description Products</label>
                <textarea
                  name="info"
                  id="info"
                  onBlur={formikInfo.handleBlur}
                  onChange={formikInfo.handleChange}
                  value={formikInfo.values.info}
                ></textarea>
                {formikInfo.touched.info && formikInfo.errors.info && (
                  <p className={styles.error}>{formikInfo.errors.info}</p>
                )}
              </div>
            </form>
            <div className={styles.mini_information}>
              <div className={styles.size_form}>
                <label htmlFor="sizes">Size</label>
                <p>Pick Available Size</p>
                <div className={styles.sizes}>
                  {sizesOption.map((size) => (
                    <div
                      key={size}
                      className={`${styles.sizeItem} ${
                        formikInfo.values.sizes.includes(size)
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => handleSizeClick(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.select_gender}>
                <label htmlFor="category">Category</label>
                <p>Pick Available category</p>
                <div className={styles.genders}>
                  {nameOption.map((category) => (
                    <label key={category} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="name"
                        value={category}
                        onBlur={formikInfo.handleBlur}
                        checked={formikInfo.values.name === category}
                        onChange={formikInfo.handleChange}
                      />
                      <h5>{category}</h5>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.pricing}>
            <h2>Pricing and Stock</h2>
            <div className={styles.inputs}>
              <div className={styles.input}>
                <label htmlFor="price">Base price</label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  onBlur={formikInfo.handleBlur}
                  onChange={formikInfo.handleChange}
                  value={formikInfo.values.price}
                />
                {formikInfo.touched.price && formikInfo.errors.price && (
                  <p className={styles.error}>{formikInfo.errors.price}</p>
                )}
              </div>
              <div className={styles.input}>
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  name="stock"
                  type="text"
                  onBlur={formikInfo.handleBlur}
                  onChange={formikInfo.handleChange}
                  value={formikInfo.values.stock}
                />
                {formikInfo.touched.stock && formikInfo.errors.stock && (
                  <p className={styles.error}>{formikInfo.errors.stock}</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.category}>
            <h2>Category</h2>
            <select
              name="category"
              value={formikInfo.values.category}
              onChange={formikInfo.handleChange}
              onBlur={formikInfo.handleBlur}
            >
              <option value="" disabled>
                Select Category
              </option>
              {categoriesOption.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.upload_form}>
            <UploadImage setImageUrls={setImageUrls} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
