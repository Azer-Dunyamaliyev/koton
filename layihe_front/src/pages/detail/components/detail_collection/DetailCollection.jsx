import React from "react";
import styles from "./detailcollection.module.scss";
import Collectioncarts from "../../../../components/collection/collection_carts/Collectioncarts";
import Collectionlayout from "../../../../layout/collection_layout/Collectionlayout";
const DetailCollection = () => {
  return (
    <div className={styles.collection}>
      <div className="container">
        <h3>You might like this</h3>
      </div>
      <Collectionlayout disabledLayout={true}>
        <Collectioncarts padd = {"20px 0 0"} />
      </Collectionlayout>
    </div>
  );
};

export default DetailCollection;
