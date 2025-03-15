import React, { useState, useEffect } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import styles from "./checkoutheader.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAllOrdersThunk,
  getOrderByIdThunk,
  postPaymentThunk,
  updateOrderStatusThunk,
} from "../../../redux/reducers/ordersSlice";
import { updateUserInfoThunk } from "../../../redux/reducers/userSlice";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const steps = ["Details", "Delivery", "Payment"];

const CheckoutHeader = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const [activeStep, setActiveStep] = useState(1);
  const [isFinish, setIsFinish] = useState(false);
  const { me, loading } = useSelector((state) => state.users);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderByIdThunk(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment_intent")) {
      window.location.href = "http://localhost:3000/success"; 
    }
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("First Name is required"),
    surname: Yup.string().required("Last Name is required"),
    address: Yup.string().required("Address is required"),
    zip: Yup.string().required("ZIP/Postal code is required"),
    country: Yup.string().required("Country is required"),
    town: Yup.string().required("Town is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: me?.name || "",
      surname: me?.surname || "",
      address: me?.address || "",
      zip: me?.zip || "",
      country: me?.country || "",
      town: me?.town || "",
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("Payment Error:", error);
      return;
    }

    dispatch(
      postPaymentThunk({
        paymentMethodId: paymentMethod.id,
        orderId: orderId,
      })
    );
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleStep = (step) => () => {
    if (step > activeStep) {
      setActiveStep(step);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <div className={styles.delivery}>
            <form onSubmit={formik.handleSubmit}>
              <div className={styles.user}>
                <h2>Personal details</h2>
                <div className={styles.user_inputs}>
                  <div className={styles.input}>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="First Name *"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className={styles.error}>{formik.errors.name}</div>
                    )}
                  </div>
                  <div className={styles.input}>
                    <input
                      id="surname"
                      name="surname"
                      type="text"
                      placeholder="Last Name *"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.surname}
                    />
                    {formik.touched.surname && formik.errors.surname && (
                      <div className={styles.error}>
                        {formik.errors.surname}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.user_details}>
                <h2>Delivery details</h2>
                <div className={styles.details_inputs}>
                  <div className={styles.row}>
                    <div className={styles.input}>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Address *"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                      />
                      {formik.touched.address && formik.errors.address && (
                        <div className={styles.error}>
                          {formik.errors.address}
                        </div>
                      )}
                    </div>

                    <div className={styles.post}>
                      <div className={styles.input}>
                        <input
                          id="zip"
                          name="zip"
                          type="text"
                          placeholder="ZIP/Postal code *"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.zip}
                        />
                        {formik.touched.zip && formik.errors.zip && (
                          <div className={styles.error}>
                            {formik.errors.zip}
                          </div>
                        )}
                      </div>
                      <div className={styles.input}>
                        <input
                          id="country"
                          name="country"
                          type="text"
                          placeholder="Country *"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.country}
                        />
                        {formik.touched.country && formik.errors.country && (
                          <div className={styles.error}>
                            {formik.errors.country}
                          </div>
                        )}
                      </div>
                      <div className={styles.input}>
                        <input
                          id="town"
                          name="town"
                          type="text"
                          placeholder="Town *"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.town}
                        />
                        {formik.touched.town && formik.errors.town && (
                          <div className={styles.error}>
                            {formik.errors.town}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        );
      case 2:
        return (
          <div className={styles.payment}>
            <h2 style={{margin: "0 0 20px"}}>Details for card</h2>
            <CardElement
              className={styles.cardElement}
            />
          </div>
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  const handleFinish = async () => {
    if (formik.isValid && formik.dirty) {
      try {
        await handlePayment();
        await dispatch(updateOrderStatusThunk({ orderId, status: "Approved" }));
        await dispatch(updateUserInfoThunk(formik.values));
        await dispatch(deleteAllOrdersThunk());
      } catch (error) {
        console.error("İşlem sırasında bir hata oluştu:", error);
      }
    }
  };

  return (
    <div className={styles.checkoutHeader}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        onClick={handleStep}
        sx={{ width: "100%", backgroundColor: "transparent" }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className={styles.content}>{getStepContent(activeStep)}</div>

      <div className={styles.paragraph}>
        <p>
          By continuing, I confirm that I was able to read and understand the
          information on the use of my personal data, as explained in the
          Privacy Policy.
        </p>
      </div>

      <div className={styles.buttons}>
        {activeStep > 1 && (
          <button onClick={handleBack} className={styles.back}>
            Return
          </button>
        )}

        {activeStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className={styles.next}
            disabled={!(formik.isValid && formik.dirty)}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={() => {
              setIsFinish(true);
              handleFinish();
            }}
            className={styles.next}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckoutHeader;
