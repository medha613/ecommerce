const  Fuse  = require("fuse.js");
const Product = require("../../model/product.model");

const saveProduct = async (req, res) => {
  const { name, price, quantity, stock } = req.body;
  try {
    const isExistingProduct = await Product.findOne({ name });
    if (isExistingProduct) {
      return res.status(404).json({
        message: "Product Already Exist",
      });
    }

    const createProduct = await Product.create({
      name,
      price,
      quantity,
      stock,
    });
    return res.status(201).json({
      message: "Product Created",
      data: createProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const isProductExist = await Product.findById(id);
    if (!isProductExist) {
      return res.status(404).json({
        message: "Product doesn't Exist for deleting.",
      });
    }
    await Product.deleteOne({ _id: id });
    return res.status(200).json({
      message: `Product with this id: ${id} deleted successfully!!`,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const isProductExist = await Product.findById(id);
    if (!isProductExist) {
      return res.status(404).json({
        message: "Product doesn't exist for this id",
      });
    }

    await Product.updateOne({ id }, { $set: data });
    return res.status(201).json({
      message: "Product Updated Successfully!!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchString = req.query.searchString || ""; 

    const paginationOptions = { page, limit };
    const products = await Product.paginate({}, paginationOptions);
    const productList = products.docs; 

    let afterFuserSearch = productList;
    
    if (searchString) {
      const Fuse = require("fuse.js"); 
      const fuse = new Fuse(productList, {
        keys: ["name"], 
        threshold: 0.3 
      });

      afterFuserSearch = fuse.search(searchString).map(result => result.item);
    }

    if (!afterFuserSearch.length) {
      return res.status(404).json({ message: "No products found matching your search." });
    }

    const totalProducts = await Product.countDocuments();
    const totaPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      data: {
        products: afterFuserSearch, 
        totalProducts,
        totaPages,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  saveProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
};
