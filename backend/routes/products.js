import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getTopProducts,
  updateProduct,
} from "../controllers/products/productCtrl.js";
import { admin, protect } from "../middleware/authMidl.js";
import { createReview } from "../controllers/products/reviewsCtrl.js";
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);

// reviews
router.route("/:id/reviews").post(protect, checkObjectId, createReview);

// Top products
// router.route("/top").get(getTopProducts);
router.get("/top", getTopProducts);

//
router
  .route("/:id")
  .get(checkObjectId, getProduct)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export { router as productRouter };
