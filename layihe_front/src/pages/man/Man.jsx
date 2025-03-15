import React from 'react'
import Layout from '../../layout/Layout'
import Jacket from './components/jasckets/Jacket'
import Jeans from './components/jeans/Jeans'
import Popular from './components/popular/Popular'
const Man = () => {
  return (
    <Layout>
      <Popular />
      <Jacket />
      <Jeans />
    </Layout>
  )
}

export default Man