import { Router } from "express";
const router = Router();

import { createProduct, updateProduct, deleteProduct, deleteManyProduct, getProduct, getAllProducts, getProductOfType, getAllType } from "../controllers/productController";
import { validateCreateProduct, validateDeleteManyProduct, validateGetProductOfType, validateUpdateProduct } from "../middlewares/validate/product";
import { verifyAccessToken, restrictTo } from "../middlewares/authMiddleware";

router.get('/get-product-of-type', validateGetProductOfType, getProductOfType);
router.get('/get-all-type', getAllType);
router.get('/:id', getProduct);
router.get('/', getAllProducts);

router.use(verifyAccessToken, restrictTo(['ADMIN']))

router.post('/:id', validateCreateProduct, createProduct);
router.patch('/:id', validateUpdateProduct, updateProduct);
router.delete('/:id', deleteProduct);
router.delete('/delete-many', validateDeleteManyProduct, deleteManyProduct);

export default router;