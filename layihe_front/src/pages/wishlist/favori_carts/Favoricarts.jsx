import React, { useEffect, useState } from "react";
import styles from "./favoricarts.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { deleteFavoriteThunk, getWishList } from "../../../redux/reducers/wishlistSlice";
import Favoricart from "../favori_cart/Favoricart";

const Favoricarts = () => {
  const dispatch = useDispatch();
  const { favorites, loading } = useSelector((state) => state.favorites);
  const [localFavorites, setLocalFavorites] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getWishList());
    } else {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setLocalFavorites(storedFavorites);
    }
  }, [dispatch]);

  const handleDeleteFavorite = (productId) => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(deleteFavoriteThunk({ userId: "USER_ID", productId }))
        .then(() => console.log("Silme başarılı!"))
        .catch((err) => console.error("Silme hatası:", err));
    } else {
      console.log("LocalStorage'dan siliniyor...");
      const updatedFavorites = localFavorites.filter(
        (fav) => fav.productId !== productId
      );
      setLocalFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const displayFavorites = localStorage.getItem("token") ? favorites : localFavorites;

  return (
    <div className={styles.favori}>
      <div className="container">
        <div className={styles.content}>
          {loading && <p>Loading...</p>}
          {errorMessage && <p>{errorMessage}</p>}
          {!loading &&
            !errorMessage &&
            (displayFavorites.length > 0 ? (
              <div className={styles.carts}>
                {displayFavorites.map((item, index) => (
                  <Favoricart
                    key={index}
                    item={item}
                    handleDeleteFavorite={() => handleDeleteFavorite(item.productId._id || item.productId)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.texts}>
                <h2>Your wishlist is empty</h2>
                <p>
                  <span>
                    <svg width="24" height="24" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="m9 19.707-5.854-5.853.708-.708L9 18.293 20.146 7.146l.708.708z"></path>
                    </svg>
                  </span>
                  Use the hearts to add or remove favourites
                </p>
                <p>
                  <span>
                    <svg width="24" height="24" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="m9 19.707-5.854-5.853.708-.708L9 18.293 20.146 7.146l.708.708z"></path>
                    </svg>
                  </span>
                  Access your wishlist from any device
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Favoricarts;
