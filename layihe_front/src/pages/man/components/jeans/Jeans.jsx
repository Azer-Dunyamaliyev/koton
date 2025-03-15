import React from "react";
import styles from "./jeans.module.scss";
import jeans from "../../../../assets/images/jeans_man.png";
import jeans2 from "../../../../assets/images/jeans_man2.png";
import { useNavigate } from "react-router-dom";
const Jeans = () => {
  const navigate = useNavigate()
  return (
    <div className={styles.jeans} onClick={() => navigate("/category/man/jeans")}>
      <picture>
        <img src={jeans} alt="jeans" />
      </picture>
      <picture>
        <img src={jeans2} alt="jeans2" />
      </picture>
      <button onClick={() => navigate("/category/man/jeans")}>Jeans</button>
    </div>
  );
};

export default Jeans;
