import React, { useState, useEffect, useRef } from "react";
import styles from "./detailcart.module.scss";
import ImageZoom from "react-image-zooom";

const DetailCart = ({ data, selectedImage, setSelectedImage, selectedColor }) => {
  
  const images =
    data?.variants?.length > 0
      ? data?.variants.find((v) => v.color === selectedColor)?.images || []
      : data?.images || [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const imageRef = useRef(null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]); 
      setSelectedIndex(0);
    }
  }, [selectedColor, images]);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    setSelectedImage(images[index]);
  };

  if (!selectedImage) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.detail}>
      <div className={styles.content}>
        <div className={styles.cart_detail}>
          {images.length > 0 ? (
            <div className={styles.cart}>
              <div className={styles.images_col}>
                <div className={styles.images}>
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`thumb-${index}`}
                      onClick={() => handleImageClick(index)}
                      className={`${styles.imageVariant} ${
                        selectedIndex === index ? styles.active : ""
                      }`}
                    />
                  ))}
                </div>
                <div className={styles.main_images}>
                  <div className={styles.zoomContainer} ref={imageRef}>
                    <ImageZoom
                      src={selectedImage}
                      zoomScale={2}
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No images available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailCart;
