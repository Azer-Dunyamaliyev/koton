import React, { useEffect, useState } from "react";
import styles from "./collectionheader.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryThunk } from "../../../redux/reducers/productsSlice";

const Collectionheader = () => {
  const navigate = useNavigate();
  const { name,category } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    if (name) {
      dispatch(getCategoryThunk({ name }));
    }
  }, [dispatch, name,category]);

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [
        ...new Map(
          products
            .filter((item) => item.category && item.category.trim() !== "")
            .map((item) => [item.category, item])
        ).values(),
      ];
      setCategories((prev) => {
        const allCategories = [...prev, ...uniqueCategories];
        return [...new Map(allCategories.map((item) => [item.category, item])).values()];
      });
    }
  }, [products]);

  const menuItems = ["See all", ...categories];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (category) {
      const index = categories.findIndex(
        (item) => item.category === category
      );
      if (index !== -1) {
        setActiveIndex(index + 1); // "See all" öncesi index
      }
    } else {
      setActiveIndex(0); // "See all" seçildiğinde
    }
  }, [category, categories]);

  const handleCategoryClick = (index, category) => {
    setActiveIndex(index);
    if (category === "See all") {
      navigate(`/category/${name}`);
    } else {
      navigate(`/category/${name}/${category}`);
    }
  };
  if(error) return <p style={{textAlign: "center"}}>No products available</p>
  return (
    <div className={styles.header}>
      <div className="container">
        <div className={styles.content}>
            <ul>
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={index === activeIndex ? styles.active : ""}
                  onClick={() => handleCategoryClick(index, item === "See all" ? "See all" : item.category)}
                >
                  {typeof item === "string" ? (
                    <Link to={`/category/${name}`}>{item}</Link>
                  ) : (
                    <Link to={`/category/${name}/${item.category}`}>{item.category}</Link>
                  )}
                </li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Collectionheader;
