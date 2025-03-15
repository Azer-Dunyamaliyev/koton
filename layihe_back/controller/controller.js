import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import productsModel from "../models/productsModel.js";
import wishListModel from "../models/wishlistModel.js";
import ordersModel from "../models/ordersModel.js";
import mongoose from "mongoose";
import successOrderModel from "../models/successOrdersModel.js";
import Stripe from "stripe";
import subscribeModel from "../models/subscribeModel.js";


// GET
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json("Server xetasi");
  }
};

const meUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSuccessOrdersByUserId = async (req, res) => {
  try {
    const userId = req.user.userId

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await successOrderModel.find({ userId }).populate("products.productId");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// CATEGORY GORE
const getProducts = async (req, res) => {
  try {
    const { name, category, subcategory } = req.params;

    const filter = {};
    if (name) filter.name = name;
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    const products = await productsModel.find(filter).sort({ _id: -1 }); // Yeni eklenenler en önde olacak

    res.json(products);
  } catch (error) {
    console.error("Ürünleri getirme hatası:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productsModel.find(); 
    res.status(200).json(products); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const getAllNameProducts = async (req, res) => {
  try {
    const { name } = req.params;

    const filter = {};
    if (name) filter.name = name;

    const products = await productsModel.find(filter).sort({ _id: -1 });

    if (products.length === 0) {
      return res.status(404).json({ message: "Hiç ürün bulunamadı" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ALL FAVORI PRODUCTS
const getWishList = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Yetkilendirme hatası! Kullanıcı ID bulunamadı." });
    }

    const favorites = await wishListModel.find({ userId }).populate({
      path: "productId",
      model: productsModel,
    });

    const favoritesWithColor = favorites.map((favorite) => {
      const product = favorite.productId;

      const selectedColor = product.variants
        ? product.variants.find(
            (variant) => variant.color === favorite.selectedColor
          )
        : null;

      return {
        ...favorite.toObject(),
        selectedColor: selectedColor ? selectedColor.color : null,
      };
    });

    res.json(favoritesWithColor);
  } catch (error) {
    console.error("Favori Listesi Hatası:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const wishlistStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID or Product ID is missing" });
    }
    const isFavorite = await wishListModel.findOne({ userId, productId });
    return res.status(200).json({ isFavorite: !!isFavorite });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await ordersModel
      .find({ userId })
      .populate("orders.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Siparişler getirilemedi", error });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await ordersModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Sipariş getirilemedi", error });
  }
};

const getAllSuccessOrders = async (req, res) => {
  try {
    const orders = await successOrderModel
      .find()
      .populate("userId")
      .populate("products.productId");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Hata:", error); 
    res.status(500).json({ message: "Siparişler alınırken hata oluştu.", error });
  }
};


//POST

const userRegister = async (req, res) => {
  try {
    const { username, email, password, phone, countryCode, role = "user" } = req.body;

    let user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "This email is already registered!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni User yarat
    user = new userModel({
      username,
      email,
      password: hashedPassword,
      phone,
      countryCode,
      role
    });
    await user.save();

    // Başarıyla mesaj
    res.status(201).json({ success: true, message: "New user created!" });
  } catch (error) {
    console.error("Backend hata:", error);
    res.status(500).json({ success: false, message: "Server error.." });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // USER YOXLANISI
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Wrong information" });

    //PASSWORD YOXLANILMASI
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Wrong information" });

    //TOKEN YARATMAQ
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.." });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      description,
      defaultColor,
      variants = [],
      images = [],
      sizes = [],
      info,
    } = req.body;

    if (!name || !price || !category || !description) {
      return res
        .status(400)
        .json({ message: "Lütfen tüm zorunlu alanları doldurun!" });
    }

    if (variants.length === 0 && images.length === 0) {
      return res
        .status(400)
        .json({ message: "Varyant veya en az 1 görsel gereklidir!" });
    }

    if (variants.length > 0 && !defaultColor) {
      return res
        .status(400)
        .json({ message: "Varyantlı ürünlerde 'defaultColor' zorunludur!" });
    }

    const uploadedImages = req.files ? req.files.map(file => file.path) : [];
    const finalImages = uploadedImages.length > 0 ? uploadedImages : images;

    const newProduct = new productsModel({
      name,
      price: parseFloat(price),
      category,
      description,
      defaultColor: variants.length > 0 ? defaultColor : "",
      variants,
      images: finalImages,
      sizes,
      info,
    });

    await newProduct.save();

    res.status(201).json({ message: "Ürün başarıyla eklendi!", product: newProduct });
  } catch (error) {
    console.error("Ürün eklenirken hata:", error);
    res.status(500).json({ message: "Sunucu hatası, tekrar deneyin." });
  }
};


const addWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, selectedColor } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await productsModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.variants && product.variants.length > 1 && !selectedColor) {
      return res
        .status(400)
        .json({ message: "Selected color is required for variant products" });
    }

    let productImages = product.images;
    if (product.variants && selectedColor) {
      const selectedVariant = product.variants.find(
        (variant) => variant.color === selectedColor
      );
      if (selectedVariant) {
        productImages = selectedVariant.images;
      }
    }

    const existingFavorite = await wishListModel.findOne({
      userId,
      productId,
      selectedColor,
    });
    if (existingFavorite) {
      return res.status(400).json({
        message: "This product with the selected color is already in favorites",
      });
    }

    const newFavorite = new wishListModel({
      userId,
      productId,
      selectedColor,
      images: productImages,
    });

    const savedFavorite = await newFavorite.save();

    res.status(201).json(savedFavorite);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createOrder = async (req, res) => {
  const userId = req.user.userId;
  try {
    const { products } = req.body;

    if (!userId || !products || products.length === 0) {
      return res.status(400).json({ message: "Eksik sipariş bilgisi!" });
    }

    const userOrder = await ordersModel.findOne({ userId });

    const orderItems = products.map((product) => {
      const totalPrice = product.price * product.quantity;
      return {
        productId: product.productId,
        selectedColor: product.selectedColor || "",
        selectedSize: product.selectedSize || "",
        quantity: product.quantity,
        price: product.price,
        totalPrice: totalPrice,
        status: "Pending",
        createdAt: new Date(),
      };
    });

    if (!userOrder) {
      const newOrder = new ordersModel({
        userId,
        orders: orderItems,
      });

      const savedOrder = await newOrder.save();
      return res.status(201).json({
        message: "Sipariş başarıyla oluşturuldu",
        order: savedOrder,
      });
    } else {
      userOrder.orders.forEach((existingOrder) => {
        orderItems.forEach((newOrderItem) => {
          if (
            existingOrder.productId.toString() ===
              newOrderItem.productId.toString() &&
            existingOrder.selectedColor === newOrderItem.selectedColor &&
            existingOrder.selectedSize === newOrderItem.selectedSize
          ) {
            existingOrder.quantity += newOrderItem.quantity;
            existingOrder.totalPrice =
              existingOrder.price * existingOrder.quantity;
          }
        });
      });

      const newOrders = orderItems.filter((newOrderItem) => {
        return !userOrder.orders.some(
          (existingOrder) =>
            existingOrder.productId.toString() ===
              newOrderItem.productId.toString() &&
            existingOrder.selectedColor === newOrderItem.selectedColor &&
            existingOrder.selectedSize === newOrderItem.selectedSize
        );
      });

      userOrder.orders.push(...newOrders);

      const updatedOrder = await userOrder.save();

      res.status(201).json({
        message: "Sipariş başarıyla oluşturuldu",
        order: updatedOrder,
      });
    }
  } catch (error) {
    console.error("Sipariş oluşturulamadı:", error);
    res.status(500).json({ message: "Sipariş oluşturulamadı", error });
  }
};

const successOrders = async (req, res) => {
  const userId = req.user.userId;
  const { order } = req.body;
  console.log(req.body);

  try {
    const newOrder = new successOrderModel({
      userId: new mongoose.Types.ObjectId(userId),
      products: order.products.map((p) => ({
        ...p,
        productId: new mongoose.Types.ObjectId(p.productId),
      })),
      totalPrice: order.totalWithDelivery,
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong while placing the order.",
    });
  }
};

const postStripe = async (req, res) => {
  const userId = req.user.userId;
  const { paymentMethodId, orderId } = req.body;
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid orderId format" });
    }

    const order = await successOrderModel
      .findOne({ _id: orderId, userId })
      .lean(); 

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    if (!order.totalPrice) {
      return res
        .status(400)
        .json({ success: false, error: "totalPrice is missing in order" });
    }

    const amountInCents = Math.round(order.totalPrice * 100);
    console.log("Amount (Stripe için kuruş cinsinden):", amountInCents);

    if (amountInCents < 50) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Minimum amount must be at least 50 cents",
        });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      return_url: "http://localhost:3000/success",
    });

    res.json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const addSubscriber = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email gereklidir!" });
  }

  try {
    const existingSubscriber = await subscribeModel.findOne({ email });

    if (existingSubscriber) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı!" });
    }

    const newSubscriber = new subscribeModel({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "Başarıyla abone olundu!", email });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası!", error });
  }
};

//PUT

const updateUserName = async (req, res) => {
  const { username } = req.body;
  const userId = req.user.userId;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateName = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateSurName = async (req, res) => {
  const { surname } = req.body;
  const userId = req.user.userId;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { surname },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserAddress = async (req, res) => {
  const { address } = req.body;
  const userId = req.user.userId;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { address },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserTown = async (req, res) => {
  const { town } = req.body;
  const userId = req.user.userId;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { town },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateEmail = async (req, res) => {
  const { email, password } = req.body;
  const userId = req.user.userId;

  try {
    const user = await userModel.findById(userId);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        user.email = email;
        await user.save();

        res.status(200).json({ message: "Email updated successfully!" });
      } else {
        res.status(400).json({ message: "Incorrect password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  console.log("Received oldPassword:", oldPassword);
  console.log("Received newPassword:", newPassword);

  const userId = req.user.userId;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePhone = async (req, res) => {
  const { phone, countryCode } = req.body;
  const userId = req.user.userId;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { phone, countryCode },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Phone updated successfully!",
      phone: updatedUser.phone,
      countryCode: updatedUser.countryCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const {
      name,
      surname,
      address,
      country,
      town,
      // cardNumber,
      // holder,
      // month,
      // year,
      // cvv,
    } = req.body;
    const updateData = {
      name,
      surname,
      address,
      country,
      town,
    };

    // if (cardNumber && holder && month && year && cvv) {
    //   updateData.cards = [{ cardNumber, holder, month, year, cvv }];
    // }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Kullanıcı bilgileri güncellenirken bir hata oluştu" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await successOrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateProduct = async(req,res) => {
  const productId = req.params.id;
  const updatedProductData = req.body; 

  try {
    const updatedProduct = await productsModel.findByIdAndUpdate(productId, updatedProductData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating product" });
  }
}

const updateUserAdmin = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true, 
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateSuccesOrders = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await successOrderModel.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


//DELETE

const deleteUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUserAdmin = async (req, res) => {
  const { userId } = req.params;  

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Account deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const deleteWishListItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;
    const { selectedColor } = req.body;

    if (!selectedColor) {
      const deletedFavorite = await wishListModel.findOneAndDelete({
        userId,
        productId,
      });

      if (!deletedFavorite) {
        return res.status(404).json({ message: "Favori ürün bulunamadı!" });
      }

      return res.status(200).json({
        success: true,
        message: "Favori ürün başarıyla silindi!",
        productId,
      });
    }

    const updatedFavorite = await wishListModel.findOneAndUpdate(
      { userId, productId },
      { $pull: { colors: selectedColor } },
      { new: true }
    );

    console.log("Güncellenmiş favori: ", updatedFavorite);

    if (!updatedFavorite) {
      return res.status(404).json({ message: "Favori ürün bulunamadı!" });
    }

    if (updatedFavorite.colors.length === 0) {
      await wishListModel.findOneAndDelete({ userId, productId });
      console.log("Ürün tamamen silindi.");
    }

    return res.status(200).json({
      success: true,
      message: `${selectedColor} rengi favorilerden silindi!`,
      productId,
    });
  } catch (error) {
    console.error("Silme sırasında hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Geçersiz sipariş ID" });
    }

    const updatedOrder = await ordersModel.findOneAndUpdate(
      { "orders._id": orderId },
      { $pull: { orders: { _id: orderId } } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    res
      .status(200)
      .json({ message: "Sipariş başarıyla silindi", updatedOrder });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "Sipariş silinemedi", error });
  }
};

const deleteAllOrders = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const deletedOrders = await ordersModel.deleteMany({ userId });

    if (deletedOrders.deletedCount === 0) {
      console.log("Silinecek sipariş bulunamadı");
      return res.status(404).json({ message: "Silinecek sipariş bulunamadı" });
    }

    console.log("Tüm siparişler silindi");
    res.status(200).json({ message: "Tüm siparişler silindi" });
  } catch (error) {
    console.error("Silme işlemi hatası:", error);
    res.status(500).json({ message: "Siparişler silinirken hata oluştu" });
  }
};

const deleteProducts = async (req, res) => {
  const { id } = req.params; 
  try {
    const deletedProduct = await productsModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully", id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting product" });
  }
};

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Dosya yüklenemedi" });
  }

  res.json({ fileUrl: `http://localhost:5500/uploads/${req.file.filename}` });
};

const deleteSuccesOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await successOrderModel.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
}


export {
  userRegister,
  userLogin,
  getAllUsers,
  meUser,
  updateUserName,
  updateEmail,
  updatePassword,
  updatePhone,
  deleteUser,
  getProducts,
  getAllNameProducts,
  addProduct,
  getWishList,
  addWishlist,
  deleteWishListItem,
  wishlistStatus,
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  successOrders,
  updateUserInfo,
  deleteAllOrders,
  postStripe,
  updateUserAddress,
  updateUserTown,
  updateName,
  updateSurName,
  getAllProducts,
  deleteProducts,
  updateProduct,
  uploadImage,
  deleteUserAdmin,
  updateUserAdmin,
  getAllSuccessOrders,
  updateSuccesOrders,
  deleteSuccesOrder,
  addSubscriber,
  getSuccessOrdersByUserId,
};
