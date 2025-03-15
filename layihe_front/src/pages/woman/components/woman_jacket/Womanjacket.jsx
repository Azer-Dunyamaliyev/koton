import React from 'react'
import styles from './womanjacket.module.scss'
import { useNavigate } from 'react-router-dom'
import jacket from '../../../../assets/images/womanjacket.webp'
import jacket2 from '../../../../assets/images/newwomanjacket.webp'
const Womanjacket = () => {
    const navigate = useNavigate()
  return (
    <div className={styles.jacket} onClick={() => navigate('/category/woman/jacket')}>
      <picture>
        <img src={jacket} alt="jacket" />
      </picture>
      <picture>
        <img src={jacket2} alt="jacket" />
      </picture>
      <button onClick={() => navigate('/category/woman/jacket')}>Jacket</button>
    </div>
  )
}

export default Womanjacket