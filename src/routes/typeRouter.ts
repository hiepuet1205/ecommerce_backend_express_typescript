import { Router } from "express";
import { createType, deleteType, getAllType, updateType } from "../controllers/typeController";
import { restrictTo, verifyAccessToken } from "../middlewares/authMiddleware";
import { validateCreateType, validateUpdateType } from "../middlewares/validate/type";
const router = Router();

router.get('/', getAllType);

router.use(verifyAccessToken, restrictTo(['ADMIN']))

router.put('/:id', validateUpdateType, updateType);
router.delete('/:id', deleteType);
router.post('/', validateCreateType, createType);

export default router;