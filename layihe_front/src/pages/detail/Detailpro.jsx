import React, { useState, useEffect } from "react";
import Layout from "../../layout/Layout";
import DetailCart from "./components/detail-products/DetailCart";
import DetailCollection from "./components/detail_collection/DetailCollection";
import DetailInfo from "./components/detail_info/DetailInfo";
import styles from "./detailpro.module.scss";
import { useLocation } from "react-router-dom";

const Detailpro = () => {
  const { state: data } = useLocation();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  
  useEffect(() => {
    if (data) {
      const initialColor = data.selectedColor || (data.variants?.length > 0 ? data.variants[0].color : "");
      setSelectedColor(initialColor);

      const initialImage = data.variants?.length > 0 && initialColor
        ? data.variants.find((variant) => variant.color === initialColor)?.images[0]
        : data?.images?.[0] || "";

      setSelectedImage(initialImage);
    }
  }, [data]); 

  useEffect(() => {
    if (selectedColor && data?.variants?.length > 0) {
      const selectedVariant = data.variants.find(
        (variant) => variant.color === selectedColor
      );
      setSelectedImage(selectedVariant ? selectedVariant.images[0] : data?.images?.[0]);
    }
  }, [selectedColor, data]);
  return (
    <Layout>
      <div className={styles.detail}>
        <div className="container">
          <div className={styles.content}>
            <DetailCart
              data={data}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
            <DetailInfo
              data={data}
              setSelectedImage={setSelectedImage}
              setSelectedColor={setSelectedColor}
              selectedColor={selectedColor}
            />
          </div>
        </div>
      </div>
      <DetailCollection />
    </Layout>
  );
};

export default Detailpro;
