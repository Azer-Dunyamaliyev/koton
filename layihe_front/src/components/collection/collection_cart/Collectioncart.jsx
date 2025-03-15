import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavoriteThunk,
  deleteFavoriteThunk,
  wishlistStatus,
} from "../../../redux/reducers/wishlistSlice";
import styles from "./collectioncart.module.scss";
import { useParams } from "react-router-dom";

const Collectioncart = ({ item, handleDetail }) => {
  const dispatch = useDispatch();
  const { status, loading, favorites } = useSelector(
    (state) => state.favorites
  );
  const [selectedColor, setSelectedColor] = useState(
    item.variants && item.variants.length > 1 ? item.defaultColor : ""
  );
  const [localFavorites, setLocalFavorites] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const colorFavorites = {};

    const updateFavorites = async () => {
      if (token) {
        for (let variant of item.variants) {
          try {
            const result = await dispatch(
              wishlistStatus({
                productId: item._id,
                selectedColor: variant.color,
              })
            ).unwrap();
            colorFavorites[variant.color] = result || false;
          } catch (error) {
            console.error("Wishlist status fetch error:", error);
          }
        }
        setLocalFavorites(colorFavorites);
      } else {
        const storedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        item.variants.forEach((variant) => {
          const key = `${item._id}-${variant.color}`;
          colorFavorites[variant.color] = storedFavorites.some(
            (fav) => fav.key === key
          );
        });
        setLocalFavorites(colorFavorites);
      }
    };

    updateFavorites();
  }, [item._id, item.variants, dispatch]);

  const handleVariantChange = (color) => {
    if (!color) return;
    setSelectedColor(color);
    const selectedVariant = item.variants.find(
      (variant) => variant.color === color
    );
    if (selectedVariant) {
      setSelectedImage(selectedVariant.images[0]);
      setHoverImage(selectedVariant.images[1] || selectedVariant.images[0]);
    }
  };

  const handleFavoriteToggle = async (color) => {
    const selectedColorToSend = color || item.defaultColor;
    const productData = {
      productId: item._id,
      selectedColor: selectedColorToSend,
      images: item.images,
      price: item.price,
      description: item.description,
      imagesLocal:
        item.images && item.images.length > 0 ? item.images : item.variants,
      defaultColor: item.defaultColor ? item.defaultColor : "",
    };

    const token = localStorage.getItem("token");
    const key = `${item._id}-${selectedColorToSend}`;

    if (token) {
      const isFav = localFavorites[color];
      if (isFav) {
        await dispatch(deleteFavoriteThunk(productData));
      } else {
        await dispatch(addFavoriteThunk(productData));
      }
      setLocalFavorites((prev) => ({ ...prev, [color]: !isFav }));
    } else {
      let favoritesList = JSON.parse(localStorage.getItem("favorites")) || [];
      const existingIndex = favoritesList.findIndex((fav) => fav.key === key);

      if (existingIndex !== -1) {
        favoritesList.splice(existingIndex, 1);
      } else {
        favoritesList.push({ ...productData, key: key });
      }
      setLocalFavorites((prev) => ({ ...prev, [color]: existingIndex === -1 }));
      localStorage.setItem("favorites", JSON.stringify(favoritesList));
    }
  };

  const { name, category } = useParams();
  const defaultVariant = item.variants.find(
    (variant) => variant.color === item.defaultColor
  );
  const initialImages = defaultVariant ? defaultVariant.images : item.images;
  const [selectedImage, setSelectedImage] = useState(initialImages[0]);
  const [hoverImage, setHoverImage] = useState(
    initialImages[1] || initialImages[0]
  );
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setSelectedImage(initialImages[0]);
    setHoverImage(initialImages[1] || initialImages[0]);
  }, [category, name, item.category, item.name, item.images, defaultVariant]);

  const handleImageClick = () => {
    handleDetail(selectedColor);
  };

  return (
    <div
      className={styles.cart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.images} onClick={handleImageClick}>
        <img src={selectedImage} alt="Selected" className={styles.mainImage} />
        <img src={hoverImage} alt="Hover Image" className={styles.hoverImage} />
      </div>

      <div className={styles.texts}>
        <h5>{item.description}</h5>
        <h6>{item.price}.00 $</h6>
      </div>

      {item.variants.length > 0 && (
        <div className={styles.variantInfo}>
          {!isHovered ? (
            <span>{item.variants.length} colors</span>
          ) : (
            <div className={styles.variantSelectors}>
              {item.variants.map((variant, index) => (
                <div
                  key={index}
                  className={styles.variantCircle}
                  style={{ backgroundColor: variant.color }}
                  onClick={() => handleVariantChange(variant.color)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <button
        className={styles.favori}
        onClick={() => handleFavoriteToggle(selectedColor)}
      >
        {localFavorites[selectedColor] ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#e04f4f">
            <path d="M19.0711 13.1421L13.4142 18.799C12.6332 19.58 11.3668 19.58 10.5858 18.799L4.92894 13.1421C2.97632 11.1895 2.97632 8.02369 4.92894 6.07106C6.88157 4.11844 10.0474 4.11844 12 6.07106C13.9526 4.11844 17.1185 4.11844 19.0711 6.07106C21.0237 8.02369 21.0237 11.1895 19.0711 13.1421Z" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black">
            <path d="M19.0711 13.1421L13.4142 18.799C12.6332 19.58 11.3668 19.58 10.5858 18.799L4.92894 13.1421C2.97632 11.1895 2.97632 8.02369 4.92894 6.07106C6.88157 4.11844 10.0474 4.11844 12 6.07106C13.9526 4.11844 17.1185 4.11844 19.0711 6.07106C21.0237 8.02369 21.0237 11.1895 19.0711 13.1421Z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Collectioncart;
