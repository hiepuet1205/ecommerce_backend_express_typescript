import { Router } from "express";
import { cancelOrder, createOrder, getAllOrder, getAllOrderOfUser, getDetailsOrder } from "../controllers/orderController";
import { restrictTo, verifyAccessToken } from "../middlewares/authMiddleware";
const router = Router();

router.use(verifyAccessToken)
router.get('/get-all-order', restrictTo(['ADMIN']), getAllOrder);

router.get('/:id', getDetailsOrder);
router.delete('/:id', cancelOrder);
router.post('/', createOrder);
router.get('/', getAllOrderOfUser);

export default router;