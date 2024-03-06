import { Router } from "express";
const router = Router();

import { createProduct, updateProduct, deleteProduct, deleteManyProduct, getProduct, getAllProducts, getProductOfType } from "../controllers/productController";
import { validateCreateProduct, validateDeleteManyProduct, validateGetProductOfType, validateUpdateProduct } from "../middlewares/validate/product";
import { verifyAccessToken, restrictTo } from "../middlewares/authMiddleware";
import { uploadImage } from "../middlewares/multerMiddleware";

router.get('/get-product-of-type', validateGetProductOfType, getProductOfType);
router.get('/:id', getProduct);
router.get('/', getAllProducts);

router.use(verifyAccessToken, restrictTo(['ADMIN']))

router.delete('/delete-many', validateDeleteManyProduct, deleteManyProduct);
router.patch('/:id', validateUpdateProduct, updateProduct);
router.delete('/:id', deleteProduct);
router.post('/', uploadImage.array('image'), validateCreateProduct, createProduct);

export default router;