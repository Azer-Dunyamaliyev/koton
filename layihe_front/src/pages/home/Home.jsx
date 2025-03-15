import React from 'react'
import Layout from '../../layout/Layout'
import Main from './components/main/Main'
import Info from './components/info/Info'

const Home = () => {
  return (
    <Layout>
        <Main />
        <Info />
    </Layout>
  )
}

export default Home