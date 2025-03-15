import React, { useEffect, useState } from "react";
import styles from "./collectioncarts.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoryThunk,
  getNameCategoryThunk,
} from "../../../redux/reducers/productsSlice";
import Collectioncart from "../collection_cart/Collectioncart";

const Collectioncarts = ({ padd }) => {
  const navigate = useNavigate();
  const { name, category } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (name && !category) {
      dispatch(getCategoryThunk({ name }));
    } else if (name && category) {
      dispatch(getNameCategoryThunk({ name, category }));
    }
  }, [dispatch, name, category]);

  useEffect(() => {
    if (category && products.length > 0) {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    } else if (!category && products.length > 0) {
      setFilteredProducts(products);
    }
  }, [category, products]);

  const handleDetail = (data, selectedColor) => {
    const colorToSend = selectedColor || data.defaultColor;
    navigate(`/category/${data.name}/detail-collection`, {
      state: { ...data, selectedColor: colorToSend },
    });
  };

  if (error)
    return <p style={{ textAlign: "center" }}>No products available</p>;
  return (
    <div className={styles.fashion} style={{ padding: padd }}>
      <div className="container">
        <div className={styles.content}>
          {filteredProducts.length > 0 ? (
            <div className={styles.carts}>
              {filteredProducts &&
                filteredProducts.map((item, index) => (
                  <Collectioncart
                    key={index}
                    item={item}
                    handleDetail={(selectedColor) => handleDetail(item, selectedColor)}
                  />
                ))}
            </div>
          ) : (
            <p style={{ textAlign: "center" }}>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collectioncarts;
