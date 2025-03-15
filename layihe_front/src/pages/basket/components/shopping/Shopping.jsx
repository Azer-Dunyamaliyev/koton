import React, { useEffect } from "react";
import styles from "./shopping.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSuccesOrderThunk,
  getUserOrdersThunk,
  successOrderThunk,
  updateOrderStatusThunk,
} from "../../../../redux/reducers/ordersSlice";
import { useNavigate } from "react-router-dom";

const Shopping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const userId = "USER_ID";

  const totalPrice = orders.reduce((total, order) => {
    const orderTotal = order.orders.reduce((orderSum, item) => {
      return orderSum + item.totalPrice;
    }, 0);

    return total + orderTotal;
  }, 0);

  const deliveryFee = totalPrice < 1000 ? totalPrice * 0.1 : 0;
  const totalWithDelivery = totalPrice + deliveryFee;

  const handleBuy = async () => {
    const orderData = {
      userId,
      totalPrice,
      products: orders.flatMap((order) =>
        order.orders.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          totalPrice: totalWithDelivery,
          price: item.price,
        }))
      ),
      deliveryFee,
      totalWithDelivery,
    };

    try {
      const response = await dispatch(successOrderThunk({ orderData }));

      if (response.meta.requestStatus === "fulfilled") {
        const orderId = response.payload.order._id;
        navigate(`/checkout/${orderId}`);

        setTimeout(() => {
          dispatch(deleteSuccesOrderThunk({ orderId }));
        }, 3600000);
      }
    } catch (error) {
      console.error("Sipariş kaydedilemedi:", error);
    }
  };

  useEffect(() => {
    dispatch(getUserOrdersThunk(userId));
  }, [dispatch, userId]);

  return (
    <div className={styles.shopping}>
      <div className={styles.texts}>
        <div className={styles.text}>
          <p>
            Subtotal: <span>{totalPrice}$</span>
          </p>
          <p>
            Delivery:{" "}
            <span>
              {deliveryFee > 0 ? `${deliveryFee.toFixed(2)}$` : "Free"}
            </span>
          </p>
          <div>
            <p>
              Total
              <span>{`${totalWithDelivery.toFixed(2)}$`}</span>
            </p>
            <h6>Taxes included</h6>
          </div>
          {orders.length > 0 && <button onClick={handleBuy}>Buy</button>}
        </div>
        <div className={styles.lists}>
          <p>
            <span>
              <svg
                width="24"
                height="24"
                aria-hidden="true"
                className="Icon_icon-content-1__kPDLF AdditionalInfo_icon__9Gliw"
                xmlns="http://www.w3.org/2000/svg"
                xml="preserve"
                viewBox="0 0 24 24"
              >
                <path d="m9 19.707-5.854-5.853.708-.708L9 18.293 20.146 7.146l.708.708z"></path>
              </svg>
            </span>
            Free shipping for purchases over 1000.00$
          </p>
          <p>
            <span>
              <svg
                width="24"
                height="24"
                aria-hidden="true"
                className="Icon_icon-content-1__kPDLF AdditionalInfo_icon__9Gliw"
                xmlns="http://www.w3.org/2000/svg"
                xml="preserve"
                viewBox="0 0 24 24"
              >
                <path d="m9 19.707-5.854-5.853.708-.708L9 18.293 20.146 7.146l.708.708z"></path>
              </svg>
            </span>
            Free returns within 30 days
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shopping;
