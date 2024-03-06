import { Router } from "express";
const router = Router();

import { register, updateUser, deleteUser, deleteManyUser, getUser, getAllUser, getInfo, updateInfo, createUser, forgotPassword, resetPassword, updatePassword } from "../controllers/userController";
import { validateRegister, validateUpdateUser, validateDeleteManyUser, validateForgotPassword, validateResetPassword, validateUpdatePassword } from "../middlewares/validate/user";
import { verifyAccessToken, restrictTo } from "../middlewares/authMiddleware";
import { uploadImage } from "../middlewares/multerMiddleware";

router.post('/signup', validateRegister, register);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.patch('/reset-password/:token', validateResetPassword, resetPassword);

router.use(verifyAccessToken);
router.get('/info', getInfo);
router.put('/update-info', uploadImage.single('avatar'), updateInfo);
router.put('/update-password', validateUpdatePassword, updatePassword);

router.use(restrictTo(['ADMIN']));
router.delete('/delete-many', validateDeleteManyUser, deleteManyUser);
router.get('/:id', getUser);
router.patch('/:id', uploadImage.single('avatar'), validateUpdateUser, updateUser);
router.delete('/:id', deleteUser);
router.get('/', getAllUser);
router.post('/', uploadImage.single('avatar'), createUser)

export default router;