import React from "react";
import Header from "../../components/collection/collection_header/Collectionheader";
import Footer from "../../components/collection/collection_footer/Collectionfooter";
const Collectionlayout = ({ children,disabledLayout }) => {
  if(disabledLayout) return <>{children}</>
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Collectionlayout;
