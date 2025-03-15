import React from 'react'
import styles from './womantshirts.module.scss'
import { useNavigate } from 'react-router-dom';
import tshirt from '../../../../assets/images/womantshirts.webp'
import tshirt2 from '../../../../assets/images/newwomantshirts.webp'
const Womantshirts = () => {
    const navigate = useNavigate()
    return (
      <div className={styles.tshirt} onClick={() => navigate("/category/woman/t-shirt")}>
        <picture>
          <img src={tshirt} alt="jeans" />
        </picture>
        <picture>
          <img src={tshirt2} alt="jeans2" />
        </picture>
        <button onClick={() => navigate("/category/woman/t-shirt")}>T-shirts</button>
      </div>
    );
}

export default Womantshirts