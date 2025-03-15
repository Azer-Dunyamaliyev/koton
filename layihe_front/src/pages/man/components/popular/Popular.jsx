import React from "react";
import styles from "./popular.module.scss";
import thsirt from "../../../../assets/images/popular.webp";
import new_in from '../../../../assets/images/newin-app.png'
import { useNavigate } from "react-router-dom";
const Popular = () => {
  const navigate = useNavigate()
  return (
    <div className={styles.popular} onClick={() => navigate("/category/man")}>
      <picture>
        <img src={thsirt} alt="thsirt" />
      </picture>
      <picture>
        <img src={new_in} alt="thsirt" />
      </picture>
      <button onClick={() => navigate("/category/man")}>Collection</button>
    </div>
  );
};

export default Popular;
