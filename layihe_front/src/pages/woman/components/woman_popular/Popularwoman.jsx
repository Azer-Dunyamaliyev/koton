import React from 'react'
import styles from './popularwoman.module.scss'
import { useNavigate } from 'react-router-dom'
import popular from '../../../../assets/images/womanpopular.png'
import popular2 from '../../../../assets/images/new popularwoman (1).png'
const Popularwoman = () => {
    const navigate = useNavigate()
  return (
    <div className={styles.popular} onClick={() => navigate("/category/woman")}>
      <picture>
        <img src={popular} alt="thsirt" />
      </picture>
      <picture>
        <img src={popular2} alt="thsirt" />
      </picture>
      <button onClick={() => navigate("/category/woman")}>Collection</button>
    </div>
  )
}

export default Popularwoman