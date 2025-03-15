import React from 'react'
import Layout from '../../layout/Layout'
import styles from './woman.module.scss'
import Popularwoman from './components/woman_popular/Popularwoman'
import Womanjacket from './components/woman_jacket/Womanjacket'
import Womantshirts from './components/woman_tshirt/Womantshirts'
const Woman = () => {
  return (
    <Layout>
        <Popularwoman />
        <div className={styles.row}>
            <Womanjacket />
            <Womantshirts />
        </div>
    </Layout>
  )
}

export default Woman