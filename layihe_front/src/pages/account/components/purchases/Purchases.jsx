import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSuccessOrdersThunk } from "../../../../redux/reducers/ordersSlice";
import Layout from "../../../../layout/Layout";
import styles from "./purchases.module.scss";

const Purchases = () => {
  const dispatch = useDispatch();
  const { successOrders, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(getAllSuccessOrdersThunk());
  }, [dispatch]);

  // Ürün resmi belirleme fonksiyonu
  const getProductImage = (product, selectedColor) => {
    if (product.variants.length === 0) {
      return product.images.length > 0
        ? product.images[0]
        : "default-image.jpg";
    } else if (product.images.length === 0) {
      const matchedVariant = product.variants.find(
        (variant) => variant.color === selectedColor
      );
      return matchedVariant ? matchedVariant.images[0] : "default-image.jpg";
    } else {
      return selectedColor ? product.images[selectedColor] : product.images[0];
    }
  };

  return (
    <Layout>
      <div className={styles.purchases}>
        <div className="container">
          <div className={styles.content}>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : successOrders.length === 0 ? (
              <p>No purchases found.</p>
            ) : (
              <div className={styles.tableWrapper}>
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Color</th>
                      <th>Size</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {successOrders.map((order) =>
                      order.products.map((item) => (
                        <tr key={item.productId._id}>
                          <td>
                            <img
                              src={getProductImage(
                                item.productId,
                                item.selectedColor
                              )}
                              alt={item.productId.name}
                              width={50}
                            />
                          </td>
                          <td>{item.productId.name}</td>
                          <td>${item.price}</td>
                          <td>{item.selectedColor || "N/A"}</td>
                          <td>{item.selectedSize}</td>
                          <td>{item.quantity}</td>
                          <td>{order.status}</td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Purchases;
