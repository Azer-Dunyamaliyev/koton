import React from "react";
import styles from "./jacket.module.scss";
import jacket from "../../../../assets/images/jackets_man.webp";
import { useNavigate } from "react-router-dom";
const Jacket = () => {
  const navigate = useNavigate()
  return (
    <div className={styles.jacket} onClick={() => navigate('/category/man/jacket')}>
      <picture>
        <img src={jacket} alt="jacket" />
      </picture>
      <button onClick={() => navigate('/category/man/jacket')}>Jacket</button>
    </div>
  );
};

export default Jacket;
