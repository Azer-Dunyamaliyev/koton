import React, { useEffect } from "react";
import styles from "./collectionfooter.module.scss";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryThunk } from "../../../redux/reducers/productsSlice";
const Collectionfooter = () => {
  const { name,category } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (name) {
      dispatch(getCategoryThunk({ name }));
    }
  }, [dispatch, name,category]);
  return (
    <div className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <ul>
            <li>
              <Link to={`/${name}`} style={{ textTransform: "capitalize" }}>
                {error ? "" : name}
              </Link>
              <span>/</span>
            </li>
            <li>
              <Link to={`/category/${name}`}>{error ? "" : "Collection"}</Link>
              <span>/</span>
            </li>
            <li>
              <p>
                {error
                  ? ""
                  : category
                  ? `${
                      products.filter((item) => item.category === category)
                        .length
                    } items`
                  : `${products.length} items`}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Collectionfooter;
