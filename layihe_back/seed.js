import mongoose from "mongoose";
import dotenv from "dotenv";
import productsModel from "./models/productsModel.js";

dotenv.config();

// Test məqsədli placeholder şəkillər (picsum.photos - pulsuz, açıq mənbə)
const img = (seed) => `https://picsum.photos/seed/${seed}/600/800`;

const sizesFor = (name, category) => {
  if (name === "kids") {
    if (category === "shoes") return ["29", "30", "31", "32", "33", "34", "35"];
    return ["6", "7", "8", "9", "10", "11", "12"];
  }
  if (category === "jacket" || category === "t-shirts") return ["xs", "s", "m", "xl", "xll"];
  if (category === "shoes")
    return name === "man"
      ? ["39", "40", "41", "42", "43", "44", "45"]
      : ["36", "37", "38", "39", "40", "41", "42"];
  if (category === "jeans")
    return name === "man"
      ? ["29", "30", "31", "32", "33", "34", "35", "36"]
      : ["25", "26", "27", "28", "29", "30", "31", "32", "33", "34"];
  return ["s", "m", "l"];
};

const names = ["man", "woman", "kids"];
const categories = ["jacket", "jeans", "shoes", "t-shirts"];

const productTitles = {
  jacket: ["Classic Bomber Jacket", "Denim Jacket", "Puffer Jacket", "Leather Biker Jacket"],
  jeans: ["Slim Fit Jeans", "Straight Leg Jeans", "Ripped Jeans", "Mom Fit Jeans"],
  shoes: ["Running Sneakers", "Canvas Sneakers", "Chunky Sole Sneakers", "Classic Sneakers"],
  "t-shirts": ["Basic Cotton Tee", "Oversized T-Shirt", "Graphic Print Tee", "Long Sleeve Tee"],
};

const products = [];
let seedCounter = 1;

names.forEach((name) => {
  categories.forEach((category) => {
    productTitles[category].forEach((title, i) => {
      products.push({
        name,
        category,
        description: `${title} - ${name}`,
        info: `${title} üçün rahat və keyfiyyətli material istifadə olunub. Gündəlik istifadə üçün ideal seçimdir.`,
        price: Math.floor(Math.random() * (180 - 25 + 1) + 25),
        sizes: sizesFor(name, category),
        images: [img(`${name}-${category}-${i}-${seedCounter}`), img(`${name}-${category}-${i}-alt-${seedCounter}`)],
        defaultColor: ["black", "white", "beige", "navy"][i % 4],
        variants: [],
      });
      seedCounter++;
    });
  });
});

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB-yə qoşuldu, seed başlayır...");

    await productsModel.deleteMany({}); // köhnə/boş datanı təmizlə
    const inserted = await productsModel.insertMany(products);

    console.log(`${inserted.length} məhsul uğurla əlavə olundu.`);
    process.exit(0);
  } catch (err) {
    console.error("Seed xətası:", err.message);
    process.exit(1);
  }
};

run();
