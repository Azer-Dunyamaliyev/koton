import React from 'react'
import Layout from '../../layout/Layout'
import Collectionlayout from '../../layout/collection_layout/Collectionlayout'
import Collectioncarts from './collection_carts/Collectioncarts'

const Collection = () => {
  return (
    <Layout>
        <Collectionlayout>
          <Collectioncarts />
        </Collectionlayout>
    </Layout>
  )
}

export default Collection