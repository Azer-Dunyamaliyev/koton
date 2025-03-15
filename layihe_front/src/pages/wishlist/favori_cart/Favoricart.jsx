import React, { useState } from "react";
import styles from "./favoricart.module.scss";

const Favoricart = ({ item, handleDeleteFavorite}) => {
  const { productId, selectedColor } = item;
  const [isHovered, setIsHovered] = useState(false);
  const token = localStorage.getItem("token");

  if (!productId) return null;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const getImage = (variant) => {
    if (variant && variant.images) {
      return variant.images[0];
    } else if (productId.images) {
      return productId.images[0];
    }
    return "";
  };

  const getHoverImage = (variant) => {
    if (variant && variant.images) {
      return variant.images[1];
    } else if (productId.images) {
      return productId.images[1];
    }
    return "";
  };

  const selectedVariant = productId.variants
    ? productId.variants.find((variant) => variant.color === selectedColor)
    : null;

  const selectedImage = getImage(selectedVariant);
  const hoverImage = getHoverImage(selectedVariant);
  return (
    <div
      className={styles.cart}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {token ? (
        <img
          src={isHovered ? hoverImage : selectedImage}
          alt={productId.name}
          width="100"
        />
      ) : (
        <img
          src={(() => {
            if (selectedColor) {
              // Seçili renk varsa, o rengin ilk görselini al
              const selectedVariant = item.imagesLocal.find(
                (variant) => variant.color === selectedColor
              );
              return selectedVariant?.images[0] || item.images[0];
            }

            // Eğer hover aktifse, ikinci görseli al; değilse ilk görseli al
            return isHovered
              ? item.images[1] || item.images[0]
              : item.images[0];
          })()}
          alt={item.name}
          width="100"
        />
      )}
      <div className={styles.texts}>
        <h5>{token ? productId.description : item.description}</h5>
        <h6>{token ? productId.price : item.price}.00$</h6>
      </div>
      <button className={styles.favori} onClick={handleDeleteFavorite}>
        <svg
          role="presentation"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M19.0711 13.1421L13.4142 18.799C12.6332 19.58 11.3668 19.58 10.5858 18.799L4.92894 13.1421C2.97632 11.1895 2.97632 8.02369 4.92894 6.07106C6.88157 4.11844 10.0474 4.11844 12 6.07106C13.9526 4.11844 17.1185 4.11844 19.0711 6.07106C21.0237 8.02369 21.0237 11.1895 19.0711 13.1421Z"
            fill="#e04f4f"
            stroke="#e04f4f"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Favoricart;
