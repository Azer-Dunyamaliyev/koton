import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  colors: {
    type: [String],  // Favori renkler için bir dizi
    default: [],     // Başlangıçta boş olabilir
  },
  selectedColor: {
    type: String,
    required: function() {
      return this.productId && this.productId.variants && this.productId.variants.length > 1;
    },
  },
  images: {
    type: [String],  // Görselleri array olarak saklayacağız
    required: true,  // Görsellerin olması zorunlu
  },
},{ timestamps: true });

const wishListModel = mongoose.model('wishlist',wishlistSchema)

export default wishListModel
