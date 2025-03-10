const Category = require("../models/Categorymodel");
const Product = require("../models/Productmodel");

async function createProduct(reqData) {
  // console.log(reqData);

  let topLevel = await Category.findOne({ name: reqData.topLevelCategory });

  if (!topLevel) {
    topLevel = new Category({
      name: reqData.topLevelCategory,
      level: 1,
    });

    await topLevel.save();
  }

  console.log(reqData);

  let secondLevel = await Category.findOne({
    name: reqData.secondLevelCategory,
    parentCategory: topLevel._id,
  });

  if (!secondLevel) {
    secondLevel = new Category({
      name: reqData.secondLevelCategory,
      parentCategory: topLevel._id,
      level: 2,
    });

    await secondLevel.save();
  }

  let thirdLevel = await Category.findOne({
    name: reqData.thirdLevelCategory,
    parentCategory: secondLevel._id,
  });

  // return thirdLevel;

  if (!thirdLevel) {
    thirdLevel = new Category({
      name: reqData.thirdLevelCategory,
      parentCategory: secondLevel._id,
      level: 3,
    });

    await thirdLevel.save();
  }

  const product = new Product({
    title: reqData.title,
    color: reqData.color,
    description: reqData.description,
    discountedPrice: reqData.discountedPrice,
    discountedPercent: reqData.discountedPercent,
    imageUrl: reqData.imageUrl,
    brand: reqData.brand, // ✅ Fixed: was incorrectly set to imageUrl
    price: reqData.price,
    sizes: reqData.size,
    quantity: reqData.quantity,
    category: thirdLevel._id,
  });

  // return product;

  return await product.save();
}

async function deleteProduct(productId) {
  const product = await findProductById(productId);

  await Product.findByIdAndDelete(productId);

  return "Product deleted Successfully";
}

async function updateProduct(prodcutId, reqData) {
  const updatedProduct = await Product.findByIdAndUpdate(prodcutId, reqData);
}

async function findProductById(id) {
  const product = await Product.findById(id).populate("category").exec();

  if (!product) {
    throw new Error("Product not found with id " + id);
  }

  return product;
}

// async function getAllProdcuts(reqQuery) {
//   let {
//     category,
//     color,
//     sizes,
//     minPrice,
//     maxPrice,
//     minDiscount,
//     sort,
//     stock,
//     pageNumber,
//     pageSize,
//   } = reqQuery;

//   pageSize = pageSize || 10;

//   let query = Product.find().populate("category");

//   if (category) {
//     const existCategory = await Category.findOne({ name: category });

//     if (existCategory) {
//       query = query.where("category").equals(existCategory._id);
//     } else {
//       return { content: [], currentPage: 1, totalPages: 0 };
//     }
//   }

//   if (color) {
//     const colorSet = new Set(
//       color.split(",").map((color) => color.trim().toLowerCase())
//     );

//     const colorRegex =
//       colorSet > 0 ? new RegExp([...colorSet].join("|"), "i") : null;

//     query = query.where("color").regex(colorRegex);
//   }

//   if (sizes) {
//     const sizeSet = new Set(sizes);

//     query.query.where("sizes.name").in([...sizeSet]);
//   }

//   if (minPrice && maxPrice) {
//     query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
//   }

//   if (minDiscount) {
//     query = query.where("discountPercent").gt(minDiscount);
//   }

//   if (stock) {
//     if (stock == "in_stock") {
//       query = query.where("quantity").gt(0);
//     } else if (stock == "out_of_stock") {
//       query = query.where("quantity").gt(1);
//     }
//   }

//   if (sort) {
//     const sortDirection = sort === "price_height" ? -1 : 1;
//     query = query.sort({ discountedPrice: sortDirection });
//   }

//   const totalProducts = await Product.countDocuments(query);

//   const skip = (pageNumber - 1) * pageSize;

//   query = query.skip(skip).limit(pageSize);

//   const products = await query.exec();

//   const totalPages = Math.ceil(totalProducts / pageSize);

//   return { content: products, currentPage: pageNumber, totalPages };
// }

async function getAllProdcuts(reqQuery) {
  let {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqQuery;

  // ✅ Convert & Normalize Query Parameters
  pageNumber = pageNumber ? Number(pageNumber) : 1;
  pageSize = pageSize ? Number(pageSize) : 10;
  minPrice = minPrice && minPrice !== "0" ? Number(minPrice) : undefined;
  maxPrice = maxPrice && maxPrice !== "0" ? Number(maxPrice) : undefined;
  minDiscount =
    minDiscount && minDiscount !== "0" ? Number(minDiscount) : undefined;
  stock = stock && stock !== "null" ? stock : undefined;
  sort = sort && sort !== "null" ? sort : undefined;
  color = color && color !== "0" && color !== "" ? color : undefined;
  sizes = sizes && sizes !== "0" && sizes !== "" ? sizes : undefined;

  console.log("🚀 Normalized Query Parameters:", {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
  });

  let query = Product.find().populate("category");

  // ✅ Filter by Category
  if (category) {
    const existCategory = await Category.findOne({ name: category });
    if (existCategory) {
      console.log("✅ Category found:", existCategory);
      query = query.where("category").equals(existCategory._id);
    } else {
      console.log("❌ No category found for:", category);
      return { content: [], currentPage: 1, totalPages: 0 };
    }
  }

  // ✅ Filter by Color
  if (color) {
    console.log("🎨 Filtering by color:", color);
    const colorSet = new Set(
      color.split(",").map((c) => c.trim().toLowerCase())
    );
    const colorRegex =
      colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    if (colorRegex) {
      query = query.where("color").regex(colorRegex);
    }
  }

  // ✅ Filter by Sizes
  if (sizes) {
    console.log("📏 Filtering by sizes:", sizes);
    const sizeSet = new Set(sizes.split(","));
    query = query.where("sizes.name").in([...sizeSet]);
  }

  // ✅ Filter by Price Range
  if (minPrice !== undefined && maxPrice !== undefined) {
    console.log("💰 Filtering by price:", { minPrice, maxPrice });
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  // ✅ Filter by Minimum Discount
  if (minDiscount !== undefined) {
    console.log("🎯 Filtering by min discount:", minDiscount);
    query = query.where("discountPercent").gt(minDiscount);
  }

  // ✅ Filter by Stock
  if (stock) {
    console.log("📦 Filtering by stock:", stock);
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }
  }

  // ✅ Apply Sorting
  if (sort) {
    console.log("📊 Sorting by:", sort);
    const sortDirection = sort === "price_height" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  // ✅ Get Total Count Before Pagination
  const totalProducts = await Product.countDocuments(query.getFilter());

  // ✅ Apply Pagination
  const skip = Math.max(0, (pageNumber - 1) * pageSize);
  query = query.skip(skip).limit(pageSize);

  // ✅ Execute Query After Filters
  const products = await query.exec();
  console.log("✅ Final Products:", products);

  // ✅ Calculate Total Pages
  const totalPages = Math.ceil(totalProducts / pageSize);
  return { content: products, currentPage: pageNumber, totalPages };
}

async function fetchAllProducts() {
  try {
    // ✅ Fetch all products from the database and populate the category field
    const products = await Product.find().populate("category");

    // ✅ Return the fetched products
    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return { success: false, message: error.message };
  }
}

async function createMultipleProduct(products) {
  // console.log(products);

  for (let product of products) {
    await createProduct(product);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProdcuts,
  findProductById,
  createMultipleProduct,
  fetchAllProducts,
};
