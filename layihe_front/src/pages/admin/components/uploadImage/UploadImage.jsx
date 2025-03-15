import React, { useState } from "react";
import styles from "./uploadimage.module.scss";
import axios from "axios";

const UploadImage = ({ setImageUrls }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    const previewImages = fileArray.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previewImages]);
    if (!selectedImage && previewImages.length > 0) setSelectedImage(previewImages[0]);

    const uploadedImages = [];
    for (const file of fileArray) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const { data } = await axios.post("http://localhost:5500/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Backend’den Gelen Cevap:", data);
        uploadedImages.push(data.fileUrl);
      } catch (error) {
        console.error("Dosya yükleme hatası:", error);
      }
    }

    setImages((prev) => [
      ...prev.filter((img) => !previewImages.includes(img)),
      ...uploadedImages,
    ]);
    setImageUrls((prev) => [...prev, ...uploadedImages]);
    if (!selectedImage && uploadedImages.length > 0) setSelectedImage(uploadedImages[0]);
  };

  const handleImageUpload = (event) => {
    handleFiles(event.target.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className={styles.uploadContainer}>
      <div
        className={styles.mainImage}
        style={{ height: images.length > 0 ? "auto" : "400px" }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {selectedImage ? (
          <img src={selectedImage} alt="Selected" />
        ) : (
          <label className={styles.uploadMain}>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
            <span>Upload or Drag & Drop Image</span>
          </label>
        )}
      </div>

      <div
        className={styles.thumbnailGallery}
        style={{ height: images.length > 0 ? "auto" : "80px" }}
        onDragOver={handleDragOver}
        onDrop={handleDrop} 
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            className={`${styles.thumbnail} ${selectedImage === img ? styles.selected : ""}`}
            onClick={() => setSelectedImage(img)}
            alt={`Thumbnail ${index + 1}`}
          />
        ))}

        <label className={styles.uploadThumbnail}>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
          <span>+</span>
        </label>
      </div>
    </div>
  );
};

export default UploadImage;
