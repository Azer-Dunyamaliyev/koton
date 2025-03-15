import React from 'react'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'

const Layout = ({children,showFooter = true}) => {
  return (
    <div>
        <Header />
        <main>
            {children}
        </main>
        {showFooter && <Footer />}
    </div>
  )
}

export default Layout