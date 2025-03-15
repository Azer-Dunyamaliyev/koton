import React, { useState, useEffect } from "react";
import styles from "./basketcart.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrdersThunk } from "../../../../redux/reducers/ordersSlice";
import {
  addFavoriteThunk,
  deleteFavoriteThunk,
  wishlistStatus,
} from "../../../../redux/reducers/wishlistSlice";
import { deleteOrderThunk } from "../../../../redux/reducers/ordersSlice"; 

const BasketCart = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { status } = useSelector((state) => state.favorites);
  const userId = "USER_ID";  // Buraya gerçek userId'yi yerleştirin
  const [imageData, setImageData] = useState({});
  const [localFavorites, setLocalFavorites] = useState({});

  useEffect(() => {
    dispatch(getUserOrdersThunk(userId));
  }, [dispatch]);

  useEffect(() => {
    if (orders?.length) {
      orders.forEach((order) => {
        order.orders.forEach((item) => {
          handleImageSelection(item);
          dispatch(
            wishlistStatus({
              productId: item.productId._id,
              selectedColor: item.selectedColor,
            })
          );
        });
      });
    }
  }, [orders, dispatch]);

  const handleImageSelection = (item) => {
    const selectedVariant = item.productId.variants?.find(
      (variant) => variant.color === item.selectedColor
    );

    setImageData((prev) => ({
      ...prev,
      [item._id]: {
        selectedImage: selectedVariant?.images[0] || item.productId.images[0] || "default.jpg",
        hoverImage: selectedVariant?.images[1] || selectedVariant?.images[0] || item.productId.images[1] || item.productId.images[0] || "default.jpg",
        currentImage: selectedVariant?.images[0] || item.productId.images[0] || "default.jpg",
      },
    }));
  };

  const handleMouseEnter = (itemId) => {
    setImageData((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], currentImage: prev[itemId]?.hoverImage },
    }));
  };

  const handleMouseLeave = (itemId) => {
    setImageData((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], currentImage: prev[itemId]?.selectedImage },
    }));
  };

  const handleFavoriteToggle = (item) => {
    const key = `${item.productId._id}-${item.selectedColor}`;
    const isFavorite = localFavorites[key] ?? status[key];

    setLocalFavorites((prev) => {
      const updatedFavorites = { ...prev };
      if (isFavorite) {
        delete updatedFavorites[key];
      } else {
        updatedFavorites[key] = true;
      }
      return updatedFavorites;
    });

    if (isFavorite) {
      dispatch(deleteFavoriteThunk({ productId: item.productId._id, selectedColor: item.selectedColor }));
    } else {
      dispatch(addFavoriteThunk({ productId: item.productId._id, selectedColor: item.selectedColor }));
    }
  };

  const handleRemoveItem = (orderId, itemId) => {
    dispatch(deleteOrderThunk(itemId))  
      .then(() => {
        dispatch(getUserOrdersThunk(userId));
      })
      .catch((error) => {
        console.error("Ürün silinirken hata oluştu:", error);
      });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.carts}>
      {orders?.length ? (
        orders.map((order) => (
          <div key={order._id} className={styles.order}>
            {order.orders?.length ? (
              order.orders.map((item) => {
                const key = `${item.productId._id}-${item.selectedColor}`;
                const isFavorite = localFavorites[key] ?? status[key];

                return (
                  <div key={item._id} className={styles.cart}>
                    <div
                      className={styles.image}
                      onMouseEnter={() => handleMouseEnter(item._id)}
                      onMouseLeave={() => handleMouseLeave(item._id)}
                    >
                      <img
                        src={imageData[item._id]?.currentImage}
                        alt={item.productId.description}
                        className={styles.mainImage}
                      />
                    </div>
                    <div className={styles.texts}>
                      <p>{item.productId.description}</p>
                      <p>
                        Price: <span>{item.price}.00$</span>
                      </p>
                      <div className={styles.detail}>
                        <p>
                          Quantity: <span>{item.quantity}</span>
                        </p>
                        <p>
                          Size: <span>{item.selectedSize}</span>
                        </p>
                        <p>{item.selectedColor}</p>
                      </div>
                    </div>
                    <button className={styles.favori} onClick={() => handleFavoriteToggle(item)}>
                      {isFavorite ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#e04f4f">
                          <path d="M19.0711 13.1421L13.4142 18.799C12.6332 19.58 11.3668 19.58 10.5858 18.799L4.92894 13.1421C2.97632 11.1895 2.97632 8.02369 4.92894 6.07106C6.88157 4.11844 10.0474 4.11844 12 6.07106C13.9526 4.11844 17.1185 4.11844 19.0711 6.07106C21.0237 8.02369 21.0237 11.1895 19.0711 13.1421Z" />
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black">
                          <path d="M19.0711 13.1421L13.4142 18.799C12.6332 19.58 11.3668 19.58 10.5858 18.799L4.92894 13.1421C2.97632 11.1895 2.97632 8.02369 4.92894 6.07106C6.88157 4.11844 10.0474 4.11844 12 6.07106C13.9526 4.11844 17.1185 4.11844 19.0711 6.07106C21.0237 8.02369 21.0237 11.1895 19.0711 13.1421Z" />
                        </svg>
                      )}
                    </button>
                    <button className={styles.remove} onClick={() => handleRemoveItem(order._id, item._id)}>
                      X
                    </button>
                  </div>
                );
              })
            ) : (
              <p></p>
            )}
          </div>
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default BasketCart;
